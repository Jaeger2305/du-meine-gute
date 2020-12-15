<template>
  <FlexboxLayout justifyContent="center" alignContent="center" flexWrap="wrap">
    <PrimaryResource
      v-for="{ resource, count } in displayResources"
      :key="resource.type"
      :resourceType="resource.type"
      :displayNumber="count"
      height="50%"
      width="30%"
      @tap="$emit('tap-resource', resource)"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  Resource,
  defaultResourceOrder,
  ResourceType,
  resourceRecords,
} from "../../../game/resources";
import PrimaryResource from "./PrimaryResource.vue";
import { aggregateResources } from "../../../game/utils";
import { differenceBy } from "lodash";

export default {
  components: {
    PrimaryResource,
  },
  props: {
    resources: {
      type: Array as PropType<Array<Resource>>,
      required: true,
    },
    resourceOrder: {
      type: Object as () => typeof defaultResourceOrder,
      required: false,
      default: () => defaultResourceOrder,
    },
    isFiltered: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAggregated: {
      type: Boolean,
      required: false,
      default: true,
    },
    isSorted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    aggregatedResources() {
      const inputResources: Array<Resource> = this.resources; // help out Vue's typing intellisense.
      const aggregatedResources = aggregateResources(inputResources);
      if (this.isFiltered) return aggregatedResources;

      const specialResources = [ResourceType.unknown, ResourceType.placeholder];

      const allPrimaryResources = Object.values(resourceRecords).filter(
        ({ baseResource, type }) =>
          baseResource && !specialResources.includes(type)
      );
      const missingResources = differenceBy(
        allPrimaryResources,
        inputResources,
        "type"
      );
      const aggregatedPlaceholders = missingResources.map((resource) => ({
        resource,
        count: 0,
      }));
      return [...aggregatedResources, ...aggregatedPlaceholders];
    },
    sortedAggregatedResources() {
      // Sort descending of count.
      // Ignore equalities, so we can chain on from the sort by type.
      const sortByCount = (a, b) =>
        a.count === b.count ? 0 : a.count < b.count ? 1 : -1;

      // Use the order input to decide which report should come first.
      // Default is how common the resource is -> wood, clay, wheat, wool, metal
      const sortByType = (a, b) =>
        this.resourceOrder[a.resource.type] <
        this.resourceOrder[b.resource.type]
          ? -1
          : 1;
      const typeSorted = this.aggregatedResources.slice().sort(sortByType);

      if (!this.isSorted) return typeSorted;

      return typeSorted.sort(sortByCount);
    },
    sortedRawResources() {
      if (!this.isSorted) return this.resources;

      return this.resources.slice().sort((a, b) => {
        return this.resourceOrder[a.type] < this.resourceOrder[b.type] ? 1 : -1;
      });
    },
    displayResources() {
      return this.isAggregated
        ? this.sortedAggregatedResources
        : this.sortedRawResources.map((resource) => ({ resource }));
    },
  },
};
</script>

<style scoped></style>
