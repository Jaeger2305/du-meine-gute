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
          <Button class="button" @tap="cancel">{{
            $t("action.cancel")
          }}</Button>
          <Button class="button" @tap="reset">{{ $t("action.reset") }}</Button>
          <Button
            class="button"
            :isEnabled="isValidProduction"
            @tap="confirm"
            >{{ $t("action.confirm") }}</Button
          >
        </FlexboxLayout>
        <!-- Not able to discard from the player hand yet - it's coupled to global state and needs refactoring -->
        <PlayerHand
          row="1"
          colSpan="3"
          :availableActions="playerHandActions"
          :cards="availableCards"
          @discard-card="discardCardForResource"
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
): {
  requiredExtraResources: Array<Resource>;
  productionCount: number;
  isExactToProduce: boolean;
} {
  let trackedInputResources = inputResources.slice();
  let requiredExtraResources = [];
  let isEnoughToProduce = true;
  let productionCount = 0;
  let isExactToProduce = true;
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
      productionCount += requiredResources.length;
    }
    isExactToProduce = trackedInputResources.length === 0;
  }

  return { requiredExtraResources, productionCount, isExactToProduce };
}

// Warning: don't be too attached to this code.
// It would be simpler if refactored into separate components.
// There's basically duplicated logic with 2 baskets for basic and chain production, and the bridge is the player cards
// Unlikely to happen until after a first release.
export default {
  components: {
    Employee: EmployeeVue,
    Card: CardVue,
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
    availableMarketResources: Array<Resource | { key: string }>;
    availableChainResources: Array<Resource | { key: string }>;
    discardedCards: Array<Card>;
    basket: Array<Resource>;
    chainBasket: Array<Resource>;
  } {
    return {
      availableCards: this.cardsInHand.slice(),
      availableMarketResources: keyArray<Resource>(
        this.marketResources.slice()
      ),
      availableChainResources: keyArray<Resource>(this.resources.slice()),
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
      // Not all assignments have a chained input, e.g. the glassblower.
      // In this case, this code shouldn't even be called, and could end up in an undefined state.
      // But, it's easier to just pass an empty array at this point, and this can be refactored later.
      const productionConfig = this.assignedEmployee.assignment
        .productionConfig;
      const inputResources = productionConfig.chainInput || [];
      const resources = this.chainBasket;
      return checkChainedOutstandingResources(inputResources, resources);
    },
    chainedProductionCount(): number {
      if (!this.initialProductionCount) return 0; // chained production can only happen once initial production is started
      return this.assignedEmployee.assignment.productionConfig.chainInput
        ? this.chainedProductionStatus.productionCount
        : 0;
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
          chainInput: this.assignedEmployee.assignment.productionConfig
            .chainInput
            ? this.chainedProductionRequiredResources
            : undefined,
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
      return (
        this.initialProductionStatus.isExactToProduce &&
        (!this.assignedEmployee.assignment.productionConfig.chainInput ||
          this.chainedProductionStatus.isExactToProduce)
      );
    },
    playerHandActions(): Array<PlayerActionEnum> {
      return [
        ...this.$store.state.playerState.availableActions,
        PlayerActionEnum.discard,
      ];
    },
    availableResources(): Array<Resource> {
      return this.initialProductionCount
        ? this.availableChainResources
        : this.availableMarketResources;
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    reset(): void {
      this.availableCards = this.cardsInHand.slice();
      this.availableMarketResources = keyArray(this.marketResources.slice());
      this.availableChainResources = keyArray(this.resources.slice());
      this.discardedCards = [];
      this.basket = [];
      this.chainBasket = [];
    },
    addToBasket({ type: availableResourceType }: Resource): void {
      const availableResources = this.initialProductionCount
        ? this.availableChainResources
        : this.availableMarketResources;
      const index = availableResources.findIndex(
        ({ type }) => type === availableResourceType
      );
      const basket =
        this.initialProductionCount &&
        this.assignedEmployee.assignment.productionConfig.chainInput
          ? this.chainBasket
          : this.basket;
      basket.push(...availableResources.splice(index, 1));
    },
    removeFromBasket(
      { type: stagedResourceType }: Resource,
      basket: Array<Resource>
    ): void {
      const availableResources = this.initialProductionCount
        ? this.availableChainResources
        : this.availableMarketResources;
      const index = this.basket.findIndex(
        ({ type }) => type === stagedResourceType
      );
      availableResources.push(...basket.splice(index, 1));
    },
    discardCardForResource({ name: discardedCardName }: Card): void {
      const availableResources = this.initialProductionCount
        ? this.availableChainResources
        : this.availableMarketResources;
      const cardIndex = this.availableCards.findIndex(
        ({ name: availableCardName }) => discardedCardName === availableCardName
      );
      if (cardIndex < 0)
        throw new Error(`Card with ${discardedCardName} couldn't be found`);
      const card = this.availableCards.splice(cardIndex, 1)[0];
      this.discardedCards.push(card);
      availableResources.push({
        ...card.resource,
        key: generatePoorRandomKey(),
      });
    },
    undoDiscardedCard(index: number): void {
      const availableResources = this.initialProductionCount
        ? this.availableChainResources
        : this.availableMarketResources;
      const card = this.discardedCards.splice(index, 1)[0];
      this.availableCards.push(card);

      // Remove the associated resource.
      // The resource could be in any of the baskets or the available, so start with the least disruptive first.
      const resourceInAvailableIndex = availableResources.findIndex(
        (resource) => resource.type === card.resource.type
      );
      if (resourceInAvailableIndex > -1)
        return availableResources.splice(resourceInAvailableIndex, 1);

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

<style scoped>
.button {
  color: black;
}
</style>
