<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Card
      v-for="{ name, assigned, isAssignable } in displayEmployees"
      :key="name"
      :name="name"
      :isEnabled="isAssignable"
      @click="produceAtFactory(assigned)"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/client";
import { isActionAvailable } from "../../game/utils";
import {
  AssignedEmployee,
  Employee,
  GameState,
  PlayerState,
} from "../../game/types";
import Production from "./Production.vue";

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
    displayEmployees(): Array<
      Employee & {
        isAssignable: boolean;
        assigned: AssignedEmployee | undefined;
      }
    > {
      return this.employees.map((employee) => {
        const assigned = this.assignedEmployees.find(
          (ae) => ae.name === employee.name
        );
        const isAssignable = Boolean(
          assigned && !assigned.hasProduced && this.isProductionPhase
        );
        return {
          ...employee,
          isAssignable,
          assigned,
        };
      });
    },
  },
  methods: {
    async produceAtFactory(assignedEmployee: AssignedEmployee) {
      const { resources, cardsInHand } = this;
      const marketResources = [
        ...this.marketCards.map((card) => card.resource),
        ...this.cardsInPlay.flatMap((card) => card.marketBoost).filter(Boolean),
      ];
      const res = await this.$showModal(Production, {
        fullscreen: true,
        props: { assignedEmployee, cardsInHand, marketResources, resources },
      });
      // Just log output while debugging. It should send an event with the selected data to commit to the server.
      console.log(assignedEmployee, res);
      // this.$emit(CustomEvents.PRODUCE_AT_FACTORY, assignment);
    },
  },
});
</script>

<style scoped></style>
