<template>
  <Frame id="purchasing">
    <Page actionBarHidden="true">
      <GridLayout columns="*,*,*" rows="*,*,*">
        <Image
          colSpan="3"
          rowSpan="3"
          src="~/assets/images/backboard.png"
          stretch="fill"
        />
        <FlexboxLayout
          column="0"
          row="0"
          rowSpan="3"
          flexDirection="column"
          justifyContent="space-around"
          alignContent="space-around"
        >
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
        </FlexboxLayout>
        <Employee
          v-if="isAssignedEmployee"
          column="1"
          rowSpan="2"
          :employee="itemBeingPurchased"
        />
        <Card v-else column="1" rowSpan="2" :card="itemBeingPurchased" />
        <GameIcon
          column="1"
          row="2"
          :displayNumber="stagedMoney"
          size="large"
          :unicodeIcon="`\uf51e`"
        />
        <FlexboxLayout
          column="2"
          rowSpan="3"
          alignItems="stretch"
          justifyContent="space-around"
          flexDirection="column"
        >
          <Button class="button" @tap="cancel">CANCEL</Button>
          <Button class="button" @tap="reset">RESET</Button>
          <Button
            class="button"
            :isEnabled="isValidPayment"
            @tap="submitPayment"
            >CONFIRM</Button
          >
        </FlexboxLayout>
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
} from "../../../game/types";
import { Resource } from "../../../game/resources";
import { groupBy, sum } from "lodash";
import { aggregateResources, verifyResources } from "../../../game/utils";
import SpendResource, { ResourcePair } from "./../SpendResource.vue";
import EmployeeVue from "./../cards/Employee.vue";
import CardVue from "./../cards/Card.vue";
import GameIcon from "./../reusable/GameIcon.vue";
import { employeeRecords } from "../../../game/worker";

export default {
  components: { SpendResource, Employee: EmployeeVue, Card: CardVue, GameIcon },
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
  data(): {
    basket: Array<Resource>;
    availableResources: Array<Resource>;
  } {
    return {
      availableResources: this.resources.slice(),
      basket: [],
    };
  },
  computed: {
    cost(): number {
      return this.costExtractor(this.factory);
    },
    stagedMoney(): number {
      return sum(this.basket.map((resource) => resource.value));
    },
    outstandingCost(): number {
      return this.cost - this.stagedMoney;
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
    isAssignedEmployee(): boolean {
      return Boolean(employeeRecords[this.factory.type]);
    },
    itemBeingPurchased(): Employee | Card {
      debugger;
      const item = this.isAssignedEmployee
        ? employeeRecords[this.factory.type]
        : this.factory;

      return {
        ...item,
        cost: this.outstandingCost,
        unassignmentCost: this.outstandingCost,
      };
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    reset() {
      this.basket = [];
      this.availableResources = this.resources.slice();
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
