<template>
  <Page>
    <ActionBar :title="game.Name" />
    <FlexboxLayout backgroundColor="#3c495e">
      <Button text="leave" @tap="leaveGame" />
      <Label :text="JSON.stringify(game)" />
    </FlexboxLayout>
  </Page>
</template>

<script lang="ts">
import Lobby from "./Lobby.vue";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
