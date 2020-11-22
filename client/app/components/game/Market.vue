<template>
  <FlexboxLayout flexDirection="column" backgroundColor="#3c495e">
    <Label
      v-for="{ resource, count } in aggregatedResources"
      :key="resource.type"
      :text="`${resource.type}: ${count}`"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { groupBy } from "lodash";
import { GameState } from "../../game/types";
import { ResourceType, Resource } from "../../game/resources";
import { aggregateResources } from "../../game/utils";

export default Vue.extend({
  props: {
    resources: {
      type: Array as PropType<GameState["marketCards"]>,
      required: true,
    },
  },
  computed: {
    aggregatedResources() {
      return aggregateResources(this.resources);
    },
  },
});
</script>

<style scoped></style>
