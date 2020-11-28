<template>
  <FlexboxLayout>
    <Card
      :name="employee.name"
      :isEnabled="isActionable"
      @click="contextualClick"
    />
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
import AssignmentFactorySelection from "./AssignmentFactorySelection.vue";
import AssignmentModeSelection from "./AssignmentModeSelection.vue";

export default Vue.extend({
  props: {
    employee: {
      type: Object as PropType<
        Employee & {
          isAssignable: boolean;
          isUnassignable: boolean;
          isReadyToProduce: boolean;
          assignedEmployee: AssignedEmployee | undefined;
        }
      >,
      required: true,
    },
    cardsInHand: {
      type: Array as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
    cardsInPlay: {
      type: Array as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
    emptyFactories: {
      type: Array as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
    marketCards: {
      type: Array as PropType<GameState["marketCards"]>,
      required: true,
    },
    resources: {
      type: Array as PropType<PlayerState["resources"]>,
      required: true,
    },
  },
  computed: {
    isActionable(): boolean {
      return (
        this.employee.isAssignable ||
        this.employee.isUnassignable ||
        this.employee.isReadyToProduce
      );
    },
  },
  methods: {
    contextualClick(): void {
      if (this.employee.isAssignable) return this.assignEmployee(this.employee);
      if (this.employee.isUnassignable)
        return this.unassignEmployee(this.employee.assignedEmployee);
      if (this.employee.isReadyToProduce)
        return this.produceAtFactory(this.employee.assignedEmployee);
    },
    async assignEmployee(employee: Employee) {
      const factory = await this.$showModal(AssignmentFactorySelection, {
        props: { factories: this.emptyFactories },
      });
      if (!factory) return;

      const efficiency = employee.modes.length
        ? await this.$showModal(AssignmentModeSelection, {
            props: { modes: employee.modes },
          })
        : employee.modes[0];
      if (!efficiency) return;

      this.$emit(
        CustomEvents.ASSIGN_EMPLOYEE,
        PlayerActionEnum.assignEmployee,
        { employee, efficiency, factory }
      );
    },
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
      } | null = await this.$showModal(Production, {
        fullscreen: true,
        props: { assignedEmployee, cardsInHand, marketResources, resources },
      });
      if (production) {
        this.$emit(
          CustomEvents.PRODUCE_AT_FACTORY,
          PlayerActionEnum.produceAtFactory,
          production
        );
      }
    },
    async unassignEmployee(assignedEmployee: AssignedEmployee): Promise<void> {
      console.warn("no error checking even on client side");
      // Employees are only unassignable manually if they have a cost. Otherwise they are auto unassigned during the end round.
      // Therefore, to unassign them here, we always show the modal.
      const purchasingResult: {
        resources: Array<Resource>;
      } | null = await this.$showModal(Purchasing, {
        props: {
          factory: assignedEmployee,
          costExtractor: (factory) => factory.unassignmentCost,
          resources: this.resources,
        },
      });
      if (purchasingResult) {
        this.$emit(
          CustomEvents.UNASSIGN_EMPLOYEE,
          PlayerActionEnum.unassignEmployee,
          {
            nameOfEmployeeToUnassign: assignedEmployee.name,
            resourcePayment: purchasingResult.resources,
          }
        );
      }
    },
  },
});
</script>

<style scoped></style>
