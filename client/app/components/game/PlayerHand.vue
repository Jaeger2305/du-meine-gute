<template>
  <FlexboxLayout justifyContent="space-around" class="container">
    <Card
      v-for="card in cards"
      :key="card.name"
      :card="card"
      :is-enabled="isReserveFactoryPossible"
      size="small"
      @click="reserveFactory(card)"
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

<style scoped>
.container {
  padding: 15px;
}
</style>
