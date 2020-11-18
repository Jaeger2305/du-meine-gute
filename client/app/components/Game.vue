<template>
  <Page>
    <ActionBar :title="game.name" />
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
      <!-- For now though, this is played cards -->
      <ScrollView column="1" row="1" orientation="horizontal">
        <StackLayout column="1" orientation="horizontal">
          <Card
            v-for="card in playerState.cardsInPlay"
            :key="card.name"
            :name="card.name"
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

const WS = require("nativescript-websockets");

const socketRetryLimit = 3;
const socketRetryDelay = 5 * 1000; // 5 seconds
const NORMAL_CLOSURE_CODE = 1000;
const GOING_AWAY_CODE = 1001;

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      socketRetryCount: 0,
      socket: null,
      messages: [],
    };
  },
  created() {
    this.setUpWebsocket();
  },
  async destroyed() {
    if (![WS.CLOSED, WS.CLOSING].includes(this.socket.readyState)) {
      console.log("component being destroyed, will leave the game.");
      return this.leaveGame();
    }
  },
  computed: {
    playerState() {
      return (
        this.game.state.players?.[0] || {
          cardsInHand: [],
          cardsInPlay: [],
        }
      );
    },
    cardsInDeck() {
      return this.game.state.cardsInDeck ?? [];
    },
  },
  methods: {
    async setUpWebsocket() {
      // Adding the bearer token here might have been the cause for the error I'm now getting:
      // JS: The Socket was Closed: 1002 draft Draft_6455 extension: DefaultExtension refuses handshake
      this.socketRetryCount += 1;
      var gameSocket = new WebSocket(`${dmgAppConfig.wsUrl}/game/live`, [
        getString("authtoken"),
        /* "protocol","another protocol" */
      ]);
      gameSocket.addEventListener("open", this.openedSocket);
      gameSocket.addEventListener("message", this.receiveMessage);
      gameSocket.addEventListener("close", this.closedSocket);
      gameSocket.addEventListener("error", this.erroredSocket);
      this.socket = gameSocket;
    },
    openedSocket(evt) {
      this.socketRetryCount = 0;
      this.messages.unshift("opened websocket");
    },
    erroredSocket(evt) {
      console.log(evt);
      this.messages.unshift("errored websocket");
    },
    closedSocket(evt) {
      this.messages.unshift("closed websocket");
      console.log("The Socket was Closed:", evt.code, evt.reason);
      if (
        this.socketRetryCount <= socketRetryLimit &&
        evt.code !== GOING_AWAY_CODE
      )
        setTimeout(() => this.setUpWebsocket(), socketRetryDelay);
    },
    receiveMessage(evt) {
      this.messages.unshift(evt.data);
      const parsedMessage = JSON.parse(evt.data);
      if (parsedMessage.messageType === "drawCard") {
        this.playerState.cardsInHand.push(parsedMessage.body);
      } else if (parsedMessage.messageType === "playCard") {
        // Simplistically handle playing the card (not syncing with the server or anything, and won't hold up well on many simultaneous clicks!)
        this.playerState.cardsInPlay.push(parsedMessage.body);
        const cardIndex = this.playerState.cardsInHand.findIndex(
          (card) => card.name === parsedMessage.body.name
        );
        this.playerState.cardsInHand.splice(cardIndex, 1);
      } else if (parsedMessage.messageType === "gameReady") {
        // Simplistically handle playing the card (not syncing with the server or anything, and won't hold up well on many simultaneous clicks!)
        this.playerState.cardsInHand.push(...parsedMessage.body.startingCards);
        this.cardsInDeck.push(...parsedMessage.body.cardsInDeck);
        const cardIndex = this.playerState.cardsInHand.findIndex(
          (card) => card.name === parsedMessage.body.name
        );
        this.playerState.cardsInHand.splice(cardIndex, 1);
      }
    },
    requestDrawCard(card) {
      const request = {
        messageType: "requestDrawCard",
        body: {},
      };
      this.sendMessage(request);
    },
    requestPlayCard(card) {
      const request = {
        messageType: "requestPlayCard",
        body: {
          cardName: card.name,
        },
      };
      this.sendMessage(request);
    },
    playerEndRound(card) {
      const request = {
        messageType: "playerEndRound",
        body: {},
      };
      this.sendMessage(request);
    },
    playerReady(card) {
      const request = {
        messageType: "playerReady",
        body: {},
      };
      this.sendMessage(request);
    },
    async sendMessage(message) {
      // Attach any necessary metadata, then stringify up for transport.
      this.socket.send(JSON.stringify(message));
    },
    async leaveGame() {
      this.socket.close(GOING_AWAY_CODE, "user left game");
      const response = await fetch(`${dmgAppConfig.apiUrl}/game/leave`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${getString("authtoken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GameID: this.game._id,
        }),
      });
      const data = await response.json();
      setString("authtoken", data.Body);

      this.$navigateTo(Lobby, { frame: "base" });
    },
  },
};
</script>

<style scoped></style>
