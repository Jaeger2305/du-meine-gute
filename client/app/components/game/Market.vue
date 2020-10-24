<template>
  <FlexboxLayout flexDirection="column" backgroundColor="#3c495e">
    <Label
      v-for="{ type, count } in aggregatedResources"
      :key="type"
      :text="`${type}: ${count}`"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { groupBy } from "lodash";
import { GameState } from "../../game/types";
import { ResourceType, Resource } from "../../game/resources";

export default Vue.extend({
  props: {
    resources: {
      type: Array as PropType<GameState["marketCards"]>,
      required: true,
    },
  },
  computed: {
    aggregatedResources(): Array<{ type: ResourceType; count: number }> {
      const groupedResources = groupBy(
        this.resources as Array<Resource>,
        "type"
      ) as { [key in ResourceType]?: Array<Resource> };
      return Object.entries(groupedResources).map(([key, value]) => ({
        type: key as ResourceType,
        count: value.length,
      }));
    },
  },
});
</script>

<style scoped></style>
