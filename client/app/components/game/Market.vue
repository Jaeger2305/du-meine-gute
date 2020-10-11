<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Label textWrap>
      <Span>Metal: {{ metalCount }}</Span>
      <Span>Clay: {{ clayCount }}</Span>
      <Span>Wood: {{ woodCount }}</Span>
      <Span>Wheat: {{ wheatCount }}</Span>
      <Span>Cloth: {{ woolCount }}</Span>
    </Label>
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { GameState } from "../../game/types";
import { ResourceType } from "../../game/resources";

export default Vue.extend({
  props: {
    cards: {
      type: Object as PropType<GameState["marketCards"]>,
      required: true,
    },
  },
  computed: {
    metalCount(): number {
      return this.cards.filter(
        (card) => card.resource.type === ResourceType.metal
      ).length;
    },
    wheatCount(): number {
      return this.cards.filter(
        (card) => card.resource.type === ResourceType.wheat
      ).length;
    },
    woodCount(): number {
      return this.cards.filter(
        (card) => card.resource.type === ResourceType.wood
      ).length;
    },
    clayCount(): number {
      return this.cards.filter(
        (card) => card.resource.type === ResourceType.clay
      ).length;
    },
    woolCount(): number {
      return this.cards.filter(
        (card) => card.resource.type === ResourceType.wool
      ).length;
    },
  },
});
</script>

<style scoped></style>
