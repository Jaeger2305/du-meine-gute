<template>
  <FlexboxLayout>
    <Card
      v-for="factory in displayFactories"
      :key="factory.name"
      :name="factory.name"
      :is-enabled="!factory.isAssigned"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerState, Card } from "../../game/types";

export default Vue.extend({
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

<style scoped></style>
