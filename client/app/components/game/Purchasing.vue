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
        <Label text="available" />
        <Label
          v-for="({ type, value }, index) in availableResources"
          :key="type"
          :text="`${type}: ${value}`"
          @tap="addToBasket(index)"
        />
        <Label text="basket" />
        <Label
          v-for="({ type, value }, index) in basket"
          :key="type"
          :text="`${type}: ${value}`"
          @tap="removeFromBasket(index)"
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
import { sum } from "lodash";
import { verifyResources } from "../../game/utils";

export default {
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
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    addToBasket(index: number): void {
      this.basket.push(...this.availableResources.splice(index, 1));
    },
    removeFromBasket(index: number): void {
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
