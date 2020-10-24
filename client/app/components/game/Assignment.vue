<template>
  <Button
    v-if="isAssignmentAvailable"
    :text="`start assignemtn`"
    @tap="openAssignment"
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import {
  isActionAvailable,
  getUnassignedEmployees,
  getUnoccupiedFactories,
} from "../../game/utils";
import {
  GameState,
  PlayerState,
  PlayerActionEnum,
  Card,
  Employee,
  ProductionEfficiency,
} from "../../game/types";

import AssignmentSelection from "./AssignmentSelection.vue";

export default {
  props: {
    availableActions: {
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    employees: {
      type: Object as PropType<PlayerState["employees"]>,
      required: true,
    },
    factories: {
      type: Object as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
    assignedEmployees: {
      type: Object as PropType<PlayerState["assignedEmployees"]>,
      required: true,
    },
  },
  computed: {
    unassignedEmployees(): Array<Employee> {
      return getUnassignedEmployees(this.employees, this.assignedEmployees);
    },
    unoccupiedFactories(): Array<Card> {
      return getUnoccupiedFactories(this.assignedEmployees, this.factories);
    },
    isAssignmentAvailable(): boolean {
      return (
        this.unassignedEmployees.length &&
        this.unoccupiedFactories.length &&
        isActionAvailable(
          this.availableActions,
          PlayerActionEnum.assignEmployee
        )
      );
    },
  },
  methods: {
    async openAssignment(): Promise<void> {
      // Don't allow choosing to start, just pick first employee
      const assignment: {
        employee: Employee;
        efficiency: ProductionEfficiency;
        factory: Card;
      } | null = await this.$showModal(AssignmentSelection, {
        props: {
          employee: this.unassignedEmployees[0],
          factories: this.unoccupiedFactories,
        },
      });

      if (assignment) {
        this.$emit(
          CustomEvents.ASSIGN_EMPLOYEE,
          PlayerActionEnum.assignEmployee,
          assignment
        );
      }
    },
  },
};
</script>

<style scoped></style>
