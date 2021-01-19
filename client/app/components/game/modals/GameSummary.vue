<template>
  <Frame id="game-summary">
    <Page>
      <ActionBar title="winner">
        <ActionItem
          @tap="$modal.close(null)"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <StackLayout>
        <Label :text="`winner: ${winner.name}`" />
        <FlexboxLayout
          v-for="{ points, description } in pointsBreakdown"
          :key="description"
          justifyContent="space-between"
        >
          <Label :text="description" />
          <Label :text="points" />
        </FlexboxLayout>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { GameState } from "../../../game/types";
import { sum } from "lodash";

type PointSummary = {
  points: number;
  description: string;
};

export default {
  props: {
    winner: {
      type: Object as PropType<GameState["winner"]>,
      required: true,
    },
  },
  computed: {
    pointsBreakdown(): Array<PointSummary> {
      const {
        employees,
        cardsInPlay,
        resources,
      } = this.$store.state.playerState;
      const gameState = this.$store.state.gameState;
      const resourcesScore = Math.floor(
        sum(resources.map((resource) => resource.value)) *
          gameState.config.pointsPerResource
      );
      const factoryScore = sum(cardsInPlay.map((card) => card.points));
      const employeeScore = sum(employees.map((employee) => employee.points));

      const total = sum([resourcesScore, factoryScore, employeeScore]);
      return [
        ...cardsInPlay.map(({ points, name }) => ({
          points,
          description: name,
        })),
        ...employees.map(({ points, name }) => ({ points, description: name })),
        { points: resourcesScore, description: "resources" },
        { points: total, description: "total" },
      ];
    },
  },
};
</script>

<style scoped></style>
