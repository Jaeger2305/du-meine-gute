<template>
  <GridLayout columns="*" rows="*">
    <Image src="~/assets/images/placeholder-factory.png" />
    <Label :text="card.name" />
    <SecondaryResourceCollection
      v-if="card.productionConfig"
      :resources="card.productionConfig.output"
      :isFiltered="true"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Card } from "../../../game/types";
import SecondaryResourceCollection from "../right-drawer/SecondaryResourceCollection.vue";

export default {
  components: { SecondaryResourceCollection },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
  },
};
</script>

<style scoped></style>
