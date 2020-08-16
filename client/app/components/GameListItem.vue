<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Label :text="game.Name" width="70" backgroundColor="#43b883" />
    <Label
      :text="game.State.Players.length"
      width="70"
      backgroundColor="#1c6b48"
    />
    <Button text="join" @tap="joinGame" />
  </FlexboxLayout>
</template>

<script lang="ts">
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
      const response = await fetch(`${dmgAppConfig.apiUrl}/game/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GameID: this.game._id,
        }),
      });
      const data = await response.json();

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
