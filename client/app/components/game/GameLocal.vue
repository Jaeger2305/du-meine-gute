<template>
  <Page actionBarHidden="true">
    <!-- The overall grid -->
    <!-- | rsrc | --------------------history------------------ | sett | -->
    <!-- | mrkt | -----card--------card--------card------------ | actn | -->
    <!-- | deck | -----card--card--card--card--card--card------ | disc | -->
    <GridLayout columns="*, 4*, *" rows="*, *, *" backgroundColor="#3c495e">
      <Banner column="0" colSpan="3" row="0" />

      <!-- Settings -->
      <!-- <Button column="2" row="0" text="ready?" @tap="playerReady" /> -->

      <!-- Event space (e.g. the market) -->
      <!-- For now though, this is available actions -->
      <ScrollView column="1" row="1" orientation="horizontal">
        <StackLayout column="1" orientation="horizontal">
          <Label :text="$store.state.playerState.score" />
          <Assignment
            :availableActions="$store.state.playerState.availableActions"
            :employees="$store.state.playerState.employees"
            :factories="$store.state.playerState.cardsInPlay"
            :assignedEmployees="$store.state.playerState.assignedEmployees"
            @assign-employee="playerAction"
          />
          <ReservedFactory
            v-if="$store.state.playerState.reservedFactory"
            :factory="$store.state.playerState.reservedFactory"
            :resources="$store.state.playerState.resources"
            :availableActions="$store.state.playerState.availableActions"
            @build-factory="$store.state.playerAction"
          />
          <Factories
            :factories="$store.state.playerState.cardsInPlay"
            :assignedEmployees="$store.state.playerState.assignedEmployees"
          />
        </StackLayout>
      </ScrollView>

      <ScrollView column="2" row="1" orientation="vertical">
        <EmployeeList
          column="2"
          row="1"
          :availableActions="$store.state.playerState.availableActions"
          :employees="$store.state.playerState.employees"
          :assignedEmployees="$store.state.playerState.assignedEmployees"
          :availableEmployees="$store.state.gameState.availableEmployees"
          :resources="$store.state.playerState.resources"
          :cardsInPlay="$store.state.playerState.cardsInPlay"
          :cardsInHand="$store.state.playerState.cardsInHand"
          :marketCards="$store.state.gameState.marketCards"
          @produce-at-factory="playerAction"
          @assign-employee="playerAction"
          @unassign-employee="playerAction"
          @hire-employee="playerAction"
        />
      </ScrollView>

      <!-- Player hand -->

      <ScrollView column="1" row="2" orientation="horizontal">
        <StackLayout orientation="horizontal">
          <PlayerHand
            :cards="$store.state.playerState.cardsInHand"
            :availableActions="$store.state.playerState.availableActions"
            @player-action="playerAction"
          />
        </StackLayout>
      </ScrollView>

      <!-- Discard -->
      <Discard
        column="2"
        row="2"
        name="end step"
        :cardsInHand="$store.state.playerState.cardsInHand"
        :cardsInDiscard="$store.state.gameState.cardsInDiscard"
        :availableActions="$store.state.playerState.availableActions"
        @player-action="playerAction"
      />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import orientation from "nativescript-orientation";
import { MutationEnum, ActionEnum } from "../../store";
import Lobby from "../Lobby.vue";
import GameSummary from "./GameSummary.vue";

import { setTimeout, clearTimeout } from "tns-core-modules/timer";
import { PlayerActionEnum } from "../../game/types";
import { RoundSteps } from "../../game/server-action";

export default {
  created() {
    this.$store.commit(MutationEnum.SetupGame);
    orientation.setOrientation("landscape");
  },
  watch: {
    "$store.state.gameState.activeStep"() {
      if (this.$store.state.isLocal) {
        this.$store.dispatch(ActionEnum.SendMessage, {
          type: RoundSteps[this.$store.state.gameState.activeStep],
        });
      }
    },
    "$store.state.gameState.winner"(winner) {
      if (winner) {
        this.endGameSummary(winner);
      }
    },
  },
  methods: {
    async playerAction(type: PlayerActionEnum, payload: any) {
      this.$store.dispatch(ActionEnum.PlayerAction, {
        type,
        payload,
      });
    },
    async endGameSummary(winner) {
      await this.$showModal(GameSummary, { props: { winner } });
      this.$navigateBack({ frame: "base" });
    },
  },
};
</script>

<style scoped></style>
