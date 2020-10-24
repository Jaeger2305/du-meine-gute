<template>
  <StackLayout orientation="vertical">
    <Employee
      v-for="{
        name,
        assignedEmployee,
        isAssignable,
        isUnassignable,
      } in displayEmployees"
      :key="name"
      :name="name"
      :isAssignable="isAssignable"
      :isUnassignable="isUnassignable"
      :assignedEmployee="assignedEmployee"
      :cardsInHand="cardsInHand"
      :cardsInPlay="cardsInPlay"
      :marketCards="marketCards"
      :resources="resources"
      @produce-at-factory="bubbleProduction"
      @unassign-employee="bubbleUnassignment"
    />
    <Button
      v-if="isHiringPhase"
      text="purchase employees"
      @tap="goToAvailableEmployees"
    />
  </StackLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/client";
import { isActionAvailable } from "../../game/utils";
import {
  AssignedEmployee,
  Card,
  Employee,
  GameState,
  PlayerState,
} from "../../game/types";
import Production from "./Production.vue";
import { Resource } from "../../game/resources";
import EmployeeShop from "./EmployeeShop.vue";

export default Vue.extend({
  props: {
    availableActions: {
      type: Array as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    employees: {
      type: Array as PropType<PlayerState["employees"]>,
      required: true,
    },
    assignedEmployees: {
      type: Array as PropType<PlayerState["assignedEmployees"]>,
      required: true,
    },
    availableEmployees: {
      type: Array as PropType<GameState["availableEmployees"]>,
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
    isProductionPhase() {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.produceAtFactory
      );
    },
    isUnassignmentPhase() {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.unassignEmployee
      );
    },
    isHiringPhase() {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.hireWorker
      );
    },
    displayEmployees(): Array<
      Employee & {
        isAssignable: boolean;
        isUnassignable: boolean;
        assigned: AssignedEmployee | undefined;
      }
    > {
      return this.employees.map((employee) => {
        const assignedEmployee = this.assignedEmployees.find(
          (ae) => ae.name === employee.name
        );
        const isAssignable = Boolean(
          assignedEmployee &&
            !assignedEmployee.hasProduced &&
            this.isProductionPhase
        );
        const isUnassignable = Boolean(
          assignedEmployee &&
            assignedEmployee.unassignmentCost &&
            this.isUnassignmentPhase
        );
        return {
          ...employee,
          isAssignable,
          isUnassignable,
          assignedEmployee,
        };
      });
    },
  },
  methods: {
    bubbleProduction(...args) {
      this.$emit(CustomEvents.PRODUCE_AT_FACTORY, ...args);
    },
    bubbleUnassignment(...args) {
      this.$emit(CustomEvents.UNASSIGN_EMPLOYEE, ...args);
    },
    async goToAvailableEmployees(): Promise<void> {
      const employeeShopResult: {
        employee: Employee;
        resources: Array<Resource>;
      } | null = await this.$showModal(EmployeeShop, {
        fullscreen: true,
        props: {
          resources: this.resources,
          availableEmployees: this.availableEmployees,
        },
      });

      // The employee shop might just be browsed and closed, so only do something in case it returns a notable result.
      if (employeeShopResult) {
        this.$emit(
          CustomEvents.HIRE_EMPLOYEE,
          PlayerActionEnum.hireWorker,
          employeeShopResult
        );
      }
    },
  },
});
</script>

<style scoped></style>
