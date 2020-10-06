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
      <Button column="2" row="0" text="ready?" @tap="playerReady" />

      <!-- Event space (e.g. the market) -->
      <!-- For now though, this is available actions -->
      <ScrollView column="1" row="1" orientation="horizontal">
        <StackLayout column="1" orientation="horizontal">
          <Card
            v-for="action in playerState.availableActions"
            :key="action.type"
            :name="action.type"
            @click="
              () => {
                console.log(`clicked ${action.type}`);
                action.handler(gameState, playerState);
              }
            "
          />
        </StackLayout>
      </ScrollView>

      <!-- Draw -->
      <Card
        column="0"
        row="2"
        :name="`draw${cardsInDeck.length}`"
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
import { newGame, playerActions } from "../game";
import { setupGame, roundSteps } from "../local-server";

export default {
  props: {},
  data() {
    return {
      gameState: newGame(),
      messages: [],
      cardsInDeck: [],
      playerState: {
        id: "",
        playerNumber: 0,
        player: {},
        cardsInHand: [],
        cardsInPlay: [],
        availableActions: [],
        employees: [],
        assignedEmployees: [],
        resources: [],
        reservedFactory: null,
      },
      playerActions,
      step: 0,
      console,
    };
  },
  created() {
    setupGame(this.gameState);
    this.playerState = this.gameState.players[0];
  },
  async destroyed() {},
  computed: {},
  watch: {
    "playerState.availableActions"() {
      if (!this.playerState.availableActions.length) {
        console.log("triggering next step in round");
        roundSteps[this.step++ % roundSteps.length](
          this.gameState,
          this.playerState
        );
      }
    },
  },
  methods: {
    requestDrawCard() {},
    requestPlayCard() {},
    playerEndRound() {},
    async leaveGame() {
      this.$navigateTo(Lobby);
    },
  },
};
</script>

<style scoped></style>
