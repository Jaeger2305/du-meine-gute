<template>
  <GridLayout columns="*" rows="*, *, *">
    <Image
      rowSpan="3"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <GameIcon
      row="0"
      :displayNumber="points"
      :unicodeIcon="`\uf3ed`"
      size="large"
      class="grid-item"
    />
    <GameIcon
      row="1"
      :displayNumber="cardBoost"
      :unicodeIcon="`\uf7c2`"
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
import GameIcon from "../reusable/GameIcon.vue";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import { Resource } from "../../../game/resources";

export default {
  components: { GameIcon, PrimaryResourceCollection },
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
