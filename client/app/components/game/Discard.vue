<template>
  <Button
    :text="`discard (${cardsInDiscard.length})`"
    :isEnabled="isEndStepPossible"
    @tap="endStep"
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { isActionAvailable } from "../../game/utils";
import { GameState, PlayerState, PlayerActionEnum } from "../../game/types";
import DiscardSelection from "./DiscardSelection.vue";

export default Vue.extend({
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    availableActions: {
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    cardsInDiscard: {
      type: Object as PropType<GameState["cardsInDiscard"]>,
      required: true,
    },
    cardsInHand: {
      type: Object as PropType<PlayerState["cardsInHand"]>,
      required: true,
    },
  },
  computed: {
    isEndStepPossible(): boolean {
      return isActionAvailable(this.availableActions, PlayerActionEnum.endStep);
    },
    isDiscardPossible(): boolean {
      return isActionAvailable(this.availableActions, PlayerActionEnum.discard);
    },
  },
  methods: {
    async endStep() {
      if (this.isDiscardPossible) {
        const cardsToDiscard = await this.$showModal(DiscardSelection, {
          props: { cards: this.cardsInHand },
        });
        if (cardsToDiscard) {
          this.$emit(
            CustomEvents.PLAYER_ACTION,
            PlayerActionEnum.discard,
            cardsToDiscard
          );
        }
      }
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep);
    },
  },
});
</script>

<style scoped></style>
