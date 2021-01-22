<template>
  <GridLayout columns="*, *" rows="*, *">
    <Image
      colSpan="2"
      rowSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIconImage
      col="0"
      row="0"
      colSpan="2"
      src="~/assets/images/factories/unknown.png"
      :displayNumber="buildCountForEndGame"
      size="large"
    />
    <GameIconImage
      col="0"
      row="1"
      src="~/assets/images/icons/players.png"
      :displayNumber="playerCount"
      size="large"
    />
    <GameIconImage
      col="1"
      row="1"
      src="~/assets/images/icons/suns.png"
      :displayNumber="marketSuns"
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
    marketSuns: {
      type: Number,
      required: true,
    },
    buildCountForEndGame: {
      type: Number,
      required: true,
    },
    playerCount: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped></style>
