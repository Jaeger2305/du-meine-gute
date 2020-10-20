<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Card
      :name="name"
      :isEnabled="isAssignable"
      @click="produceAtFactory(assigned)"
    />
    <Button v-if="isUnassignable" @tap="unassignEmployee">unassign</Button>
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

export default Vue.extend({
  props: {
    employee: {
      type: Object as PropType<Employee>,
      required: true,
    },
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee>,
      required: true,
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
    unassignEmployee(assignedEmployee: AssignedEmployee) {
      console.warn("not listened to or implemented yet");
      this.$emit(
        CustomEvents.UNASSIGN_EMPLOYEE,
        PlayerActionEnum.unassignEmployee,
        assignedEmployee
      );
    },
  },
});
</script>

<style scoped></style>
