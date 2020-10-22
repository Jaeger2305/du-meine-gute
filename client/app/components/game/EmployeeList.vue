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
    <Button text="purchase employees" @tap="goToAvailableEmployees" />
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
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    employees: {
      type: Object as PropType<PlayerState["employees"]>,
      required: true,
    },
    assignedEmployees: {
      type: Object as PropType<PlayerState["assignedEmployees"]>,
      required: true,
    },
    availableEmployees: {
      type: Object as PropType<GameState["availableEmployees"]>,
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
      const employeeShopResult: null | {
        employee: Employee;
        resources: Array<Resource>;
      } = await this.$showModal(EmployeeShop, {
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
