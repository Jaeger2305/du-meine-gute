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
import Vue, { PropType } from "vue";
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import { CustomEvents } from "../../../types";
import { Resource } from "../../../game/resources";
import EmployeeComponent from "../cards/Employee.vue";
import { Employee } from "../../../game/types";
import { getUnassignedEmployees } from "../../../game/utils";
import CarouselSelect from "../../CarouselSelect.vue";

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
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep, null);
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

.button {
  font-family: "Grandstander", "Grandstander-Regular";
  font-size: 30px;
  border-width: 7px;
  border-color: lightblue;
  border-radius: 7px;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgba(188, 209, 215, 1) 0%,
    rgba(211, 229, 235, 1) 25%,
    rgba(211, 229, 235, 1) 75%,
    rgba(237, 246, 249, 1) 100%
  );
  margin: 5px 0px 5px 0px;
}

.button:highlighted {
  border-color: #8ebccc;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgb(209, 225, 230) 0%,
    rgb(227, 240, 245) 25%,
    rgb(227, 242, 247) 75%,
    rgb(250, 254, 255) 100%
  );
}
</style>
