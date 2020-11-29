<template>
  <GridLayout columns="*,*,*,*,*" rows="*,*">
    <Factory
      v-if="displayFactories[8]"
      col="0"
      row="0"
      :card="displayFactories[8]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[6]"
      col="0"
      row="1"
      :card="displayFactories[6]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[4]"
      col="1"
      row="0"
      :card="displayFactories[4]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[2]"
      col="1"
      row="1"
      :card="displayFactories[2]"
      class="factory"
    />
    <Factory
      col="2"
      rowSpan="2"
      :card="displayFactories[0]"
      class="factory"
      style="height: 50%"
    />
    <Factory
      v-if="displayFactories[3]"
      col="3"
      row="0"
      :card="displayFactories[3]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[1]"
      col="3"
      row="1"
      :card="displayFactories[1]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[7]"
      col="4"
      row="0"
      :card="displayFactories[7]"
      class="factory"
    />
    <Factory
      v-if="displayFactories[5]"
      col="4"
      row="1"
      :card="displayFactories[5]"
      class="factory"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerState, Card } from "../../game/types";
import Factory from "./cards/Factory.vue";

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
    displayFactories(): Array<Card & { isEnabled: boolean }> {
      const displayFactories = this.factories.map((factory) => ({
        ...factory,
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
