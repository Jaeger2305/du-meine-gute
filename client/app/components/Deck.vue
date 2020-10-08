<template>
  <Button
    :text="`draw (${cardsInDeck.length})`"
    @tap="drawCard"
    :isEnabled="isDrawCardPossible"
  />
</template>

<script lang="ts">
import { PlayerActionEnum } from "../game/types";
import { isActionAvailable } from "../game/utils";

export default {
  props: [
    "availableActions", // this needs testing with the class based syntax - https://vuejs.org/v2/guide/typescript.html#Annotating-Props
    "cardsInDeck",
  ],
  computed: {
    isDrawCardPossible(): boolean {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.drawCard
      );
    },
  },
  methods: {
    drawCard() {
      this.$emit("player-action", PlayerActionEnum.drawCard);
    },
  },
};
</script>

<style scoped></style>
