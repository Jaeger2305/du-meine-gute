<template>
  <GridLayout columns="2*,5*,2*" rows="*" class="grid-container">
    <PrimaryResourceCollection
      column="0"
      :resources="marketResources"
      :isSorted="true"
      class="market-resources"
    />
    <CarouselSelect
      v-if="Number.isInteger(activeEmployeeIndex)"
      class="grid-item"
      column="1"
      :index.sync="activeEmployeeIndex"
      :selectableListLength="unassignedEmployees.length"
    >
      <Employee
        v-if="unassignedEmployees.length"
        :employee="unassignedEmployees[activeEmployeeIndex]"
        @tap-employee-efficiency="close"
      />
    </CarouselSelect>
    <FlexboxLayout
      column="2"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
    >
      <Button class="button" @tap="endStep">END</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import {
  SwipeGestureEventData,
  SwipeDirection,
} from "@nativescript/core/ui/gestures";
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import { CustomEvents } from "../../../types";
import { Resource } from "../../../game/resources";
import EmployeeComponent from "../cards/Employee.vue";
import { Employee } from "../../../game/types";
import { getUnassignedEmployees } from "../../../game/utils";
import CarouselSelect from "../../CarouselSelect.vue";
import { LogLevel } from "../../../game/server-action/types";

export default {
  props: {},
  components: {
    Notification,
    PrimaryResourceCollection,
    Employee: EmployeeComponent,
    CarouselSelect,
  },
  data(): {
    activeEmployeeIndex: number;
  } {
    return {
      activeEmployeeIndex: this.unassignedEmployees?.length ? 0 : null,
    };
  },
  watch: {
    // Bit hacky but to sync the data from the carousel, which is affected by a computed, I think this is the only way
    unassignedEmployees: {
      handler(newAssignedEmployees) {
        if (!newAssignedEmployees.length) return;

        this.activeEmployeeIndex = 0;
      },
      immediate: true,
    },
  },
  computed: {
    marketResources(): Array<Resource> {
      return this.$store.state.gameState.marketCards.map(
        ({ resource }) => resource
      );
    },
    unassignedEmployees(): Array<Employee> {
      return getUnassignedEmployees(
        this.$store.state.playerState.employees,
        this.$store.state.playerState.assignedEmployees
      );
    },
  },
  methods: {
    endStep() {
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.endStep,
        LogLevel.Debug,
        null
      );
    },
    close() {
      this.$emit("swipe", {
        direction: SwipeDirection.up,
      } as SwipeGestureEventData);
    },
  },
};
</script>

<style scoped>
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}

.market-resources {
  margin: 10px 5px 10px 5px;
}
</style>
