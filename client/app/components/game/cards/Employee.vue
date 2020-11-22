<template>
  <GridLayout
    :columns="isLarge ? '2*, 30px, *' : '*'"
    :rows="isLarge ? '2*,5*' : '*'"
    class="card-container base-bg-employee lowlight-outline-employee"
    :class="[`size-${size}`]"
  >
    <!-- Title -->
    <FlexboxLayout
      v-if="isLarge"
      col="0"
      row="0"
      alignContent="center"
      justifyContent="center"
      class="title-container highlight-bg-employee"
    >
      <Label :text="employee.name" class="h1" />
    </FlexboxLayout>
    <!-- Production info -->
    <FlexboxLayout col="0" row="1" justifyContent="center">
      <FlexboxLayout
        v-for="(mode, index) in employee.modes"
        :key="`${mode.productionCount}-${mode.resourceSparingCount}`"
      >
        <ProductionEfficiency :productionEfficiency="mode" />
        <Label
          v-if="index !== employee.modes.length - 1"
          text=""
          class="separator highlight-bg-employee"
        />
      </FlexboxLayout>
    </FlexboxLayout>

    <!-- Right container with card details -->
    <FlexboxLayout
      v-if="isLarge"
      col="2"
      row="0"
      alignContent="center"
      justifyContent="space-around"
      class="attribute-container"
    >
      <GameIcon :unicodeIcon="'\uf3ed'" :displayNumber="employee.points" />
      <GameIcon :unicodeIcon="'\uf51e'" :displayNumber="employee.cost" />
    </FlexboxLayout>
    <Image
      v-if="isLarge"
      col="2"
      row="1"
      src="~/assets/images/placeholder-factory.png"
    />
    <FlexboxLayout
      v-if="isLarge"
      col="2"
      row="1"
      flexDirection="column-reverse"
      class="attribute-container"
    >
      <PrimaryResourceCollection
        :resources="employee.resourceSpecialty"
        :isFiltered="true"
        alignSelf="flex-end"
      />
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIcon from "../reusable/GameIcon.vue";
import { Resource, ResourceType } from "../../../game/resources";
import { Employee } from "../../../game/types";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import ProductionEfficiency from "../reusable/ProductionEfficiency.vue";

export enum Size {
  Small = "small",
  Large = "large",
}

export enum CardActions {}

export default {
  props: {
    employee: {
      type: Object as () => Employee,
      required: true,
    },
    size: {
      type: String as () => Size,
      required: false,
      default: Size.Large,
    },
  },
  components: {
    GameIcon,
    PrimaryResourceCollection,
    ProductionEfficiency,
  },
  computed: {
    isLarge(): boolean {
      return this.size === Size.Large;
    },
    modes() {
      return this.employee.modes;
    },
  },
  methods: {},
};
</script>

<style scoped>
.lowlight-outline-employee {
  border-color: var(--employee-color-lowlight);
}
.lowlight-bg-employee {
  background-color: var(--employee-color-lowlight);
}
.highlight-bg-employee {
  background-color: var(--employee-color-highlight);
}
.base-bg-employee {
  background-color: var(--employee-color-base);
}

.card-container {
  border-radius: 5px;
  border-width: 5px;
  android-elevation: 5;
}

.size-large {
  width: 600px;
  height: 320px;
}

.size-small {
  width: 200px;
  height: 200px;
}

.title-container {
  border-radius: 100%;
  margin: 5px;
}

.h1 {
  font-size: 20px;
  color: white;
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
}

.attribute-container {
  margin: 5px;
}

.separator {
  height: 50%;
  width: 10px;
  margin: 15px;
}

.fa {
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  height: 50px;
  width: 50px;
}
</style>
