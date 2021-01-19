<template>
  <GridLayout columns="*" rows="*, *, *">
    <Image
      rowSpan="3"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIconImage
      row="0"
      :displayNumber="points"
      src="~/assets/images/icons/points.png"
      size="large"
      class="grid-item"
    />
    <GameIconImage
      row="1"
      :displayNumber="cardBoost"
      src="~/assets/images/icons/draw-cards.png"
      size="large"
      class="grid-item"
    />
    <PrimaryResourceCollection
      row="2"
      :resources="marketBoost"
      :isFiltered="true"
      :isSorted="true"
      class="grid-item"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIconImage from "../reusable/GameIconImage.vue";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import { Resource } from "../../../game/resources";

export default {
  components: { GameIconImage, PrimaryResourceCollection },
  props: {
    points: {
      type: Number,
      required: true,
    },
    cardBoost: {
      type: Number,
      required: true,
    },
    marketBoost: {
      type: Array as PropType<Array<Resource>>,
      required: true,
    },
  },
};
</script>

<style scoped>
.grid-item {
  padding: 10px;
}
</style>
