<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification class="grid-item" header="Production" />
    <NotificationMessageContainer
      class="grid-item"
      column="1"
      :messages="[
        {
          content:
            'Pick a factory where an employee is assigned and use the market resources',
        },
        {
          content: 'Keep going until you can afford no more!',
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
      <Button class="button" @tap="endStep">{{ $t("action.end") }}</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import NotificationMessageContainer from "../reusable/NotificationMessageContainer.vue";
import { CustomEvents } from "../../../types";
import { LogLevel } from "../../../game/server-action/types";

export default {
  props: {},
  components: { Notification, NotificationMessageContainer },
  methods: {
    endStep() {
      this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.endStep,
        LogLevel.Debug,
        null
      );
    },
  },
};
</script>

<style scoped>
.button {
  color: black;
}
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}
</style>
