<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification class="grid-item" header="Draw" />
    <Card v-if="drawnCard" column="1" :card="drawnCard" />
    <FlexboxLayout
      column="2"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
    >
      <Button v-if="isDrawCardPossible" class="button" @tap="drawCard">{{
        $t("action.draw")
      }}</Button>
      <Button class="button" @tap="endStep">{{ $t("action.end") }}</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import { PlayerActionEnum } from "../../../game/client";
import { isActionAvailable, createUnknownCard } from "../../../game/utils";
import Notification from "../reusable/Notification.vue";
import CardComponent from "../cards/Card.vue";
import { Card } from "../../../game/types";
import { CustomEvents } from "../../../types";
import { LogLevel } from "../../../game/server-action/types";

export default {
  props: {},
  components: { Notification, Card: CardComponent },
  data(): {
    drawnCard: Card | null;
  } {
    return {
      drawnCard: null,
    };
  },
  computed: {
    isDrawCardPossible(): boolean {
      return isActionAvailable(
        this.$store.state.playerState.availableActions,
        PlayerActionEnum.drawCard
      );
    },
  },
  watch: {
    "$store.state.playerState.cardsInHand"(
      newCards: Array<Card>,
      oldCards: Array<Card>
    ) {
      this.drawnCard = newCards.slice(-1)[0];
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
    drawCard() {
      this.drawnCard = createUnknownCard();
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.drawCard,
        LogLevel.Debug,
        null
      );
    },
  },
};
</script>

<style scoped>
.button {
  color: black;
}
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}
</style>
