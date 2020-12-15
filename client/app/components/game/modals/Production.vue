<template>
  <Frame id="production">
    <Page actionBarHidden="true">
      <GridLayout columns="*,*,*" rows="3*,*">
        <Image
          colSpan="3"
          rowSpan="2"
          src="~/assets/images/backboard.png"
          stretch="fill"
        />
        <FlexboxLayout
          flexDirection="column"
          justifyContent="space-around"
          alignItems="space-around"
          alignContent="space-around"
        >
          <Employee :employee="employeeWithAssignment" />
          <Card :card="cardWithProduction" />
        </FlexboxLayout>
        <FlexboxLayout
          column="1"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="space-around"
          alignContent="space-around"
        >
          <PrimaryResourceCollection
            :resources="primaryResources"
            :isFiltered="true"
            @tap-resource="addToBasket"
          />
          <SecondaryResourceCollection
            :resources="secondaryResources"
            :isFiltered="true"
            @tap-resource="addToBasket"
          />
        </FlexboxLayout>
        <FlexboxLayout
          column="2"
          alignItems="stretch"
          justifyContent="space-around"
          flexDirection="column"
        >
          <Button class="button" @tap="cancel">CANCEL</Button>
          <Button class="button" @tap="reset">RESET</Button>
          <Button class="button" :isEnabled="isValidProduction" @tap="confirm"
            >CONFIRM</Button
          >
        </FlexboxLayout>
        <!-- Not able to discard from the player hand yet - it's coupled to global state and needs refactoring -->
        <PlayerHand
          row="1"
          colSpan="3"
          :availableActions="$store.state.playerState.availableActions"
          :cards="availableCards"
        />
      </GridLayout>
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
  PlayerActionEnum,
} from "../../../game/types";
import { Resource } from "../../../game/resources";
import { groupBy, isEqual, sum } from "lodash";
import {
  aggregateResources,
  checkOutstandingResources,
  differenceResources,
  verifyResources,
} from "../../../game/utils";
import EmployeeVue from "./../cards/Employee.vue";
import CardVue from "./../cards/Card.vue";
import GameIcon from "./../reusable/GameIcon.vue";
import { employeeRecords } from "../../../game/worker";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import SecondaryResourceCollection from "../right-drawer/SecondaryResourceCollection.vue";
import { generatePoorRandomKey, keyArray } from "../../../utils";
import { playerActions } from "../../../game/client";
import PlayerHand from "../PlayerHand.vue";

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

export default {
  components: {
    Employee: EmployeeVue,
    Card: CardVue,
    GameIcon,
    PrimaryResourceCollection,
    SecondaryResourceCollection,
    PlayerHand,
  },
  props: {
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee>,
      required: true,
    },
    cardsInHand: {
      type: Array as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
    marketResources: {
      type: Array as PropType<Array<Resource>>,
      required: true,
    },
    resources: {
      type: Array as PropType<PlayerState["resources"]>,
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
    chainedProductionRequiredResources(): Array<Resource> {
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
    primaryResources(): Array<Resource> {
      return this.availableResources.filter(({ baseResource }) => baseResource);
    },
    secondaryResources(): Array<Resource> {
      return this.availableResources.filter(
        ({ baseResource }) => !baseResource
      );
    },
    cardWithProduction(): Card {
      return {
        ...this.assignedEmployee.assignment,
        productionConfig: {
          ...this.assignedEmployee.assignment.productionConfig,
          output: this.outputResources,
          input: this.initialProductionRequiredResources,
          chainInput: this.chainedProductionRequiredResources,
        },
      };
    },
    employeeWithAssignment(): Employee {
      return {
        ...employeeRecords[this.assignedEmployee.type],
        modes: [this.assignedEmployee.mode],
      };
    },
    isValidProduction(): boolean {
      console.warn("not implemented yet");
      return true;
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
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
    addToBasket({ type: availableResourceType }: Resource): void {
      const index = this.availableResources.findIndex(
        ({ type }) => type === availableResourceType
      );
      const basket = this.initialProductionCount
        ? this.chainBasket
        : this.basket;
      basket.push(...this.availableResources.splice(index, 1));
    },
    removeFromBasket(
      { type: stagedResourceType }: Resource,
      basket: Array<Resource>
    ): void {
      const index = this.basket.findIndex(
        ({ type }) => type === stagedResourceType
      );
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
    confirm() {
      const consumedResources = [...this.basket, ...this.chainBasket].filter(
        ({ baseResource }) => !baseResource
      );
      const payment: Parameters<
        typeof playerActions[PlayerActionEnum.produceAtFactory]
      >[2] = {
        discardedCards: this.discardedCards,
        outputResources: this.outputResources,
        consumedResources,
        assignedEmployee: this.assignedEmployee,
      };
      this.$modal.close(payment);
    },
  },
};
</script>

<style scoped></style>
