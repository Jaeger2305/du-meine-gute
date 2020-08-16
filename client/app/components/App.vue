<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!" />
    <GridLayout columns="*" rows="*">
      <Button text="fetchGames" @tap="fetchGames" />
      <Label class="message" :text="msg" col="0" row="0" />
      <ListView for="game in games">
        <v-template>
          <Label class="message" :text="JSON.stringify(game)" col="0" row="0" />
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
const axios = require("axios");
var orientation = require("nativescript-orientation");
orientation.enableRotation();
orientation.setOrientation("landscape");
console.log(orientation.getOrientation()); // Returns the enum DeviceOrientation value
export default {
  data() {
    return {
      msg: "Hello Worldfgddddd!",
      games: [],
    };
  },
  methods: {
    async fetchGames() {
      let response;
      try {
        console.log("trying");
        // response = await axios({
        //   method: "get",
        //   url: "https://10.0.2.2:8080",
        //   responseType: "json",
        // });
        response = await fetch("http://10.0.2.2:4444/game");
        console.log("got here at least");
        const data = await response.json();
        console.log(data);
        this.games = data;
      } catch (error) {
        console.error("the localhost fetch failed.", error);
      }
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
