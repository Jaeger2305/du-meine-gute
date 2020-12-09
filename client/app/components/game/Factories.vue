<template>
  <GridLayout columns="*,*,*,*,*" rows="*,*">
    <Factory
      v-for="factory in displayFactories"
      :key="factory.name"
      :col="factory.position.col"
      :row="factory.position.row"
      :rowSpan="factory.position.rowSpan"
      :card="factory"
      class="factory"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerState, Card } from "../../game/types";
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
      Card & { isEnabled: boolean; position: GridPosition }
    > {
      const displayFactories = this.factories.map((factory, index) => ({
        ...factory,
        position: factoryPositions[index],
        isAssigned: Boolean(
          this.assignedEmployees.find(
            ({ assignment: { name: assignmentName } }) =>
              assignmentName === factory.name
          )
        ),
      }));
      return displayFactories;
    },
  },
  methods: {},
});
</script>

<style scoped>
.factory {
  height: 80%;
  width: 80%;
}
</style>
