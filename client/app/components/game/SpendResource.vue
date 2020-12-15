<template>
  <FlexboxLayout
    height="70"
    justifyContent="space-between"
    alignContent="center"
  >
    <SecondaryResource
      :displayNumber="`${availableCount}`"
      :resourceType="resource.type"
      @tap="addToBasket"
    />
    <GameIcon
      :displayNumber="resource.value"
      :size="large"
      :unicodeIcon="`\uf51e`"
      height="80%"
      width="80%"
    />
    <SecondaryResource
      :displayNumber="`${stagedCount}`"
      :resourceType="resource.type"
      @tap="removeFromBasket"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Resource, ResourceType } from "../../game/resources";
import SecondaryResource from "./reusable/SecondaryResource.vue";
import GameIcon from "./reusable/GameIcon.vue";
import { CustomEvents } from "../../types";

export type ResourcePair = {
  resource: Resource;
  availableCount: number;
  stagedCount: number;
};

export default {
  components: { SecondaryResource, GameIcon },
  props: {
    resource: {
      type: Object as () => Resource,
      required: true,
    },
    availableCount: {
      type: Number,
      default: 0,
    },
    stagedCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    addToBasket(): void {
      if (this.availableCount > 0) {
        this.$emit(CustomEvents.ADD_RESOURCE_TO_BASKET, this.resource);
      }
    },
    removeFromBasket(): void {
      if (this.stagedCount > 0) {
        this.$emit(CustomEvents.REMOVE_RESOURCE_FROM_BASKET, this.resource);
      }
    },
  },
};
</script>

<style scoped></style>
