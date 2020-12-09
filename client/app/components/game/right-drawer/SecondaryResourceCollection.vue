<template>
  <GridLayout columns="*" rows="*">
    <Image
      v-if="isBackgroundVisible"
      colSpan="3"
      rowSpan="3"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <FlexboxLayout
      justifyContent="center"
      alignContent="center"
      flexWrap="wrap"
      style="margin: 30px;"
    >
      <SecondaryResource
        v-for="{ resource, count } in displayResources"
        :key="resource.type"
        :resourceType="resource.type"
        :displayNumber="count"
        height="30%"
        width="30%"
        style="margin: 10px;"
      />
      <GameIcon
        :displayNumber="resourceTotalValue"
        :size="large"
        :unicodeIcon="`\uf51e`"
        height="30%"
        width="30%"
      />
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  defaultResourceOrder,
  Resource,
  resourceRecords,
  ResourceType,
} from "../../../game/resources";
import SecondaryResource from "../reusable/SecondaryResource.vue";
import { aggregateResources } from "../../../game/utils";
import { differenceBy, sumBy } from "lodash";
import GameIcon from "../reusable/GameIcon.vue";

export default {
  components: { SecondaryResource, GameIcon },
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
    isBackgroundVisible: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    aggregatedResources() {
      const inputResources: Array<Resource> = this.resources; // help out Vue's typing intellisense.
      const aggregatedResources = aggregateResources(inputResources);
      if (this.isFiltered) return aggregatedResources;

      const specialResources = [ResourceType.unknown, ResourceType.placeholder];

      const allSecondaryResources = Object.values(resourceRecords).filter(
        ({ baseResource, type }) =>
          !baseResource && !specialResources.includes(type)
      );
      const missingResources = differenceBy(
        allSecondaryResources,
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
    resourceTotalValue(): number {
      return sumBy(this.resources, "value");
    },
  },
};
</script>

<style scoped></style>
