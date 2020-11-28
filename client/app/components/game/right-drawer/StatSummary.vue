<template>
  <GridLayout columns="*, *" rows="*, *, 2*">
    <Image
      colSpan="2"
      rowSpan="3"
      src="~/assets/images/sideboard/sideboard.png"
      stretch="fill"
    />
    <PlayerStats
      col="0"
      row="0"
      rowSpan="2"
      class="grid-item"
      :cardBoost="cardBoost"
      :marketBoost="marketBoostResources"
      :points="points"
    />
    <DeckInfo
      col="1"
      row="0"
      class="grid-item"
      :deckCount="$store.state.gameState.cardsInDeck.length"
      :discardCount="$store.state.gameState.cardsInDiscard.length"
    />
    <GameConfig
      col="1"
      row="1"
      class="grid-item"
      v-bind="$store.state.gameState.config"
      :playerCount="$store.state.gameState.players.length"
    />
    <SecondaryResourceCollection
      col="0"
      row="2"
      colSpan="2"
      class="grid-item"
      :resources="$store.state.playerState.resources"
      :isFiltered="true"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import PlayerStats from "./PlayerStats.vue";
import DeckInfo from "./DeckInfo.vue";
import GameConfig from "./GameConfig.vue";
import SecondaryResourceCollection from "./SecondaryResourceCollection.vue";
import { sum } from "lodash";
import { Resource } from "../../../game/resources";

export default {
  components: {
    PlayerStats,
    DeckInfo,
    GameConfig,
    SecondaryResourceCollection,
  },
  props: {},
  computed: {
    marketBoostResources(): Array<Resource> {
      return this.$store.state.playerState.cardsInPlay
        .flatMap((card) => card.marketBoost)
        .filter(Boolean);
    },
    cardBoost(): number {
      return sum(
        this.$store.state.playerState.cardsInPlay
          .map((card) => card.boostDrawCount)
          .filter(Boolean)
      );
    },
    points(): number {
      return sum(
        this.$store.state.playerState.cardsInPlay
          .map((card) => card.points)
          .filter(Boolean)
      );
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.grid-item {
  margin: 15px;
}
</style>
