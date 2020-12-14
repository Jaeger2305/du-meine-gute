<template>
  <GridLayout columns="*" rows="*,*,*">
    <Image rowSpan="2" src="~/assets/images/placeholder-factory.png" />
    <Label v-if="assignedEmployee" :text="assignedEmployee.name" />
    <SecondaryResourceCollection
      v-if="card.productionConfig"
      row="1"
      rowSpan="2"
      :resources="card.productionConfig.output"
      :isFiltered="true"
      :isBackgroundVisible="false"
    />
    <GameIcon
      v-if="isActionable || assignedEmployee"
      :unicodeIcon="`\uf6e3`"
      :isActionable="isActionable"
      @tap-game-icon="toggleWorker"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { AssignedEmployee, Card, PlayerActionEnum } from "../../../game/types";
import SecondaryResourceCollection from "../right-drawer/SecondaryResourceCollection.vue";
import GameIcon from "../reusable/GameIcon.vue";
import { isActionAvailable } from "../../../game/utils";
import { CustomEvents } from "../../../types";
import { handleValidationError } from "../../../utils";
import { MutationEnum } from "../../../store";
import { playerActions } from "../../../game/client";

// Is assigned already?
// Resource output?
// Is produced already?
// Number of goods
// Value of factory

export default {
  components: { SecondaryResourceCollection, GameIcon },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee>,
      required: false,
      default: null,
    },
  },
  computed: {
    isActionable(): boolean {
      return Boolean(
        this.card.productionConfig && (this.isUnassignable || this.isAssignable)
      );
    },
    isUnassignable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.unassignEmployee
        ) && this.assignedEmployee
      );
    },
    isAssignable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.assignEmployee
        ) &&
          !this.assignedEmployee &&
          this.$store.state.stagedAssignment
      );
    },
  },
  methods: {
    toggleWorker(): void {
      debugger;
      if (!this.isActionable) return;

      if (this.isAssignable) {
        const assignmentPayload: Parameters<
          typeof playerActions[PlayerActionEnum.assignEmployee]
        >[2] = {
          efficiency: this.$store.state.stagedAssignment.efficiency,
          employee: this.$store.state.stagedAssignment.employee,
          factory: this.card,
        };
        this.$emit(
          CustomEvents.ASSIGN_EMPLOYEE,
          PlayerActionEnum.assignEmployee,
          assignmentPayload
        );
        this.$store.commit(MutationEnum.StageEmployee, null);
      } else if (this.isUnassignable) {
        const unassignmentPayload: Parameters<
          typeof playerActions[PlayerActionEnum.unassignEmployee]
        >[2] = {
          nameOfEmployeeToUnassign: this.assignedEmployee.name,
          resourcePayment: undefined, // simple for now
        };
        this.$emit(
          CustomEvents.UNASSIGN_EMPLOYEE,
          PlayerActionEnum.unassignEmployee,
          unassignmentPayload
        );
      } else {
        handleValidationError(
          new Error(
            `Worker toggled for ${JSON.stringify(
              this.card
            )}, but this is an ilegal move`
          )
        );
      }
    },
  },
};
</script>

<style scoped></style>
