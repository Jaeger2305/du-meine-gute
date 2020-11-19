<template>
  <GridLayout
    columns="2*, 30px, *"
    rows="2*,5*"
    class="card-container"
    :class="[
      `base-bg-${card.resource.type}`,
      `lowlight-outline-${card.resource.type}`,
    ]"
  >
    <FlexboxLayout
      col="0"
      row="0"
      alignContent="center"
      justifyContent="center"
      class="title-container"
      :class="[`highlight-bg-${card.resource.type}`]"
    >
      <Label :text="card.name" class="h1" />
    </FlexboxLayout>
    <!-- Production info -->
    <GridLayout
      v-if="card.productionConfig"
      col="0"
      row="1"
      columns="4*,*,8*,*,4*"
      rows="3*,*,3*"
    >
      <!-- Primary input -->
      <FlexboxLayout
        col="0"
        colSpan="2"
        row="0"
        rowSpan="3"
        flexDirection="column"
        justifyContent="space-around"
      >
        <PrimaryResource
          v-for="{ type, count } in inputResources"
          :key="type"
          alignSelf="center"
          :resourceType="type"
          :displayNumber="count"
        />
      </FlexboxLayout>
      <!-- Output -->
      <SecondaryResource
        v-for
        col="2"
        row="0"
        rowSpan="3"
        :resourceType="card.productionConfig.output"
      />
      <!-- Chain input -->
      <FlexboxLayout
        v-if="card.productionConfig.chainInput"
        col="3"
        colSpan="2"
        row="0"
        rowSpan="3"
        flexDirection="column"
        justifyContent="space-around"
      >
        <PrimaryResource
          v-for="{ type, count } in chainInputResources"
          :key="type"
          alignSelf="center"
          :resourceType="type"
          :displayNumber="count"
        />
      </FlexboxLayout>
      <!-- Arrows -->
      <FlexboxLayout
        col="0"
        colSpan="5"
        row="0"
        rowSpan="3"
        justifyContent="space-around"
      >
        <Label :text="'\uf138'" class="fa left" alignSelf="center" />
        <Label :text="'\uf137'" class="fa right" alignSelf="center" />
      </FlexboxLayout>
    </GridLayout>
    <Label
      col="1"
      row="1"
      text=""
      class="separator"
      :class="[`base-bg-${card.resource.type}`]"
    />
    <FlexboxLayout
      col="2"
      row="0"
      alignContent="center"
      justifyContent="space-around"
      class="attribute-container"
    >
      <GameIcon :unicodeIcon="'\uf3ed'" :displayNumber="card.points" />
      <GameIcon :unicodeIcon="'\uf51e'" :displayNumber="card.cost" />
    </FlexboxLayout>
    <Image col="2" row="1" src="~/assets/images/placeholder-factory.png" />
    <FlexboxLayout
      col="2"
      row="1"
      flexDirection="column-reverse"
      class="attribute-container"
    >
      <PrimaryResource
        :resourceType="card.resource.type"
        alignSelf="flex-end"
      />
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIcon from "../reusable/GameIcon.vue";
import PrimaryResource from "../reusable/PrimaryResource.vue";
import SecondaryResource from "../reusable/SecondaryResource.vue";
import { ResourceType, Resource } from "../../../game/resources";
import { Card } from "../../../game/types";
import { groupBy } from "lodash";

type AggregatedResource = {
  type: ResourceType;
  count: number;
};

function aggregateResources(resources: Array<Resource> = []) {
  const aggregatedResources = groupBy<Resource>(resources, "type");
  return Object.entries(aggregatedResources).map(([type, resources]) => ({
    type: type as ResourceType,
    count: resources.length,
  }));
}

export default {
  props: {
    card: {
      type: Object as () => Card,
      required: true,
    },
  },
  components: { GameIcon, PrimaryResource, SecondaryResource },
  computed: {
    inputResources(): Array<AggregatedResource> {
      return aggregateResources(this.card.productionConfig?.input);
    },
    outputResources(): Array<AggregatedResource> {
      return aggregateResources(this.card.productionConfig?.output);
    },
    chainInputResources(): Array<AggregatedResource> {
      return aggregateResources(this.card.productionConfig?.chainInput);
    },
  },
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

.lowlight-outline-wool {
  border-color: var(--wool-color-lowlight);
}
.lowlight-bg-wool {
  background-color: var(--wool-color-lowlight);
}
.highlight-bg-wool {
  background-color: var(--wool-color-highlight);
}
.base-bg-wool {
  background-color: var(--wool-color-base);
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
  width: 50px;
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
