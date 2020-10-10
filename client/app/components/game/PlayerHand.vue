<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Card
      v-for="card in cards"
      :key="card.name"
      :name="card.name"
      :is-enabled="isReserveFactoryPossible"
      @click="reserveFactory(card)"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../types";
import { PlayerActionEnum } from "../../game/types";
import { isActionAvailable } from "../../game/utils";
import { GameState, PlayerState } from "../../game/types";

export default Vue.extend({
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    availableActions: {
      type: Object as PropType<PlayerState["availableActions"]>,
      required: true,
    },
    cards: {
      type: Object as PropType<PlayerState["cardsInHand"]>,
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
  },
  methods: {
    reserveFactory(factory) {
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.reserveFactory,
        factory
      );
    },
  },
});
</script>

<style scoped></style>
