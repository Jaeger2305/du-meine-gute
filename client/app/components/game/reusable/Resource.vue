<template>
  <FlexboxLayout>
    <PrimaryResource
      v-if="resource.baseResource"
      :resourceType="resource.type"
      :displayNumber="displayNumber"
    />
    <SecondaryResource
      v-else
      :resourceType="resource.type"
      :displayNumber="displayNumber"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Resource } from "../../../game/resources";
import PrimaryResource from "./PrimaryResource.vue";
import SecondaryResource from "./SecondaryResource.vue";

export default {
  components: { PrimaryResource, SecondaryResource },
  props: {
    displayNumber: {
      type: String,
      required: false,
      default: "",
    },
    resource: {
      type: Object as () => Resource,
      required: true,
    },
  },
};
</script>
