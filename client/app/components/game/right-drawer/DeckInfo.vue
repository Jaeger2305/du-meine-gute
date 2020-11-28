<template>
  <GridLayout columns="*, *" rows="*">
    <Image
      colSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIcon
      col="0"
      :unicodeIcon="`\uf3ed`"
      :displayNumber="deckCount"
      size="large"
    />
    <GameIcon
      col="1"
      :unicodeIcon="`\uf3ed`"
      :displayNumber="discardCount"
      size="large"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIcon from "../reusable/GameIcon.vue";

export default {
  components: { GameIcon },
  props: {
    deckCount: {
      type: Number,
      required: true,
    },
    discardCount: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped></style>
