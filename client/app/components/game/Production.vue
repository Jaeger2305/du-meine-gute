<template>
  <Frame id="production">
    <Page>
      <ActionBar title="Production" />
      <GridLayout columns="*, *, *" rows="4*, 2*, *" backgroundColor="#3c8888">
        <!-- |---------------|---------------|----------------| -->
        <!-- |                               |                | -->
        <!-- |           resources           |     cards      | -->
        <!-- |                               |                | -->
        <!-- |---------------|---------------|----------------| -->
        <!-- |     basket    |  chainBasket  |   cardBasket   | -->
        <!-- |---------------|---------------|----------------| -->
        <!-- |            actions            | produced goods | -->
        <!-- |---------------|---------------|----------------| -->

        <!-- Choose resources to use -->
        <ScrollView orientation="vertical" column="0" row="0" colSpan="2">
          <StackLayout>
            <Label text="AVAILABLE" />
            <Label
              v-for="({ type, key }, index) in availableResources"
              :key="key"
              :text="type"
              @tap="addToBasket(index)"
            />
          </StackLayout>
        </ScrollView>

        <!-- Choose cards to discard -->
        <StackLayout column="2" row="0">
          <Label text="available CARDS" />
          <Label
            v-for="({ name, resource }, index) in availableCards"
            :key="name"
            :text="`${name}: ${resource.type}`"
            @tap="discardCardForResource(index)"
          />
        </StackLayout>

        <!-- Summary of production -->
        <StackLayout column="0" row="1">
          <Label text="BASKET" />
          <Label
            v-for="({ type, key }, index) in basket"
            :key="key"
            :text="type"
            @tap="removeFromBasket(index, basket)"
          />
        </StackLayout>
        <StackLayout column="1" row="1">
          <Label text="CHAIN BASKET" />
          <Label
            v-for="({ type, key }, index) in chainBasket"
            :key="key"
            :text="type"
            @tap="removeFromBasket(index, chainBasket)"
          />
        </StackLayout>
        <StackLayout column="2" row="1">
          <Label text="basket CARDS" />
          <Label
            v-for="({ name, resource }, index) in discardedCards"
            :key="name"
            :text="`${name}: ${resource}`"
            @tap="undoDiscardedCard(index)"
          />
        </StackLayout>

        <!-- Actions and overall summary -->
        <StackLayout column="0" row="2" orientation="vertical">
          <Label text="OUTSTANDING" />
          <Label :text="outstandingResources.map((r) => r.type).join()" />
        </StackLayout>
        <StackLayout column="1" row="2" colSpan="2" orientation="horizontal">
          <Button @tap="reset" text="reset" />
          <Button @tap="submitPayment" text="submit payment" />
        </StackLayout>
        <StackLayout column="2" row="2">
          <Label :text="resourceSummary" />
        </StackLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { sum } from "lodash";
import {
  generatePoorRandomKey,
  handleValidationError,
  keyArray,
} from "../../utils";
import {
  PlayerState,
  Employee,
  ProductionEfficiency,
  Card,
  AssignedEmployee,
} from "../../game/types";
import {
  differenceResources,
  checkOutstandingResources,
} from "../../game/utils";
import { Resource } from "../../game/resources";

/**
 * Loop through the outstanding resources until we find the remaining extra resources, returning the count of production as well.
 * Only relevant for chained production, because initial production is a boolean yes/no.
 * This isn't great code, but it's building on the original function and is quicker to get to the next stage.
 * The original function is doing too much as well, so it's a good target for refactoring.
 */
function checkChainedOutstandingResources(
  requiredResources: Array<Resource>,
  inputResources: Array<Resource>
): { requiredExtraResources: Array<Resource>; productionCount: number } {
  let trackedInputResources = inputResources.slice();
  let requiredExtraResources = [];
  let isEnoughToProduce = true;
  let productionCount = 0;
  while (isEnoughToProduce) {
    ({ isEnoughToProduce, requiredExtraResources } = checkOutstandingResources(
      requiredResources,
      trackedInputResources,
      0 // chained production can't be spared
    ));
    if (isEnoughToProduce) {
      trackedInputResources = differenceResources(
        trackedInputResources,
        requiredResources
      );
      productionCount += 1;
    }
  }

  return { requiredExtraResources, productionCount };
}

/**
 * Handle the production for a single assigned employee, allowing the user to manage their resources.
 * Designed to be used in a modal.
 *
 * Not a shining example of component design.
 * It's quite possible that this is split into separate steps for initial and chained production
 * But no design thought has gone into this yet, the prior major goal is completing the basic game loop and getting to a testable state.
 */
export default Vue.extend({
  props: {
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee>,
      required: true,
    },
    cardsInHand: {
      type: Object as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
    marketResources: {
      type: Object as PropType<Array<Resource>>,
      required: true,
    },
    resources: {
      type: Object as PropType<PlayerState["resources"]>,
      required: true,
    },
  },
  data(): {
    availableCards: Array<Card>;
    availableResources: Array<Resource | { key: string }>;
    discardedCards: Array<Card>;
    basket: Array<Resource>;
    chainBasket: Array<Resource>;
  } {
    return {
      availableCards: this.cardsInHand.slice(),
      availableResources: keyArray<Resource>([
        ...this.resources.slice(),
        ...this.marketResources.slice(),
      ]),
      discardedCards: [],
      basket: [],
      chainBasket: [],
    };
  },
  computed: {
    initialProductionStatus(): ReturnType<typeof checkOutstandingResources> {
      const productionConfig = this.assignedEmployee.assignment
        .productionConfig;
      const inputResources = productionConfig.input;
      const resources = this.basket;
      return checkOutstandingResources(
        inputResources,
        resources,
        this.assignedEmployee.mode.resourceSparingCount
      );
    },
    initialProductionCount(): number {
      return this.initialProductionStatus.isExactToProduce
        ? this.assignedEmployee.mode.productionCount
        : 0;
    },
    initialProductionRequiredResources(): Array<Resource> {
      return this.initialProductionStatus.isExactToProduce
        ? []
        : this.initialProductionStatus.requiredExtraResources;
    },
    chainedProductionStatus(): ReturnType<
      typeof checkChainedOutstandingResources
    > {
      const productionConfig = this.assignedEmployee.assignment
        .productionConfig;
      const inputResources = productionConfig.chainInput;
      const resources = this.chainBasket;
      return checkChainedOutstandingResources(inputResources, resources);
    },
    chainedProductionCount(): number {
      if (!this.initialProductionCount) return 0; // chained production can only happen once initial production is started
      return this.chainedProductionStatus.productionCount;
    },
    chainedProductionRequiredResources(): number {
      return this.chainedProductionStatus.requiredExtraResources;
    },
    outstandingResources(): Array<Resource> {
      return this.initialProductionCount
        ? this.chainedProductionRequiredResources
        : this.initialProductionRequiredResources;
    },
    productionCount(): number {
      return this.initialProductionCount + this.chainedProductionCount;
    },
    outputResources(): Array<Resource> {
      const resources = this.assignedEmployee.assignment.productionConfig
        .output;
      return Array(this.productionCount)
        .fill(resources)
        .flat();
    },
    resourceSummary(): string {
      return `${this.outputResources.map((r) => r.type).join()} (${
        this.productionCount
      })`;
    },
  },
  methods: {
    reset(): void {
      this.availableCards = this.cardsInHand.slice();
      this.availableResources = keyArray([
        ...this.resources.slice(),
        ...this.marketResources.slice(),
      ]);
      this.discardedCards = [];
      this.basket = [];
      this.chainBasket = [];
    },
    addToBasket(index: number): void {
      const basket = this.initialProductionCount
        ? this.chainBasket
        : this.basket;
      basket.push(...this.availableResources.splice(index, 1));
    },
    removeFromBasket(index: number, basket: Array<Resource>): void {
      this.availableResources.push(...basket.splice(index, 1));
    },
    discardCardForResource(index: number): void {
      const card = this.availableCards.splice(index, 1)[0];
      this.discardedCards.push(card);
      this.availableResources.push({
        ...card.resource,
        key: generatePoorRandomKey(),
      });
    },
    undoDiscardedCard(index: number): void {
      const card = this.discardedCards.splice(index, 1)[0];
      this.availableCards.push(card);

      // Remove the associated resource.
      // The resource could be in any of the baskets or the available, so start with the least disruptive first.
      const resourceInAvailableIndex = this.availableResources.findIndex(
        (resource) => resource.type === card.resource.type
      );
      if (resourceInAvailableIndex > -1)
        return this.availableResources.splice(resourceInAvailableIndex, 1);

      const resourceInChainBasketIndex = this.chainBasket.findIndex(
        (resource) => resource.type === card.resource.type
      );
      if (resourceInChainBasketIndex > -1)
        return this.chainBasket.splice(resourceInAvailableIndex, 1);

      const resourceInBasketIndex = this.basket.findIndex(
        (resource) => resource.type === card.resource.type
      );
      if (resourceInBasketIndex > -1)
        return this.basket.splice(resourceInBasketIndex, 1);
    },
    submitPayment(): void {
      const payment: {
        discardedCards: Array<Card>;
        outputResources: Array<Resource>;
        assignedEmployee: AssignedEmployee;
      } = {
        discardedCards: this.discardedCards,
        outputResources: this.outputResources,
        assignedEmployee: this.assignedEmployee,
      };
      this.$modal.close(payment);
    },
  },
});
</script>

<style scoped></style>
