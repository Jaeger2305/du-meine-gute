<template>
  <FlexboxLayout
    height="70"
    justifyContent="space-between"
    alignContent="center"
  >
    <transition name="bounce" appear>
      <SecondaryResource
        v-if="availableCount"
        :displayNumber="`${availableCount}`"
        :resourceType="resource.type"
        @tap="addToBasket"
      />
    </transition>
    <GameIconImage
      :displayNumber="resource.value"
      size="large"
      src="~/assets/images/icons/money.png"
      height="80%"
      width="80%"
    />
    <transition name="bounce" appear>
      <SecondaryResource
        v-if="stagedCount"
        :displayNumber="`${stagedCount}`"
        :resourceType="resource.type"
        @tap="removeFromBasket"
      />
    </transition>
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

<style scoped>
.bounce-enter-active {
  animation-name: bounce-in;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.bounce-leave-active {
  animation-name: bounce-in;
  animation-duration: 0.25s;
  animation-fill-mode: forwards;
  animation-direction: reverse;
  animation-timing-function: ease-in-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
