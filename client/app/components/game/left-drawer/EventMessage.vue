<template>
  <GridLayout columns="*, *, 5*" rows="80px" class="event-container">
    <Image
      col="1"
      row="0"
      colSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
      class="event-message"
    />
    <Label
      col="1"
      row="0"
      colSpan="2"
      :text="message"
      :textWrap="true"
      class="event-message"
    />
    <!-- Paint the icon over the top -->
    <EventIcon
      col="0"
      row="0"
      colSpan="2"
      :eventSource="eventSource"
      :eventType="eventType"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import EventIcon from "./EventIcon.vue";
import { EventSource, EventType } from "../../../game/types";

export default {
  components: { EventIcon },
  props: {
    eventType: {
      type: String as PropType<EventType>,
      required: true,
    },
    eventSource: {
      type: String as PropType<EventSource>,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.event-icon {
  width: 100%;
  height: 100%;
  background: blue;
  border-radius: 5%;
  border-width: 10px;
}

.event-message {
  padding-left: 90px;
  margin: 20px;
  font-size: 16px;
  font-family: "Grandstander", "Grandstander-Regular";
  text-align: center;
}
</style>
