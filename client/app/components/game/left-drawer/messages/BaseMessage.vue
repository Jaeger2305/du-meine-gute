<template>
  <GridLayout columns="*, *, 5*" rows="80px" class="event-container">
    <Image
      col="1"
      row="0"
      colSpan="2"
      src="~/assets/images/sideboard/paper.png"
      stretch="fill"
      class="event-message-container"
    />
    <StackLayout col="1" row="0" colSpan="2" class="event-message">
      <slot> </slot>
    </StackLayout>
    <!-- Paint the icon over the top -->
    <StackLayout
      v-if="isIconShown"
      colSpan="2"
      :class="[
        'event-icon-container',
        `lowlight-outline-${eventSource}`,
        `highlight-bg-${eventSource}`,
      ]"
    >
      <slot name="icon"></slot>
    </StackLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { EventSource, EventType } from "../../../../game/types";

export default {
  props: {
    isIconShown: {
      type: Boolean,
      required: false,
      default: true,
    },
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
.event-icon-container {
  width: 100%;
  height: 100%;
  border-radius: 5%;
  border-width: 10px;
}

.event-message-container {
  margin: 20px;
  padding-left: 90px;
}

.event-message {
  margin: 10px 25px 10px 80px;
  font-size: 16px;
  font-family: "Grandstander", "Grandstander-Regular";
  text-align: center;
}
</style>
