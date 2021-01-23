<template>
  <Frame id="game-summary">
    <Page actionBarHidden="true">
      <GridLayout columns="2*,*,*,2*" rows="*,3*">
        <Image src="~/assets/images/combined-clouds.png" />
        <Label :text="winner.name" class="bgh1" />
        <Label
          :text="winner.name"
          class="h1"
          textShadow="0 0 10 rgb(88, 120, 164)"
        />
        <Button col="2" colSpan="2" class="button" @tap="$modal.close">{{
          $t("action.backToLobby")
        }}</Button>
        <StackLayout
          v-for="(pointGroup, i) in [
            pointsBreakdown.slice(0, pointsBreakdown.length / 2),
            pointsBreakdown.slice(pointsBreakdown.length / 2 + 1),
          ]"
          :key="i"
          :col="i * 2"
          colSpan="2"
          row="1"
        >
          <FlexboxLayout
            v-for="{ points, imgSrc, description } in pointGroup"
            :key="description"
            justifyContent="space-between"
            style="margin: 20px"
          >
            <GameIconImage :src="imgSrc" />
            <Label :text="description" class="points-title" />
            <GameIconImage
              src="~/assets/images/icons/points.png"
              :displayNumber="points"
            />
          </FlexboxLayout>
        </StackLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { GameState } from "../../../game/types";
import { sum } from "lodash";
import GameIconImage from "../reusable/GameIconImage.vue";

type PointSummary = {
  points: number;
  imgSrc: string;
  description: string;
};

export default {
  components: { GameIconImage },
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
          imgSrc: "~/assets/images/factories/unknown.png",
          description: name,
        })),
        ...employees.map(({ points, name }) => ({
          points,
          imgSrc: "~/assets/images/employees/generic-man.png",
          description: name,
        })),
        {
          points: resourcesScore,
          imgSrc: "~/assets/images/resources/generic.png",
          description: "resources",
        },
        {
          points: total,
          imgSrc: "~/assets/images/icons/points.png",
          description: "total",
        },
      ].filter(({ points }) => points);
    },
  },
};
</script>

<style scoped>
.h1 {
  font-size: 26px;
  color: white;
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
  text-shadow: 2px 2px 0px #ff0000;
}

.bgh1 {
  font-size: 27px;
  color: rgb(88, 120, 164);
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
}

.points-title {
  font-size: 20px;
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  text-align: left;
}
</style>
