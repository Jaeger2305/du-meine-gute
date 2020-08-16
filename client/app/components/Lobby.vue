<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="*">
      <Button text="fetchGames" @tap="fetchGames" />
      <ListView for="game in games">
        <v-template>
          <GameListItem :game="game" />
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
export default {
  data() {
    return {
      games: [],
    };
  },
  async created() {
    await this.fetchGames();
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
