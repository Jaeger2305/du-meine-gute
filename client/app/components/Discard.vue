<template>
  <Button
    :text="`discard (${cardsInDiscard.length})`"
    :isEnabled="isEndStepPossible"
    @tap="endStep"
  />
</template>

<script lang="ts">
import { CustomEvents } from "../types";
import { PlayerActionEnum } from "../game/types";
import { isActionAvailable } from "../game/utils";

export default {
  props: [
    "availableActions", // this needs testing with the class based syntax - https://vuejs.org/v2/guide/typescript.html#Annotating-Props
    "cardsInDiscard",
  ],
  computed: {
    isEndStepPossible(): boolean {
      return isActionAvailable(this.availableActions, PlayerActionEnum.endStep);
    },
  },
  methods: {
    endStep() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep);
    },
  },
};
</script>

<style scoped></style>
