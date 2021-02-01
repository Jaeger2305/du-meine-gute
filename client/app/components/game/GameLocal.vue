<template>
  <Page actionBarHidden="true">
    <RadSideDrawer
      ref="drawer"
      :gesturesEnabled="false"
      :drawerLocation="drawerLocation"
      :drawerContentSize="activeDrawerConfig.size"
    >
      <StackLayout
        ~drawerContent
        @swipe="close"
        style="background-color: transparent"
      >
        <Banner
          v-if="drawerLocation === 'Top'"
          @player-action="playerAction"
          @swipe="close"
        />
        <MessageHistory v-if="drawerLocation === 'Left'" @close="close" />
        <StatSummary v-if="drawerLocation === 'Right'" />
      </StackLayout>
      <!-- The overall grid -->
      <!-- | ---------- cards in play ---------- | -->
      <!-- | --------------- hand -------------- | -->
      <GridLayout ~mainContent columns="5*, *" rows="7*, 2*" @swipe="swipe">
        <Image
          colSpan="2"
          rowSpan="2"
          src="~/assets/images/grass.png"
          stretch="fill"
        />
        <Factories
          colSpan="2"
          :factories="$store.state.playerState.cardsInPlay"
          :assignedEmployees="$store.state.playerState.assignedEmployees"
          @player-action="playerAction"
        />

        <!-- Bottom panel -->
        <Image
          colSpan="2"
          row="1"
          src="~/assets/images/backboard.png"
          stretch="aspectFill"
        />
        <!-- Grass border -->
        <GridLayout
          columns="*,*"
          rows="22*, 47*, 9*, 17*"
          column="0"
          colSpan="2"
          row="0"
          rowSpan="2"
        >
          <Image
            row="2"
            src="~/assets/images/grass-separator.png"
            stretch="fill"
          />
          <Image
            col="1"
            row="2"
            src="~/assets/images/grass-separator.png"
            stretch="fill"
          />
        </GridLayout>
        <!-- Player hand -->
        <PlayerHand
          column="0"
          colSpan="2"
          row="1"
          :cards="$store.state.playerState.cardsInHand"
          :availableActions="$store.state.playerState.availableActions"
          @player-action="playerAction"
        />
        <transition name="bounce" appear mode="out-in">
          <Notification
            v-if="
              activeNotification &&
                $store.state.gameState.config.isTutorialEnabled
            "
            col="0"
            row="0"
            colSpan="2"
            rowSpan="2"
            :header="activeNotification.header"
            :messages="activeNotification.messages"
            :isDismissable="true"
            size="large"
            class="notification-modal"
            @close="activeNotification = null"
          />
        </transition>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import orientation from "nativescript-orientation";
import { MutationEnum, ActionEnum, GettersEnum } from "../../store";
import GameSummary from "./modals/GameSummary.vue";

import { PlayerActionEnum } from "../../game/types";
import { RoundSteps } from "../../game/server-action";
import {
  SwipeGestureEventData,
  SwipeDirection,
} from "@nativescript/core/ui/gestures";
import { SideDrawerLocation } from "nativescript-ui-sidedrawer";
import MessageHistory from "./left-drawer/MessageHistory.vue";
import StatSummary from "./right-drawer/StatSummary.vue";
import NotificationComponent from "./reusable/Notification.vue";
import { notificationConfig, Notification } from "../../game/round-description";
import { LogLevel } from "../../game/server-action/types";

type SideDrawerConfig = {
  bubbleSwipes: Array<SwipeDirection>;
  closingDirection: SwipeDirection;
  size: number;
};
const drawerConfig: { [key in SideDrawerLocation]: SideDrawerConfig } = {
  [SideDrawerLocation.Right]: {
    bubbleSwipes: [SwipeDirection.down],
    closingDirection: SwipeDirection.right,
    size: 300,
  },
  [SideDrawerLocation.Left]: {
    bubbleSwipes: [SwipeDirection.down],
    closingDirection: SwipeDirection.left,
    size: 300,
  },
  [SideDrawerLocation.Top]: {
    bubbleSwipes: [SwipeDirection.right, SwipeDirection.left],
    closingDirection: SwipeDirection.up,
    size: 150,
  },
  [SideDrawerLocation.Bottom]: {
    bubbleSwipes: [],
    closingDirection: SwipeDirection.down,
    size: 0,
  },
};

export default {
  components: {
    Notification: NotificationComponent,
    MessageHistory,
    StatSummary,
  },
  data(): {
    drawerLocation: SideDrawerLocation;
    activeNotification: Notification | null;
  } {
    return {
      drawerLocation: SideDrawerLocation.Top,
      activeNotification:
        notificationConfig[RoundSteps[this.$store.state.gameState.activeStep]],
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
      this.activeNotification =
        notificationConfig[RoundSteps[this.$store.state.gameState.activeStep]];
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
    async playerAction(
      type: PlayerActionEnum,
      logLevel: LogLevel,
      payload: any
    ) {
      await this.$store.dispatch(ActionEnum.PlayerAction, {
        type,
        logLevel,
        payload,
      });

      const isBannerActionAvailable = this.$store.getters[
        GettersEnum.getDynamicActions
      ].length;

      const isDynamicActionAvailable = this.$store.getters[
        GettersEnum.getDynamicActions
      ].length;

      if (isDynamicActionAvailable) {
        this.$nextTick(() => this.$refs.drawer.closeDrawer());
      } else if (isBannerActionAvailable) {
        this.$nextTick(() => this.$refs.drawer.showDrawer());
      }
    },
    async endGameSummary(winner) {
      await this.$showModal(GameSummary, {
        animated: true,
        fullscreen: true,
        props: { winner },
      });
      this.$navigateBack({ frame: "base" });
    },
    close({ direction }: SwipeGestureEventData) {
      if (direction === this.activeDrawerConfig.closingDirection)
        this.$refs.drawer.closeDrawer();

      // If we're looking at the top drawer, allow quick access to the
      if (this.activeDrawerConfig.bubbleSwipes.includes(direction))
        this.swipe({ direction } as SwipeGestureEventData);
    },
    /** Capture swipe data manually for the Rad Drawer
     * Default gestures can't handle different positions.
     * It's not great, because the default gesture handling also allows clicking on the non-drawer for dismissal, and other niceties.
     * But it is simple for now.
     */
    swipe({ direction }: SwipeGestureEventData) {
      if (direction === SwipeDirection.left) {
        this.drawerLocation = SideDrawerLocation.Right;
      } else if (direction === SwipeDirection.right) {
        this.drawerLocation = SideDrawerLocation.Left;
      } else if (direction === SwipeDirection.down) {
        this.drawerLocation = SideDrawerLocation.Top;
      }
      this.$nextTick(() => this.$refs.drawer.showDrawer());
    },
  },
};
</script>

<style scoped>
.notification-modal {
  margin: 10%;
}

.bounce-enter-active {
  animation-name: bounce-in;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.bounce-leave-active {
  animation-name: bounce-in;
  animation-duration: 0.25s;
  animation-fill-mode: forwards;
  animation-direction: reverse;
  animation-timing-function: ease-in-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
