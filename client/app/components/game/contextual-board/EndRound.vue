<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification class="grid-item" header="End round" />
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
      <Button class="button" @tap="endStep">{{ $t("action.end") }}</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
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
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}
</style>
