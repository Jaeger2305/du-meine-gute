<template>
  <Frame id="purchasing">
    <Page>
      <ActionBar title="Purchasing">
        <ActionItem
          @tap="cancel"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <StackLayout>
        <SpendResource
          v-for="{
            resource,
            availableCount,
            stagedCount,
          } in aggregatedResourcePairs"
          :key="resource.type"
          :resource="resource"
          :availableCount="availableCount"
          :stagedCount="stagedCount"
          @add-resource-to-basket="addToBasket"
          @remove-resource-from-basket="removeFromBasket"
        />
        <Label :text="`outstanding: ${outstandingCost}`" />
        <Button
          @tap="submitPayment"
          text="submit payment"
          :isEnabled="isValidPayment"
        />
      </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  PlayerState,
  Employee,
  ProductionEfficiency,
  Card,
  AssignedEmployee,
} from "../../game/types";
import { Resource } from "../../game/resources";
import { groupBy, sum } from "lodash";
import { aggregateResources, verifyResources } from "../../game/utils";
import SpendResource, { ResourcePair } from "./SpendResource.vue";

export default {
  components: { SpendResource },
  props: {
    resources: {
      type: Array as PropType<PlayerState["resources"]>,
      required: true,
    },
    factory: {
      type: Object as PropType<Card | AssignedEmployee>,
      required: true,
    },
    costExtractor: {
      type: Function,
      required: true,
    },
  },
  data(): { basket: Array<Resource>; availableResources: Array<Resource> } {
    return {
      availableResources: this.resources.slice(),
      basket: [],
    };
  },
  computed: {
    cost(): number {
      return this.costExtractor(this.factory);
    },
    outstandingCost(): number {
      return this.cost - sum(this.basket.map((resource) => resource.value));
    },
    isValidPayment(): boolean {
      return verifyResources(this.basket, this.cost);
    },
    aggregatedResourcePairs(): Array<ResourcePair> {
      const availableResources: Array<Resource> = this.resources; // help out Vue's typing intellisense.
      const aggregatedAvailable = groupBy<Resource>(availableResources, "type");

      const stagedResources: Array<Resource> = this.basket; // help out Vue's typing intellisense.
      const aggregatedStaged = groupBy<Resource>(stagedResources, "type");
      return Object.values(aggregatedAvailable).map((resources) => {
        const stagedCount = aggregatedStaged[resources[0].type]?.length || 0;
        return {
          resource: resources[0],
          availableCount: resources.length - stagedCount,
          stagedCount,
        };
      });
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    addToBasket({ type: availableResourceType }: Resource): void {
      const index = this.availableResources.findIndex(
        ({ type }) => type === availableResourceType
      );
      this.basket.push(...this.availableResources.splice(index, 1));
    },
    removeFromBasket({ type: stagedResourceType }: Resource): void {
      const index = this.basket.findIndex(
        ({ type }) => type === stagedResourceType
      );
      this.availableResources.push(...this.basket.splice(index, 1));
    },
    submitPayment() {
      if (!this.isValidPayment) return this.$modal.close(null); // should be disabled, but belt and braces anyway
      const payment: {
        resources: Array<Resource>;
      } = {
        resources: this.basket,
      };
      this.$modal.close(payment);
    },
  },
};
</script>

<style scoped></style>
