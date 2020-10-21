<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Card
      :name="name"
      :isEnabled="isAssignable"
      @click="produceAtFactory(assignedEmployee)"
    />
    <Button v-if="isUnassignable" @tap="unassignEmployee(assignedEmployee)"
      >unassign</Button
    >
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/client";
import {
  AssignedEmployee,
  Card,
  Employee,
  GameState,
  PlayerState,
} from "../../game/types";
import Production from "./Production.vue";
import { Resource } from "../../game/resources";

import Purchasing from "./Purchasing.vue";

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee> | null,
      default: null,
    },
    isAssignable: {
      type: Boolean,
      required: true,
    },
    isUnassignable: {
      type: Boolean,
      required: true,
    },
    cardsInHand: {
      type: Object as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
    cardsInPlay: {
      type: Object as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
    marketCards: {
      type: Object as PropType<GameState["marketCards"]>,
      required: true,
    },
    resources: {
      type: Object as PropType<PlayerState["resources"]>,
      required: true,
    },
  },
  methods: {
    async produceAtFactory(assignedEmployee: AssignedEmployee): Promise<void> {
      const { resources, cardsInHand } = this;
      const marketResources = [
        ...this.marketCards.map((card) => card.resource),
        ...this.cardsInPlay.flatMap((card) => card.marketBoost).filter(Boolean),
      ];
      const production: {
        discardedCards: Array<Card>;
        outputResources: Array<Resource>;
        assignedEmployee: AssignedEmployee;
      } = await this.$showModal(Production, {
        fullscreen: true,
        props: { assignedEmployee, cardsInHand, marketResources, resources },
      });
      this.$emit(
        CustomEvents.PRODUCE_AT_FACTORY,
        PlayerActionEnum.produceAtFactory,
        production
      );
    },
    async unassignEmployee(assignedEmployee: AssignedEmployee): Promise<void> {
      console.warn("no error checking even on client side");
      // Employees are only unassignable manually if they have a cost. Otherwise they are auto unassigned during the end round.
      // Therefore, to unassign them here, we always show the modal.
      const {
        resources: chosenResources,
      }: { resources: Array<Resource> } = await this.$showModal(Purchasing, {
        props: {
          factory: assignedEmployee,
          costExtractor: (factory) => factory.unassignmentCost,
          resources: this.resources,
        },
      });
      this.$emit(
        CustomEvents.UNASSIGN_EMPLOYEE,
        PlayerActionEnum.unassignEmployee,
        {
          nameOfEmployeeToUnassign: assignedEmployee.name,
          resourcePayment: chosenResources,
        }
      );
    },
  },
});
</script>

<style scoped></style>
