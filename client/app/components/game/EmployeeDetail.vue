<template>
  <GridLayout columns="3*, *, *, 2*" rows="*, 2*">
    <!-- |---------------|---------------|---------------|---------------| -->
    <!-- |     name      |     cost      |     points    |               | -->
    <!-- |---------------|---------------|---------------|   purchase    | -->
    <!-- |     modes     |         specialities          |               | -->
    <!-- |---------------|---------------|---------------|---------------| -->
    <StackLayout column="0" row="0" orientation="horizontal">
      <Label :text="name" />
    </StackLayout>
    <StackLayout column="1" row="0" orientation="horizontal">
      <Label text="Cost:" />
      <Label :text="cost" />
    </StackLayout>
    <StackLayout column="2" row="0" orientation="horizontal">
      <Label text="Points:" />
      <Label :text="points" />
    </StackLayout>
    <StackLayout column="3" row="0" rowSpan="2" orientation="horizontal">
      <Button text="purchase" :isEnabled="isHireable" @tap="purchase" />
    </StackLayout>

    <StackLayout column="0" row="1" orientation="vertical">
      <Label text="Modes:" />
      <Label
        v-for="mode in modes"
        :key="`${mode.productionCount}~${mode.resourceSparingCount}`"
        :text="
          `Produces ${mode.productionCount} and can spare ${mode.resourceSparingCount} base resources`
        "
      />
    </StackLayout>
    <StackLayout column="1" row="1" colSpan="2" orientation="horizontal">
      <Label text="Specialities:" />
      <Label :text="specialitiesDescription" />
    </StackLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { ProductionEfficiency } from "../../game/types";
import { Resource } from "../../game/resources";

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    isHireable: {
      type: Boolean,
      required: true,
    },
    modes: {
      type: Array as PropType<Array<ProductionEfficiency>>,
      required: true,
    },
    resourceSpecialty: {
      type: Array as PropType<Array<Resource>>,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  computed: {
    specialitiesDescription(): string {
      return this.resourceSpecialty.map((resource) => resource.type).join();
    },
  },
  methods: {
    purchase(): void {
      this.$emit(CustomEvents.HIRE_EMPLOYEE);
    },
  },
});
</script>

<style scoped></style>
