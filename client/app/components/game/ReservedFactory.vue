<template>
  <Card
    v-if="factory"
    :name="factory.name"
    :is-enabled="isBuildFactoryPossible"
    @click="buildFactory(factory)"
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/client";
import { filterCardsToAffordable, isActionAvailable } from "../../game/utils";
import { Card, GameState, PlayerState } from "../../game/types";
import { Resource } from "../../game/resources";

import Purchasing from "./Purchasing.vue";

export default Vue.extend({
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    availableActions: {
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    resources: {
      type: Object as PropType<PlayerState["resources"]>,
      required: true,
    },
    factory: {
      type: Object as PropType<PlayerState["reservedFactory"]>,
      required: true,
    },
  },
  computed: {
    isBuildFactoryPossible(): boolean {
      const affordableFactories = filterCardsToAffordable<Card>(
        [this.factory],
        (card: Card) => card.cost,
        this.resources
      );
      return (
        affordableFactories.length &&
        isActionAvailable(this.availableActions, PlayerActionEnum.buildFactory)
      );
    },
  },
  methods: {
    async buildFactory(factory) {
      const purchaseResult: {
        resources: Array<Resource>;
      } | null = await this.$showModal(Purchasing, {
        props: {
          factory,
          costExtractor: (factory) => factory.cost,
          resources: this.resources,
        },
      });
      console.warn("no error checking even on client side");
      if (purchaseResult) {
        this.$emit(CustomEvents.BUILD_FACTORY, PlayerActionEnum.buildFactory, {
          resources: purchaseResult.resources,
        });
      }
    },
  },
});
</script>

<style scoped></style>
