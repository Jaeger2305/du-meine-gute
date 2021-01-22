<template>
  <GridLayout columns="*" rows="*">
    <Image
      src="~/assets/images/sideboard/sideboard.png"
      stretch="fill"
      class="container-bg"
    />
    <StackLayout @swipe="($event) => $emit('close', $event)">
      <component
        :is="eventType"
        v-for="{
          message,
          eventType,
          eventSource,
          eventDetails,
        } in drawerMessages"
        :key="message"
        :message="message"
        :eventType="eventType"
        :eventSource="eventSource"
        :eventDetails="eventDetails"
        style="margin: 5 25 5 20;"
      />
    </StackLayout>
  </GridLayout>
</template>

<script lang="ts">
import MessageComponents from "./messages";
import { EventMessage } from "../../../game/types";
import { LogLevel } from "../../../game/server-action/types";

export default {
  components: { ...MessageComponents },
  computed: {
    drawerMessages(): Array<EventMessage> {
      return this.$store.state.messages
        .filter(({ logLevel }) => logLevel >= LogLevel.Visible) // Remove
        .slice(-6)
        .reverse();
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}
.container-bg {
  transform: rotate(180deg);
}
</style>
