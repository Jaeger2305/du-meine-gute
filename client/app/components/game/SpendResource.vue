<template>
  <FlexboxLayout
    height="70"
    justifyContent="space-between"
    alignContent="center"
  >
    <SecondaryResource
      :class="{ activity: unstagedActivity }"
      :displayNumber="`${availableCount}`"
      :resourceType="resource.type"
      :isAnimated="false"
      @tap="addToBasket"
    />
    <GameIconImage
      :displayNumber="resource.value"
      size="large"
      src="~/assets/images/icons/money.png"
      height="80%"
      width="80%"
    />
    <SecondaryResource
      :class="{ activity: stagedActivity }"
      :displayNumber="`${stagedCount}`"
      :resourceType="resource.type"
      :isAnimated="false"
      @tap="removeFromBasket"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Resource, ResourceType } from "../../game/resources";
import SecondaryResource from "./reusable/SecondaryResource.vue";
import GameIconImage from "./reusable/GameIconImage.vue";
import { CustomEvents } from "../../types";

export type ResourcePair = {
  resource: Resource;
  availableCount: number;
  stagedCount: number;
};

export default {
  components: { SecondaryResource, GameIconImage },
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
  data() {
    return {
      stagedActivity: false,
      unstagedActivity: false,
    };
  },
  methods: {
    addToBasket(): void {
      if (this.availableCount > 0) {
        this.$emit(CustomEvents.ADD_RESOURCE_TO_BASKET, this.resource);
      }
      this.stagedActivity = false;
      this.$nextTick(() => (this.stagedActivity = true));
    },
    removeFromBasket(): void {
      if (this.stagedCount > 0) {
        this.$emit(CustomEvents.REMOVE_RESOURCE_FROM_BASKET, this.resource);
      }
      this.unstagedActivity = false;
      this.$nextTick(() => (this.unstagedActivity = true));
    },
  },
};
</script>

<style scoped></style>
