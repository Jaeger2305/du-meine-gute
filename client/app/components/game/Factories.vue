<template>
  <GridLayout columns="*,*,*,*,*" rows="*,*">
    <Factory
      v-for="factory in displayFactories"
      :key="factory.name"
      :col="factory.position.col"
      :row="factory.position.row"
      :rowSpan="factory.position.rowSpan"
      :card="factory"
      :assignedEmployee="factory.assignedEmployee"
      :isPlaceholder="factory.isPlaceholder"
      @produce-at-factory="bubbleAction"
      @assign-employee="bubbleAction"
      @unassign-employee="bubbleAction"
      @build-factory="bubbleAction"
      @unreserve-factory="bubbleAction"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerState, Card, AssignedEmployee } from "../../game/types";
import { CustomEvents } from "../../types";
import Factory from "./cards/Factory.vue";

type GridPosition = {
  col: number;
  row: number;
  rowSpan?: number;
};

// Arrange the factories spreading out from the center of a 3 by 5 grid.
// Could probably derive a function here if we needed to go beyond 9 factories, but probably at that point pagination would be better, so just keep it simple.
const factoryPositions: Array<GridPosition> = [
  {
    col: 2,
    row: 0,
    rowSpan: 2,
  },
  {
    col: 3,
    row: 1,
  },
  {
    col: 1,
    row: 1,
  },
  {
    col: 3,
    row: 0,
  },
  {
    col: 1,
    row: 0,
  },
  {
    col: 4,
    row: 1,
  },
  {
    col: 0,
    row: 1,
  },
  {
    col: 4,
    row: 0,
  },
  {
    col: 0,
    row: 0,
  },
];

export default Vue.extend({
  components: { Factory },
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    factories: {
      type: Array as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
    assignedEmployees: {
      type: Array as PropType<PlayerState["assignedEmployees"]>,
      required: true,
    },
  },
  computed: {
    displayFactories(): Array<
      Card & {
        assignedEmployee: AssignedEmployee;
        position: GridPosition;
        isPlaceholder: boolean;
      }
    > {
      // Just in case we ever go above 8 factories with a slot for reserved factory.
      if (this.factories.length >= factoryPositions.length)
        throw new Error(
          `this device cannot handle displaying ${this.factories.length +
            1} factories, max (${factoryPositions.length})`
        );

      const constructedFactories = this.factories.map((factory, index) => ({
        ...factory,
        isPlaceholder: false,
        position: factoryPositions[index],
        assignedEmployee: this.assignedEmployees.find(
          ({ assignment: { name: assignmentName } }) =>
            assignmentName === factory.name
        ),
      }));

      const plannedFactories = this.$store.state.playerState.reservedFactory
        ? [
            {
              ...this.$store.state.playerState.reservedFactory,
              isPlaceholder: true,
              position: factoryPositions[constructedFactories.length],
              assignedEmployee: undefined,
            },
          ]
        : [];

      return [...constructedFactories, ...plannedFactories];
    },
  },
  methods: {
    bubbleAction(...args) {
      this.$emit(CustomEvents.PLAYER_ACTION, ...args);
    },
  },
});
</script>

<style scoped></style>
