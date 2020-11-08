<template>
  <Page actionBarHidden="true" class="cover-image">
    <GridLayout columns="*,2*,*" rows="*">
      <Notification header="Start" />
      <NotificationMessageContainer
        column="1"
        style="margin: 15px;"
        :messages="[
          {
            content: 'Don\'t have the right card?',
          },
          {
            content: 'Discard X and draw the same amount',
          },
        ]"
      />
      <Button column="2" @tap="endStep">END</Button>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerActionEnum } from "../../../../../cli/types";
import { ActionEnum } from "../../../store";
import Draw from "./Draw.vue";
import Notification from "../reusable/Notification.vue";
import NotificationMessageContainer from "../reusable/NotificationMessageContainer.vue";

export default {
  props: {},
  components: { Notification, NotificationMessageContainer },
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
</style>
