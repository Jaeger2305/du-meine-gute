<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*, *, *" rows="*, *, 5*">
      <Label column="0" row="0" :text="`welcome ${savedUsername}`" />
      <Button column="1" row="0" text="logout" @tap="logout" />
      <Button column="0" row="1" text="fetchGames" @tap="fetchGames" />
      <Button column="1" row="1" text="createGame" @tap="createGame" />
      <Button
        column="2"
        row="1"
        text="createLocalGame"
        @tap="createLocalGame"
      />
      <ListView row="2" colSpan="3" for="game in games">
        <v-template>
          <GameListItem :game="game" />
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Login from "./Login.vue";
import GameLocal from "./game/GameLocal.vue";

export default {
  data() {
    return {
      games: [],
      savedUsername: getString("username"),
    };
  },
  async created() {
    await this.fetchGames();
  },
  methods: {
    logout() {
      console.warn(
        "user hasn't logged out of the API, so may still be in an actual game."
      );
      setString("username", "");
      setString("activegame", "");
      setString("authtokem", "");
      this.$navigateTo(Login, { frame: "base" });
    },
    async fetchGames() {
      try {
        const response = await fetch(`${dmgAppConfig.apiUrl}/game`, {
          headers: {
            authorization: `Bearer ${getString("authtoken")}`,
          },
        });
        const data = await response.json();
        this.games = data;
      } catch (error) {
        console.error("the localhost fetch failed.", error);
      }
    },
    async createGame() {
      try {
        const response = await fetch(`${dmgAppConfig.apiUrl}/game`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${getString("authtoken")}`,
          },
          body: JSON.stringify({
            Name: `test-${Date.now()}`,
          }),
        });
        const data = await response.json();
        await this.fetchGames();
      } catch (error) {
        console.error("the localhost fetch failed.", error);
      }
    },
    async createLocalGame() {
      this.$navigateTo(GameLocal, { frame: "base" });
    },
  },
};
</script>

<style scoped></style>
