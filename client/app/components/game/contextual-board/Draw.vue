<template>
  <Page actionBarHidden="true" class="cover-image">
    <GridLayout columns="*,2*,*" rows="*" class="grid-container">
      <Notification class="grid-item" header="Draw" />
      <Card column="1" :resourceType="'wood'" />
      <FlexboxLayout
        column="2"
        class="grid-item"
        alignItems="stretch"
        justifyContent="center"
        flexDirection="column"
      >
        <Button v-if="isDrawCardPossible" class="button" @tap="drawCard"
          >DRAW</Button
        >
        <Button class="button" @tap="endStep">END</Button>
      </FlexboxLayout>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerActionEnum } from "../../../game/client";
import { ActionEnum } from "../../../store";
import Draw from "./Draw.vue";
import { isActionAvailable } from "../../../game/utils";
import Notification from "../reusable/Notification.vue";
import Card from "../cards/Card.vue";

export default {
  props: {},
  components: { Notification, Card },
  computed: {
    isDrawCardPossible(): boolean {
      return isActionAvailable(
        this.$store.state.playerState.availableActions,
        PlayerActionEnum.drawCard
      );
    },
  },
  methods: {
    endStep() {
      this.$store.dispatch(ActionEnum.PlayerAction, {
        type: PlayerActionEnum.endStep,
        payload: null,
      });
      this.$navigateTo(Draw, {
        frame: "banner",
      });
    },
    drawCard() {
      this.$store.dispatch(ActionEnum.PlayerAction, {
        type: PlayerActionEnum.drawCard,
        payload: null,
      });
    },
  },
};
</script>

<style scoped>
.cover-image {
  background-image: url("~/assets/images/backboard.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}

.button {
  font-family: "Grandstander", "Grandstander-Regular";
  font-size: 30px;
  border-width: 7px;
  border-color: lightblue;
  border-radius: 7px;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgba(188, 209, 215, 1) 0%,
    rgba(211, 229, 235, 1) 25%,
    rgba(211, 229, 235, 1) 75%,
    rgba(237, 246, 249, 1) 100%
  );
  margin: 5px 0px 5px 0px;
}

.button:highlighted {
  border-color: #8ebccc;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgb(209, 225, 230) 0%,
    rgb(227, 240, 245) 25%,
    rgb(227, 242, 247) 75%,
    rgb(250, 254, 255) 100%
  );
}
</style>
