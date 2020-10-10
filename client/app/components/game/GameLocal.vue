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
            :key="action"
            :name="action"
            :isEnabled="false"
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
          <PlayerHand
            :cards="playerState.cardsInHand"
            :availableActions="playerState.availableActions"
            @player-action="playerAction"
          />
        </StackLayout>
      </ScrollView>

      <!-- Discard -->
      <Discard
        column="2"
        row="2"
        name="end step"
        :cardsInDiscard="gameState.cardsInDiscard"
        :availableActions="playerState.availableActions"
        @player-action="playerAction"
      />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Lobby from "../Lobby.vue";
import { setTimeout, clearTimeout } from "tns-core-modules/timer";
import { newGame, newPlayer, playerActions } from "../../game/client";
import { setupGame, serverActions } from "../../game/server-action";
import { serverResponse } from "../../game/server-response";
import {
  GameState,
  PlayerState,
  PlayerActionEnum,
  ServerActionEnum,
  ServerActionRequest,
} from "../../game/types";
import { cloneDeep } from "lodash";
import { isActionAvailable } from "../../game/utils";
import { ServerActionResponse } from "../../game/server-action/types";
import { PlayerAction } from "../../game/types";

export default {
  props: {},
  data(): {
    playerState: PlayerState;
    serverState: GameState | null; // We should have separate types for server/game state, where one permits unknown cards but the other does not.
    gameState: GameState; // The UI should use only the gameState, and the serverState is used for local games. Keeping these in sync will be a challenge.
    messages: Array<any>;
    isLocal: boolean;
    playerActions: typeof playerActions;
  } {
    return {
      isLocal: true,
      serverState: newGame(),
      gameState: newGame(),
      messages: [],
      playerState: newPlayer(),
      playerActions,
    };
  },
  created() {
    setupGame(this.gameState);
    this.serverState = this.isLocal ? cloneDeep(this.gameState) : null; // just to test
    this.playerState = this.gameState.players[0];
  },
  async destroyed() {},
  computed: {},
  methods: {
    playerAction(type: PlayerActionEnum, payload: any) {
      const playerActionResponse = playerActions[type](
        this.gameState,
        this.playerState,
        payload
      );
      this.sendMessage({ type, playerActionResponse });
    },
    sendMessage(payload: ServerActionRequest) {
      // There's still a question here of whether child components will be responsible for sending/receiving messages.
      // Current architecture is no, everything is done in the global Game component. But not much thought has gone into that, other than keeping it simple.
      // This could even be a mixin though.
      if (this.isLocal) {
        // Perform local server action immediately
        const serverActionResponse = serverActions[payload.type](
          this.serverState,
          this.playerState.playerNumber,
          payload.playerActionResponse
        );
        this.receiveMessage(serverActionResponse);
      } else {
        // There's no socket integration with this yet - PoC phase.
        console.error(
          "No socket integration set up yet - Go server isn't feature complete like the local server"
        );
        // this.socket.send(JSON.stringify(message));
      }
    },
    receiveMessage(payload: ServerActionResponse) {
      // Should be using enums here, and the separate game logic folders
      const handler = serverResponse[payload.type];
      if (handler) {
        handler(this.gameState, this.playerState, payload.response);
      } else {
        console.warn(
          "unrecognised type - game logic not fully implemented yet"
        );
      }
    },
    requestPlayCard() {},
    async leaveGame() {
      this.$navigateTo(Lobby);
    },
  },
};
</script>

<style scoped></style>
