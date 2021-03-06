<template>
  <FlexboxLayout justifyContent="space-around" class="container">
    <Card
      v-for="card in cards"
      :key="card.name"
      :card="card"
      :isPlayable="isReserveFactoryPossible"
      :isDiscardable="isDiscardPossible"
      size="small"
      :class="{
        'animated-zoom': isActionable,
        'animated-pulse-opacity': isStagedDiscard(card),
      }"
      @reserve="reserveFactory(card)"
      @discard="discard(card)"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/client";
import { isActionAvailable } from "../../game/utils";
import { PlayerState } from "../../game/types";
import CardComponent from "./cards/Card.vue";
import { MutationEnum } from "../../store";
import { LogLevel } from "../../game/server-action/types";

export default Vue.extend({
  components: { Card: CardComponent },
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    availableActions: {
      type: Array as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    cards: {
      type: Array as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
  },
  computed: {
    isActionable(): boolean {
      return this.isReserveFactoryPossible || this.isDiscardPossible;
    },
    isReserveFactoryPossible(): boolean {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.reserveFactory
      );
    },
    isDiscardPossible(): boolean {
      return isActionAvailable(this.availableActions, PlayerActionEnum.discard);
    },
  },
  methods: {
    reserveFactory(factory) {
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.reserveFactory,
        LogLevel.Debug,
        factory
      );
    },
    discard(card) {
      // Maybe there's refactoring here, when we allow discarding a card for its resource as part of production
      this.$store.commit(MutationEnum.StageCardDiscard, card);
      this.$emit(CustomEvents.DISCARD_CARD, card);
    },
    isStagedDiscard(card: PlayerState["cardsInHand"][0]): boolean {
      return !!this.$store.state.stagedCardsForDiscard.find(
        ({ name }) => card.name === name
      );
    },
  },
});
</script>

<style scoped>
.container {
  padding: 15px;
}

.animated-pulse-opacity {
  animation-name: pulse-opacity;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-direction: normal;
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
}

.animated-zoom {
  animation-iteration-count: 1;
  animation-name: zoomEmphasis;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
</style>
