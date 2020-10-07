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
            @click="
              () =>
                action.type === 'drawCard'
                  ? requestDrawCard()
                  : action.handler(gameState, playerState) &&
                    action.handler(serverState, playerState)
            "
          />
        </StackLayout>
      </ScrollView>

      <!-- Draw -->
      <Card
        column="0"
        row="2"
        :name="`draw${gameState.cardsInDeck.length}`"
        @click="requestDrawCard"
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
      <Card column="2" row="2" name="end round" @click="playerEndRound" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Lobby from "./Lobby.vue";
import { setTimeout, clearTimeout } from "tns-core-modules/timer";
import { newGame, newPlayer, playerActions } from "../game/client";
import { setupGame, roundSteps, serverActions } from "../game/local-server";
import { serverResponse } from "../game/server-response";
import { GameState, PlayerState } from "../game/types";
import { cloneDeep } from "lodash";

export default {
  props: {},
  data(): {
    playerState: PlayerState;
    serverState: GameState; // We should have separate types for server/game state, where one permits unknown cards but the other does not.
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
    this.serverState = cloneDeep(this.gameState); // just to test
    this.playerState = this.gameState.players[0];
  },
  async destroyed() {},
  computed: {},
  watch: {
    "playerState.availableActions"() {
      if (!this.playerState.availableActions.length && this.isLocal) {
        // This should be a server action with a server response, rather than handled here. But, PoC phase.
        roundSteps[this.step++ % roundSteps.length](
          this.gameState,
          this.playerState
        );
      }
    },
  },
  methods: {
    sendMessage(payload) {
      // There's still a question here of whether child components will be responsible for sending/receiving messages.
      // Current architecture is no, everything is done in the global Game component. But not much thought has gone into that, other than keeping it simple.
      // This could even be a mixin though.
      if (this.isLocal) {
        // Perform local server action immediately
        const response = serverActions[payload.type].handler(
          this.gameState,
          this.serverState,
          this.playerState
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
      if (payload.response.type === "drawCard") {
        serverResponse.drawCard.handler(
          this.gameState,
          this.serverState,
          this.playerState,
          payload.response.drawnCard,
          payload.response.cardsInDiscard,
          payload.response.cardsInDeck
        );
      } else {
        console.warn(
          "unrecognised type - game logic not fully implemented yet"
        );
      }
    },
    requestDrawCard() {
      playerActions.drawCard.handler(this.gameState, this.playerState);
      this.sendMessage({ type: "drawCard" });
    },
    requestPlayCard() {},
    playerEndRound() {},
    async leaveGame() {
      this.$navigateTo(Lobby);
    },
  },
};
</script>

<style scoped></style>
