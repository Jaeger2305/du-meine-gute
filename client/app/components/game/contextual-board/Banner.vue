<template>
  <Frame id="banner">
    <Page actionBarHidden="true" class="cover-image">
      <component v-if="componentName" v-on="$listeners" :is="componentName" />
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Discard from "./Discard.vue";
import Draw from "./Draw.vue";
import Placeholder from "./Placeholder.vue";
import { RoundSteps, ServerActionEnum } from "../../../game/types";

export enum ContextBoardComponentName {
  Draw = "Draw",
  Discard = "Discard",
  Placeholder = "Placeholder", // For banners that haven't been implemened yet - they still need a way to end the turn.
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
  [ServerActionEnum.revealMarket]: ContextBoardComponentName.Placeholder,
  [ServerActionEnum.assignWorkers]: ContextBoardComponentName.Placeholder,
  [ServerActionEnum.produceStep]: ContextBoardComponentName.Placeholder,
  [ServerActionEnum.purchaseStep]: ContextBoardComponentName.Placeholder,
  [ServerActionEnum.endRound]: ContextBoardComponentName.Placeholder,
};

export default {
  props: {},
  components: { Discard, Draw, Placeholder },
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
