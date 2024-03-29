<template>
  <GridLayout
    :columns="isLarge ? '2*, 30px, *' : '*'"
    :rows="isLarge ? '2*,5*' : '*'"
    class="card-container"
    :class="[
      `base-bg-${card.resource.type}`,
      `lowlight-outline-${card.resource.type}`,
      `size-${size}`,
      isActionable ? 'actionable' : 'disabled',
    ]"
    @tap="contextualAction"
  >
    <!-- Title -->
    <FlexboxLayout
      v-if="isLarge"
      col="0"
      row="0"
      alignContent="center"
      justifyContent="center"
      class="title-container"
      :class="[`highlight-bg-${card.resource.type}`]"
    >
      <Label :text="$t(`factory.${card.type}`)" class="h1" :textWrap="true" />
    </FlexboxLayout>
    <!-- Production info -->
    <Image
      v-if="card.boostDrawCount"
      col="0"
      row="1"
      src="~/assets/images/icons/draw-cards.png"
    />
    <Image
      v-if="card.marketBoost"
      col="0"
      row="1"
      :src="
        `~/assets/images/icons/boost-market-${card.marketBoost[0].type}.png`
      "
    />
    <GridLayout
      v-if="card.productionConfig"
      col="0"
      row="1"
      columns="4*,*,8*,*,4*"
      rows="3*,*,3*"
    >
      <!-- Primary input -->
      <FlexboxLayout
        v-if="isLarge"
        col="0"
        colSpan="2"
        row="0"
        rowSpan="3"
        flexDirection="column"
        justifyContent="space-around"
      >
        <Resource
          v-for="{ resource, count } in inputResources"
          :key="resource.type"
          alignSelf="center"
          :resource="resource"
          :displayNumber="`${count}`"
        />
      </FlexboxLayout>
      <!-- Output -->
      <Resource
        v-for="{ resource, count } in outputResources"
        :key="resource.type"
        :col="isLarge ? 2 : 0"
        row="0"
        rowSpan="3"
        :colSpan="isLarge ? 1 : 5"
        :resource="resource"
        :displayNumber="count > 1 ? `${count}` : null"
      />
      <!-- Chain input -->
      <FlexboxLayout
        v-if="card.productionConfig.chainInput && isLarge"
        col="3"
        colSpan="2"
        row="0"
        rowSpan="3"
        flexDirection="column"
        justifyContent="space-around"
      >
        <Resource
          v-for="{ resource, count } in chainInputResources"
          :key="resource.type"
          alignSelf="center"
          :resource="resource"
          :displayNumber="`${count}`"
        />
      </FlexboxLayout>
      <!-- Arrows -->
      <FlexboxLayout
        v-if="isLarge"
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
    <!-- Separator -->
    <Label
      v-if="isLarge"
      col="1"
      row="1"
      text=""
      class="separator"
      :class="[`base-bg-${card.resource.type}`]"
    />
    <!-- Right container with card details -->
    <FlexboxLayout
      v-if="isLarge"
      col="2"
      row="0"
      alignContent="center"
      justifyContent="space-around"
      class="attribute-container"
    >
      <GameIconImage
        src="~/assets/images/icons/points.png"
        :displayNumber="card.points"
      />
      <GameIconImage
        src="~/assets/images/icons/money.png"
        :displayNumber="card.cost"
      />
    </FlexboxLayout>
    <Image v-if="isLarge" col="2" row="1" :src="factorySrc" />
    <FlexboxLayout
      v-if="isLarge"
      col="2"
      row="1"
      flexDirection="column-reverse"
      class="attribute-container"
    >
      <Resource :resource="card.resource" alignSelf="flex-end" />
    </FlexboxLayout>
    <FlexboxLayout v-if="isActionable" class="sheen">
      <Label text="" class="sheen-high" />
      <Label text="" class="sheen-low" />
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import GameIconImage from "../reusable/GameIconImage.vue";
import Resource from "../reusable/Resource.vue";
import { Card } from "../../../game/types";
import { aggregateResources } from "../../../game/utils";
import { cardImageRecords } from "../../../game/cards";

export enum Size {
  Small = "small",
  Large = "large",
}

export enum CardActions {
  Reserve = "reserve",
  Discard = "discard",
}

export default {
  props: {
    card: {
      type: Object as () => Card,
      required: true,
    },
    size: {
      type: String as () => Size,
      required: false,
      default: Size.Large,
    },
    isPlayable: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDiscardable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { GameIconImage, Resource },
  computed: {
    isLarge(): boolean {
      return this.size === Size.Large;
    },
    isActionable(): boolean {
      return this.isPlayable || this.isDiscardable;
    },
    inputResources() {
      return aggregateResources(this.card.productionConfig?.input);
    },
    outputResources() {
      return aggregateResources(this.card.productionConfig?.output);
    },
    chainInputResources() {
      return aggregateResources(this.card.productionConfig?.chainInput);
    },
    factorySrc() {
      return cardImageRecords[this.card.type];
    },
  },
  methods: {
    contextualAction(): void {
      if (this.isPlayable) this.$emit(CardActions.Reserve);
      if (this.isDiscardable) this.$emit(CardActions.Discard);
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
  border-radius: 5px;
  border-width: 5px;
  android-elevation: 5;
}

.actionable {
  opacity: 1;
  android-elevation: 10;
}

.disabled {
  opacity: 0.8;
  android-elevation: 1;
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
  font-size: 18px;
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

@keyframes swipe {
  0% {
    transform: scale(4) translateX(-50%) translateY(50%) rotate(-40deg);
  }
  10%,
  100% {
    transform: translateX(60%) translateY(-60%) rotate(-40deg);
  }
}

.sheen {
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-name: swipe;
  animation-duration: 10s;
  animation-timing-function: ease-in;
  opacity: 0.2;
}
.sheen-high {
  background-color: white;
  height: 100%;
  width: 10%;
}
.sheen-low {
  background-color: grey;
  height: 100%;
  width: 10%;
}
</style>
