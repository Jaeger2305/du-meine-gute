<template>
  <GridLayout columns="*, *" rows="*">
    <Image
      colSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIconImage
      col="0"
      src="~/assets/images/icons/deck.png"
      :displayNumber="deckCount"
      size="large"
    />
    <GameIconImage
      col="1"
      src="~/assets/images/icons/deck.png"
      :displayNumber="discardCount"
      size="large"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIconImage from "../reusable/GameIconImage.vue";

export default {
  components: { GameIconImage },
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
