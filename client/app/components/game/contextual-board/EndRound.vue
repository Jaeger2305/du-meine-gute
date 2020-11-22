<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification class="grid-item" header="Production" />
    <NotificationMessageContainer
      class="grid-item"
      column="1"
      :messages="[
        {
          content:
            'When a player reaches 8 factories, the end game is triggered',
        },
        {
          content: '1 point for every 5 resource value',
        },
        {
          content: 'Points for built factories',
        },
        {
          content: 'Points for hired employees',
        },
      ]"
    />
    <FlexboxLayout
      column="2"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
    >
      <Button class="button" @tap="endStep">END</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import NotificationMessageContainer from "../reusable/NotificationMessageContainer.vue";
import { CustomEvents } from "../../../types";

export default {
  props: {},
  components: { Notification, NotificationMessageContainer },
  methods: {
    endStep() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep, null);
    },
  },
};
</script>

<style scoped>
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
