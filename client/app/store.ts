import Vue from "vue";
import Vuex from "vuex";

import { newGame, newPlayer, playerActions } from "./game/client";
import { setupGame, serverActions } from "./game/server-action";
import { serverResponse } from "./game/server-response";
import {
  GameState,
  PlayerState,
  ServerActionRequest,
  PlayerActionEnum,
  Card,
} from "./game/types";
import { cloneDeep } from "lodash";
import { ServerActionResponse } from "./game/server-action/types";

Vue.use(Vuex);

const state: {
  playerState: PlayerState;
  serverState: GameState | null; // We should have separate types for server/game state, where one permits unknown cards but the other does not.
  gameState: GameState; // The UI should use only the gameState, and the serverState is used for local games. Keeping these in sync will be a challenge.
  messages: Array<any>;
  isLocal: boolean;
  stagedCardsForDiscard: Array<Card>;
} = {
  isLocal: true,
  serverState: newGame(),
  gameState: newGame(),
  messages: [],
  playerState: newPlayer(),
  stagedCardsForDiscard: [],
};

export enum MutationEnum {
  ReceiveMessage = "RECEIVE_MESSAGE",
  SetupGame = "SETUP_GAME",
  StageCardDiscard = "STAGE_CARD_DISCARD",
  ResetDiscard = "RESET_DISCARD",
}

export enum ActionEnum {
  PlayerAction = "PLAYER_ACTION",
  SendMessage = "SEND_MESSAGE",
}

export default new Vuex.Store({
  state,
  mutations: {
    [MutationEnum.SetupGame](state) {
      Vue.set(state, "gameState", newGame());
      Vue.set(state, "messages", []);
      setupGame(state.gameState);

      Vue.set(state, "playerState", state.gameState.players[0]);
      Vue.set(
        state,
        "serverState",
        state.isLocal ? cloneDeep(state.gameState) : null
      ); // just to test
    },
    [MutationEnum.ReceiveMessage](state, payload: ServerActionResponse) {
      state.messages.push("RECEIVED:" + JSON.stringify(payload));
      // If explicitly nothing, do nothing with this message.
      // This is probably because the optimistic response was sufficient.
      if (payload.type === null) return;
      // Should be using enums here, and the separate game logic folders
      const handler = serverResponse[payload.type];
      if (handler) {
        handler(state.gameState, state.playerState, payload.response);
      } else {
        console.warn(
          "unrecognised type - game logic not fully implemented yet"
        );
      }
    },
    /** Either adds or removes a card into the temporary state that contains cards that will be discarded once confirmed. */
    [MutationEnum.StageCardDiscard](state, payload: Card) {
      const stagedCardIndex = state.stagedCardsForDiscard.findIndex(
        ({ name }) => name === payload.name
      );
      if (stagedCardIndex < 0) state.stagedCardsForDiscard.push(payload);
      else state.stagedCardsForDiscard.splice(stagedCardIndex, 1);
    },
    /** Empty the discard state after the user submitted/resetted the selected cards
     * This is inconsistent with the other modifications, which all go through the game state and server response.
     * Perhaps they all need converting to store mutations, or this should be converted to a normal player state.
     * Having it as part of the player state would be a more portable implementation, but less Vue oriented.
     */
    [MutationEnum.ResetDiscard](state) {
      state.stagedCardsForDiscard.splice(0, state.stagedCardsForDiscard.length);
    },
  },
  actions: {
    async [ActionEnum.PlayerAction](
      { state, dispatch },
      payload: { type: PlayerActionEnum; payload: any }
    ) {
      const playerActionResponse = await playerActions[payload.type](
        state.gameState,
        state.playerState,
        payload.payload
      );
      dispatch(ActionEnum.SendMessage, {
        type: payload.type,
        playerActionResponse,
      });
    },
    [ActionEnum.SendMessage]({ state, commit }, payload: ServerActionRequest) {
      // There's still a question here of whether child components will be responsible for sending/receiving messages.
      // Current architecture is no, everything is done in the global Game component. But not much thought has gone into that, other than keeping it simple.
      // This could even be a mixin though.
      state.messages.push("SENT:" + JSON.stringify(payload));
      if (state.isLocal) {
        // Perform local server action immediately
        const serverActionResponse = serverActions[payload.type](
          state.serverState,
          state.playerState.playerNumber,
          payload.playerActionResponse
        );
        commit(MutationEnum.ReceiveMessage, serverActionResponse);
      } else {
        // There's no socket integration with this yet - PoC phase.
        console.error(
          "No socket integration set up yet - Go server isn't feature complete like the local server"
        );
        // this.socket.send(JSON.stringify(message));
      }
    },
  },
});
