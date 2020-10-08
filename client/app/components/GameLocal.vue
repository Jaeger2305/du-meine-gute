<template>
  <Page actionBarHidden="true">
    <!-- The overall grid -->
    <!-- | ---- | --------------------history------------------ | sett | -->
    <!-- | ---- | -----card--------card--------card------------ | ---- | -->
    <!-- | deck | -----card--card--card--card--card--card------ | disc | -->
    <GridLayout columns="*, 4*, *" rows="*, *, *" backgroundColor="#3c495e">
      <!-- History (just websockets for now)  -->
      <ScrollView column="1" row="0" orientation="vertical">
        <StackLayout column="1" orientation="vertical">
          <Label v-for="message in messages" :key="message" :text="message" />
        </StackLayout>
      </ScrollView>

      <!-- Settings -->
      <!-- <Button column="2" row="0" text="ready?" @tap="playerReady" /> -->

      <!-- Event space (e.g. the market) -->
      <!-- For now though, this is available actions -->
      <ScrollView column="1" row="1" orientation="horizontal">
        <StackLayout column="1" orientation="horizontal">
          <Card
            v-for="action in playerState.availableActions"
            :key="action.type"
            :name="action.type"
            :isEnabled="false"
            @click="
              () =>
                action.type === 'drawCard'
                  ? drawCard()
                  : action.handler(gameState, playerState) &&
                    action.handler(serverState, playerState)
            "
          />
        </StackLayout>
      </ScrollView>

      <!-- Draw -->
      <Deck
        column="0"
        row="2"
        :cardsInDeck="gameState.cardsInDeck"
        :availableActions="playerState.availableActions"
        @player-action="playerAction"
      />

      <!-- Player hand -->
      <ScrollView column="1" row="2" orientation="horizontal">
        <StackLayout orientation="horizontal">
          <Card
            v-for="card in playerState.cardsInHand"
            :key="card.name"
            :name="card.name"
            @click="requestPlayCard(card)"
          />
        </StackLayout>
      </ScrollView>

      <!-- Discard -->
      <Card
        column="2"
        row="2"
        name="end step"
        @click="endStep"
        :isEnabled="isEndStepPossible"
      />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Lobby from "./Lobby.vue";
import Deck from "./Deck.vue";
import { setTimeout, clearTimeout } from "tns-core-modules/timer";
import { newGame, newPlayer, playerActions } from "../game/client";
import { setupGame, roundSteps, serverActions } from "../game/server-action";
import { serverResponse } from "../game/server-response";
import {
  GameState,
  PlayerState,
  PlayerActionEnum,
  ServerActionEnum,
} from "../game/types";
import { cloneDeep } from "lodash";
import { isActionAvailable } from "../game/utils";

export default {
  props: {},
  data(): {
    playerState: PlayerState;
    serverState: GameState | null; // We should have separate types for server/game state, where one permits unknown cards but the other does not.
    gameState: GameState; // The UI should use only the gameState, and the serverState is used for local games. Keeping these in sync will be a challenge.
    messages: Array<any>;
    isLocal: boolean;
    playerActions: typeof playerActions;
    step: number;
  } {
    return {
      isLocal: true,
      serverState: newGame(),
      gameState: newGame(),
      messages: [],
      playerState: newPlayer(),
      playerActions,
      step: 0,
    };
  },
  created() {
    setupGame(this.gameState);
    this.serverState = this.isLocal ? cloneDeep(this.gameState) : null; // just to test
    this.playerState = this.gameState.players[0];
  },
  async destroyed() {},
  computed: {
    isEndStepPossible(): boolean {
      return isActionAvailable(
        this.playerState.availableActions,
        PlayerActionEnum.endStep
      );
    },
  },
  watch: {
    "playerState.availableActions"() {
      if (!this.playerState.availableActions.length && this.isLocal) {
        // This should be a server action with a server response, rather than handled here. But, PoC phase.
        // That would need storing the game step in the Game state, rather than just in Vue state.
        roundSteps[this.step++ % roundSteps.length](
          this.gameState,
          this.playerState
        );
      }
    },
  },
  methods: {
    playerAction(type: PlayerActionEnum) {
      playerActions[type].handler(this.gameState, this.playerState);
      this.sendMessage({ type });
    },
    sendMessage(payload) {
      // There's still a question here of whether child components will be responsible for sending/receiving messages.
      // Current architecture is no, everything is done in the global Game component. But not much thought has gone into that, other than keeping it simple.
      // This could even be a mixin though.
      if (this.isLocal) {
        // Perform local server action immediately
        const response = serverActions[payload.type].handler(
          this.gameState,
          this.serverState,
          this.playerState.playerNumber
        );
        this.receiveMessage(response);
      } else {
        // There's no socket integration with this yet - PoC phase.
        console.error(
          "No socket integration set up yet - Go server isn't feature complete like the local server"
        );
        // this.socket.send(JSON.stringify(message));
      }
    },
    receiveMessage(payload) {
      // Should be using enums here, and the separate game logic folders
      const handler = serverResponse[payload.type]?.handler;
      if (handler) {
        handler(
          this.gameState,
          this.serverState,
          this.playerState,
          payload.response
        );
      } else {
        console.warn(
          "unrecognised type - game logic not fully implemented yet"
        );
      }
    },
    requestPlayCard() {},
    endStep() {
      playerActions.endStep.handler(this.gameState, this.playerState);
      playerActions.endStep.handler(this.serverState, this.playerState); // something is buggy here, but maybe it was caching
      this.sendMessage({ type: PlayerActionEnum.endStep });
    },
    async leaveGame() {
      this.$navigateTo(Lobby);
    },
  },
};
</script>

<style scoped></style>
