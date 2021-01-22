<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification
      column="0"
      row="0"
      class="grid-item"
      :header="isFirstMarket ? 'Market opens' : 'Market closes'"
    />
    <PrimaryResourceCollection
      column="1"
      row="0"
      :resources="marketResources"
      :isAggregated="true"
      class="market-resources"
    />
    <FlexboxLayout
      column="2"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
    >
      <Button class="button" @tap="endStep">END</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import PrimaryResourceCollection from "../reusable/PrimaryResourceCollection.vue";
import { RoundSteps, ServerActionEnum } from "../../../game/types";
import { Resource } from "../../../game/resources";
import { CustomEvents } from "../../../types";
import { LogLevel } from "../../../game/server-action/types";

export default {
  props: {},
  components: { Notification, PrimaryResourceCollection },
  computed: {
    isFirstMarket(): boolean {
      return (
        RoundSteps.indexOf(ServerActionEnum.revealMarket) ===
        this.$store.state.gameState.activeStep
      );
    },
    marketResources(): Array<Resource> {
      return this.$store.state.gameState.marketCards.map(
        ({ resource }) => resource
      );
    },
  },
  methods: {
    endStep() {
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.endStep,
        LogLevel.Debug,
        null
      );
    },
  },
};
</script>

<style scoped>
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}

.market-resources {
  margin: 25px 10% 25px 10%;
}
</style>
