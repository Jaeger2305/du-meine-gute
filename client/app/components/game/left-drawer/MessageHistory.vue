<template>
  <GridLayout columns="*" rows="*">
    <Image
      src="~/assets/images/sideboard/sideboard.png"
      stretch="fill"
      class="container-bg"
    />
    <ScrollView class="container">
      <StackLayout @swipe="($event) => $emit('close', $event)">
        <EventMessage
          v-for="{ message, eventType, eventSource } in drawerMessages"
          :key="message"
          :message="message"
          :eventType="eventType"
          :eventSource="eventSource"
          style="margin: 5 25 5 20;"
        />
      </StackLayout>
    </ScrollView>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import EventMessageComponent from "./EventMessage.vue";
import { EventMessage } from "../../../game/types";

export default {
  components: {
    EventMessage: EventMessageComponent,
  },
  props: {
    drawerMessages: {
      type: Array as PropType<Array<EventMessage>>,
      required: true,
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
