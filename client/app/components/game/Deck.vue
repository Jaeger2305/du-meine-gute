<template>
  <Button
    :text="`draw (${cardsInDeck.length})`"
    :isEnabled="isDrawCardPossible"
    @tap="drawCard"
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { isActionAvailable } from "../../game/utils";
import { GameState, PlayerState, PlayerActionEnum } from "../../game/types";

export default Vue.extend({
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    availableActions: {
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    cardsInDeck: {
      type: Object as PropType<GameState["cardsInDeck"]>,
      required: true,
    },
  },
  computed: {
    isDrawCardPossible(): boolean {
      return isActionAvailable(
        this.availableActions,
        PlayerActionEnum.drawCard
      );
    },
  },
  methods: {
    drawCard() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.drawCard);
    },
  },
});
</script>

<style scoped></style>
