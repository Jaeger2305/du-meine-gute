<template>
  <GridLayout
    columns="2*, 30px, *"
    rows="2*,5*"
    class="card-container"
    :class="[`base-bg-${resourceType}`, `lowlight-outline-${resourceType}`]"
  >
    <FlexboxLayout
      col="0"
      row="0"
      alignItems="center"
      justifyContent="center"
      class="title-container"
      :class="[`highlight-bg-${resourceType}`]"
    >
      <Label text="test-card" class="h1" />
    </FlexboxLayout>
    <!-- Production info -->
    <GridLayout col="0" row="1" columns="4*,*,8*,*,4*" rows="3*,*,3*">
      <!-- Primary input -->
      <PrimaryResource
        col="0"
        colSpan="2"
        row="0"
        rowSpan="2"
        :resourceType="'clay'"
        :displayNumber="'2'"
      />
      <PrimaryResource
        col="0"
        colSpan="2"
        row="1"
        rowSpan="2"
        :resourceType="'wheat'"
        :displayNumber="'1'"
      />
      <!-- Output -->
      <SecondaryResource
        col="2"
        row="0"
        rowSpan="3"
        :resourceType="'unknown'"
      />
      <!-- Chain input -->
      <PrimaryResource
        col="3"
        colSpan="2"
        row="0"
        rowSpan="2"
        :resourceType="'metal'"
        :displayNumber="'1'"
      />
      <PrimaryResource
        col="3"
        colSpan="2"
        row="1"
        rowSpan="2"
        :resourceType="'wood'"
        :displayNumber="'1'"
      />
      <!-- Arrows -->
      <Label
        col="0"
        row="0"
        rowSpan="3"
        colSpan="2"
        :text="'\uf138'"
        class="fa left"
      />
      <Label
        col="3"
        row="0"
        rowSpan="3"
        colSpan="2"
        :text="'\uf137'"
        class="fa right"
      />
    </GridLayout>
    <Label
      col="1"
      row="1"
      text=""
      class="separator"
      :class="[`base-bg-${resourceType}`]"
    />
    <FlexboxLayout
      col="2"
      row="0"
      alignItems="center"
      justifyContent="space-around"
      class="attribute-container"
    >
      <GameIcon :unicodeIcon="'\uf3ed'" :displayNumber="5" />
      <GameIcon :unicodeIcon="'\uf51e'" :displayNumber="5" />
    </FlexboxLayout>
    <Image col="2" row="1" src="~/assets/images/placeholder-factory.png" />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIcon from "../reusable/GameIcon.vue";
import PrimaryResource from "../reusable/PrimaryResource.vue";
import SecondaryResource from "../reusable/SecondaryResource.vue";
import { ResourceType } from "../../../game/resources";

export default {
  props: {
    resourceType: {
      type: String as () => ResourceType,
      required: true,
    },
  },
  components: { GameIcon, PrimaryResource, SecondaryResource },
};
</script>

<style scoped>
.lowlight-outline-clay {
  border-color: var(--clay-color-lowlight);
}
.lowlight-bg-clay {
  background-color: var(--clay-color-lowlight);
}
.highlight-bg-clay {
  background-color: var(--clay-color-highlight);
}
.base-bg-clay {
  background-color: var(--clay-color-base);
}

.lowlight-outline-wood {
  border-color: var(--wood-color-lowlight);
}
.lowlight-bg-wood {
  background-color: var(--wood-color-lowlight);
}
.highlight-bg-wood {
  background-color: var(--wood-color-highlight);
}
.base-bg-wood {
  background-color: var(--wood-color-base);
}

.lowlight-outline-metal {
  border-color: var(--metal-color-lowlight);
}
.lowlight-bg-metal {
  background-color: var(--metal-color-lowlight);
}
.highlight-bg-metal {
  background-color: var(--metal-color-highlight);
}
.base-bg-metal {
  background-color: var(--metal-color-base);
}

.lowlight-outline-wheat {
  border-color: var(--wheat-color-lowlight);
}
.lowlight-bg-wheat {
  background-color: var(--wheat-color-lowlight);
}
.highlight-bg-wheat {
  background-color: var(--wheat-color-highlight);
}
.base-bg-wheat {
  background-color: var(--wheat-color-base);
}

.lowlight-outline-linen {
  border-color: var(--linen-color-lowlight);
}
.lowlight-bg-linen {
  background-color: var(--linen-color-lowlight);
}
.highlight-bg-linen {
  background-color: var(--linen-color-highlight);
}
.base-bg-linen {
  background-color: var(--linen-color-base);
}

.lowlight-outline-unknown {
  border-color: var(--unknown-color-lowlight);
}
.lowlight-bg-unknown {
  background-color: var(--unknown-color-lowlight);
}
.highlight-bg-unknown {
  background-color: var(--unknown-color-highlight);
}
.base-bg-unknown {
  background-color: var(--unknown-color-base);
}

.card-container {
  width: 600px;
  height: 320px;
  border-radius: 5px;
  border-width: 5px;
  android-elevation: 5;
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

.attribute-item {
  margin: 5px;
}

.separator {
  height: 60%;
  width: 25px;
}

.icon-placeholder-small {
  height: 50px;
  width: 50px;
  color: white;
}

.icon-placeholder-big {
  height: 150px;
  width: 150px;
}

.icon-placeholder {
  height: 50px;
  width: 90px;
}

.fa {
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  height: 50px;
  width: 50px;
}
.left {
  color: white;
}
.right {
  color: black;
}
</style>
