<template>
  <Frame id="banner">
    <Page actionBarHidden="true" class="cover-image">
      <component v-if="componentName" v-on="$listeners" :is="componentName" />
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import bannerComponents from "./index";
import { RoundSteps, ServerActionEnum } from "../../../game/types";

export enum ContextBoardComponentName {
  Draw = "Draw",
  Discard = "Discard",
  RevealMarket = "RevealMarket",
  Planning = "Planning",
  Production = "Production",
  EndRound = "EndRound",
  PurchasingStep = "PurchasingStep",
}

/** Map the server steps to a given contextual banner
 * It would be better if this were a Record<ServerActionEnum, ContextBoardComponentName>
 * But the server actions are muddled with the round steps, so this is a compromise for speed.
 */
const contextBoardRoundStepMap: {
  [key in ServerActionEnum]?: ContextBoardComponentName;
} = {
  [ServerActionEnum.startRound]: ContextBoardComponentName.Discard,
  [ServerActionEnum.drawStep]: ContextBoardComponentName.Draw,
  [ServerActionEnum.revealMarket]: ContextBoardComponentName.RevealMarket,
  [ServerActionEnum.assignWorkers]: ContextBoardComponentName.Planning,
  [ServerActionEnum.produceStep]: ContextBoardComponentName.Production,
  [ServerActionEnum.purchaseStep]: ContextBoardComponentName.PurchasingStep,
  [ServerActionEnum.endRound]: ContextBoardComponentName.EndRound,
};

export default {
  props: {},
  components: { ...bannerComponents },
  computed: {
    componentName(): ContextBoardComponentName {
      return contextBoardRoundStepMap[
        RoundSteps[this.$store.state.gameState.activeStep]
      ];
    },
  },
  methods: {},
};
</script>

<style scoped>
.cover-image {
  background-image: url("~/assets/images/backboard.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
