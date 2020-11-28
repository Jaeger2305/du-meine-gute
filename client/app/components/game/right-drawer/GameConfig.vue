<template>
  <GridLayout columns="*, *" rows="*, *">
    <Image
      colSpan="2"
      rowSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIcon
      col="0"
      row="0"
      colSpan="2"
      :unicodeIcon="`\uf275`"
      :displayNumber="buildCountForEndGame"
      size="large"
    />
    <GameIcon
      col="0"
      row="1"
      :unicodeIcon="`\uf0c0`"
      :displayNumber="playerCount"
      size="large"
    />
    <GameIcon
      col="1"
      row="1"
      :unicodeIcon="`\uf185`"
      :displayNumber="marketSuns"
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
