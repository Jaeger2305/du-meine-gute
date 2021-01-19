<template>
  <GridLayout columns="*" rows="*">
    <Image
      v-if="isBackgroundVisible"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
    />
    <FlexboxLayout
      justifyContent="space-around"
      alignContent="space-around"
      flexWrap="wrap"
      style="margin: 0%;"
    >
      <SecondaryResource
        v-for="{ resource, count } in displayResources"
        :key="resource.type"
        :resourceType="resource.type"
        :displayNumber="`${count}`"
        :height="`${size}%`"
        :width="`${size}%`"
        :style="`margin: ${size / 12}%; height: 100%; width: 100%;`"
        @tap="$emit('tap-resource', resource)"
      />
      <GameIconImage
        :displayNumber="resourceTotalValue"
        src="~/assets/images/icons/money.png"
        :height="`${size - 10}%`"
        :width="`${size - 10}%`"
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
import GameIconImage from "../reusable/GameIconImage.vue";

export default {
  components: { SecondaryResource, GameIconImage },
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
    size() {
      return this.displayResources.length < 4 ? 45 : 30;
    },
  },
};
</script>

<style scoped></style>
