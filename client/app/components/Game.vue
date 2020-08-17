<template>
  <Page>
    <ActionBar :title="game.Name" />
    <GridLayout columns="*, *, 3*" rows="*" backgroundColor="#3c495e">
      <GridLayout column="0" rows="*, *, *">
        <Button row="0" text="leave" @tap="leaveGame" />
        <Button
          row="1"
          v-if="socket"
          text="drawCard"
          @tap="sendMessage('drawCard')"
        />
        <Button
          row="2"
          v-if="socket"
          text="playCard"
          @tap="sendMessage('playCard')"
        />
      </GridLayout>

      <ScrollView column="1" orientation="vertical">
        <StackLayout column="1" orientation="vertical">
          <Label v-for="message in messages" :key="message" :text="message" />
        </StackLayout>
      </ScrollView>
      <Label column="2" :text="JSON.stringify(game)" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Lobby from "./Lobby.vue";
const WS = require("nativescript-websockets");

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      socket: null,
      messages: [],
    };
  },
  created() {
    this.setUpWebsocket();
  },
  methods: {
    async setUpWebsocket() {
      var gameSocket = new WebSocket(`${dmgAppConfig.apiUrl}/game/live`, [
        /* "protocol","another protocol" */
      ]);
      gameSocket.addEventListener("open", this.openedSocket);
      gameSocket.addEventListener("message", this.messagedSocket);
      gameSocket.addEventListener("close", this.closedSocket);
      gameSocket.addEventListener("error", this.erroredSocket);
      this.socket = gameSocket;
    },
    openedSocket(evt) {
      this.messages.unshift("opened websocket");
    },
    erroredSocket(evt) {
      this.messages.unshift("opened websocket");
    },
    closedSocket(evt) {
      this.messages.unshift("closed websocket");
      console.log("The Socket was Closed:", evt.code, evt.reason);
    },
    messagedSocket(evt) {
      this.messages.unshift(evt.data);
    },
    async sendMessage(message) {
      this.socket.send(message);
    },
    async leaveGame() {
      const response = await fetch(`${dmgAppConfig.apiUrl}/game/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GameID: this.game._id,
        }),
      });
      const data = await response.json();

      this.$navigateTo(Lobby);
    },
  },
};
</script>

<style scoped></style>
