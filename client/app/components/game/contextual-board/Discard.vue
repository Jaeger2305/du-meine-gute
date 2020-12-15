<template>
  <GridLayout columns="*,2*,*" rows="*" class="grid-container">
    <Notification class="grid-item" header="Start" />
    <NotificationMessageContainer
      class="grid-item"
      column="1"
      :messages="[
        {
          content: 'Don\'t have the right card?',
        },
        {
          content: 'Discard X and draw the same amount',
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
      <Button v-if="isCardStagedForDiscard" @tap="confirmDiscard" class="button"
        >CONFIRM</Button
      >
      <Button @tap="endStep" class="button">END</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerActionEnum } from "../../../game/client";
import { ActionEnum, MutationEnum } from "../../../store";
import Draw from "./Draw.vue";
import Notification from "../reusable/Notification.vue";
import NotificationMessageContainer from "../reusable/NotificationMessageContainer.vue";
import { CustomEvents } from "../../../types";

export default {
  props: {},
  components: { Notification, NotificationMessageContainer },
  computed: {
    isCardStagedForDiscard(): boolean {
      return this.$store.state.stagedCardsForDiscard.length;
    },
  },
  methods: {
    async confirmDiscard(): Promise<void> {
      await this.$emit(
        CustomEvents.PLAYER_ACTION,
        PlayerActionEnum.discard,
        this.$store.state.stagedCardsForDiscard
      );
      this.$store.commit(MutationEnum.ResetDiscard);
    },
    endStep(): void {
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
</style>
