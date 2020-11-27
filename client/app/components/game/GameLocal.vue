<template>
  <Page actionBarHidden="true">
    <RadSideDrawer
      ref="drawer"
      :gesturesEnabled="false"
      :drawerLocation="drawerLocation"
      :drawerContentSize="activeDrawerConfig.size"
    >
      <StackLayout ~drawerContent @swipe="close">
        <Banner v-if="drawerLocation === 'Top'" @player-action="playerAction" />
        <Button v-if="drawerLocation === 'Left'" :text="'LEFT'" />
        <Button v-if="drawerLocation === 'Right'" :text="'RIGHT'" />
      </StackLayout>
      <!-- The overall grid -->
      <!-- | rsrc | --------------------history------------------ | sett | -->
      <!-- | mrkt | -----card--------card--------card------------ | actn | -->
      <!-- | deck | -----card--card--card--card--card--card------ | disc | -->
      <GridLayout
        ~mainContent
        columns="*, 4*, *"
        rows="3*, 4*, 2*"
        backgroundColor="#3c495e"
        @swipe="swipe"
      >
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

        <!-- Bottom panel -->
        <Label column="0" colSpan="3" row="2" class="bottom-panel" />
        <!-- Grass border -->
        <GridLayout
          columns="*"
          rows="22*, 47*, 9*, 17*"
          column="0"
          colSpan="3"
          row="0"
          rowSpan="3"
        >
          <Label column="0" row="2" class="grass-separator" />
        </GridLayout>
        <!-- Player hand -->
        <PlayerHand
          column="0"
          colSpan="3"
          row="2"
          :cards="$store.state.playerState.cardsInHand"
          :availableActions="$store.state.playerState.availableActions"
          @player-action="playerAction"
        />
      </GridLayout>
    </RadSideDrawer>
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
import {
  SwipeGestureEventData,
  SwipeDirection,
} from "tns-core-modules/ui/gestures";
import { SideDrawerLocation } from "nativescript-ui-sidedrawer";

type SideDrawerConfig = { closingDirection: SwipeDirection; size: number };
const drawerConfig: { [key in SideDrawerLocation]: SideDrawerConfig } = {
  [SideDrawerLocation.Right]: {
    closingDirection: SwipeDirection.right,
    size: 300,
  },
  [SideDrawerLocation.Left]: {
    closingDirection: SwipeDirection.left,
    size: 300,
  },
  [SideDrawerLocation.Top]: {
    closingDirection: SwipeDirection.up,
    size: 150,
  },
  [SideDrawerLocation.Bottom]: {
    closingDirection: SwipeDirection.down,
    size: 0,
  },
};

export default {
  data() {
    return {
      drawerLocation: SideDrawerLocation.Top,
    };
  },
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
  computed: {
    activeDrawerConfig(): SideDrawerConfig {
      return drawerConfig[this.drawerLocation];
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
    close({ direction }: SwipeGestureEventData) {
      if (direction === this.activeDrawerConfig.closingDirection)
        this.$refs.drawer.closeDrawer();
    },
    /** Capture swipe data manually for the Rad Drawer
     * Default gestures can't handle different positions.
     * It's not great, because the default gesture handling also allows clicking on the non-drawer for dismissal, and other niceties.
     * But it is simple for now.
     */
    swipe({ direction }: SwipeGestureEventData) {
      if (direction === SwipeDirection.left) {
        this.drawerLocation = SideDrawerLocation.Right;
        this.$nextTick(() => this.$refs.drawer.showDrawer());
      } else if (direction === SwipeDirection.right) {
        this.drawerLocation = SideDrawerLocation.Left;
        this.$nextTick(() => this.$refs.drawer.showDrawer());
      } else if (direction === SwipeDirection.down) {
        this.drawerLocation = SideDrawerLocation.Top;
        this.$nextTick(() => this.$refs.drawer.showDrawer());
      }
    },
  },
};
</script>

<style scoped>
.bottom-panel {
  background-image: url("~/assets/images/backboard.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.grass-separator {
  width: 100%;
  height: 150px;
  background-image: url("~/assets/images/grass-separator.png");
  background-position: center;
  background-repeat: repeat-x;
}
</style>
