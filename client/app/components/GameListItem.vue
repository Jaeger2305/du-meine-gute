<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Label :text="game.name" width="70" backgroundColor="#43b883" />
    <Label
      :text="game.state.players.length"
      width="70"
      backgroundColor="#1c6b48"
    />
    <Button text="join" @tap="joinGame" />
  </FlexboxLayout>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Game from "./Game.vue";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async joinGame() {
      if (!getString("activegame")) {
        try {
          const response = await fetch(`${dmgAppConfig.apiUrl}/game/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${getString("authtoken")}`,
            },
            body: JSON.stringify({
              GameID: this.game._id,
            }),
          });
          const data = await response.json();
          setString("authtoken", data.Body);
        } catch (error) {
          console.error("api req failed to join game", JSON.stringify(error));
          return;
        }
      } else {
        console.warn(
          "already in a game, so haven't joined another one according to local storage"
        );
        return;
      }

      this.$navigateTo(Game, {
        props: {
          game: this.game,
        },
      });
    },
  },
};
</script>

<style scoped></style>
