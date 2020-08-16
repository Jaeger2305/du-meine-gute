<template>
  <Page>
    <GridLayout columns="*" rows="*">
      <Button text="fetchGames" @tap="fetchGames" />
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
export default {
  data() {
    return {
      games: [],
    };
  },
  methods: {
    async fetchGames() {
      try {
        const response = await fetch(`${dmgAppConfig.apiUrl}/game`);
        const data = await response.json();
        this.games = data;
      } catch (error) {
        console.error("the localhost fetch failed.", error);
      }
    },
  },
};
</script>

<style scoped></style>
