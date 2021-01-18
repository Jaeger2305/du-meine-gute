<template>
  <FlexboxLayout
    justifyContent="space-around"
    alignContent="center"
    alignItems="center"
    flexDirection="column"
    flexWrap="wrap"
  >
    <SecondaryResource
      :resourceType="placeholderSecondaryResource"
      :displayNumber="productionEfficiency.productionCount"
      style="height: 120px; width: 120px"
    />
    <PrimaryResource
      v-if="productionEfficiency.resourceSparingCount"
      :resourceType="placeholderPrimaryResource"
      :displayNumber="productionEfficiency.resourceSparingCount"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ProductionEfficiency } from "../../../game/types";
import { ResourceType } from "../../../game/resources";
import SecondaryResource from "./SecondaryResource.vue";
import PrimaryResource from "./PrimaryResource.vue";

export default {
  components: {
    SecondaryResource,
    PrimaryResource,
  },
  props: {
    productionEfficiency: {
      type: Object as () => ProductionEfficiency,
      required: true,
    },
  },
  data() {
    return {
      placeholderSecondaryResource: ResourceType.generic,
      placeholderPrimaryResource: ResourceType.placeholder,
    };
  },
};
</script>

<style scoped></style>
