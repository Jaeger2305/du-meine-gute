<template>
  <FlexboxLayout justifyContent="space-around" class="container">
    <Card
      v-for="card in cards"
      :key="card.name"
      :card="card"
      :isPlayable="isReserveFactoryPossible"
      :isDiscardable="isDiscardPossible"
      size="small"
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
import { GameState, PlayerState } from "../../game/types";
import CardComponent from "./cards/Card.vue";
import { MutationEnum } from "../../store";

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
        factory
      );
    },
    discard(card) {
      // Maybe there's refactoring here, when we allow discarding a card for its resource as part of production
      this.$store.commit(MutationEnum.StageCardDiscard, card);
      this.$emit(CustomEvents.DISCARD_CARD, card);
    },
  },
});
</script>

<style scoped>
.container {
  padding: 15px;
}
</style>
