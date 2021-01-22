<template>
  <BaseMessage v-bind="$props">
    <Label :textWrap="true">
      <FormattedString v-if="eventDetails && eventDetails.drawnCard">
        <Span text="Drew " />
        <Span :text="eventDetails.drawnCard.name" fontWeight="bold" />
      </FormattedString>
      <FormattedString v-else>
        <Span :text="message" />
      </FormattedString>
    </Label>
    <template v-slot:icon>
      <Image src="~/assets/images/icons/draw-cards.png" />
    </template>
  </BaseMessage>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseMessage from "./BaseMessage.vue";
import { EventSource, EventType } from "../../../../game/types";
import { DrawCardResponse } from "../../../../game/server-action/types";

export default {
  components: { BaseMessage },
  props: {
    eventType: {
      type: String as PropType<EventType>,
      required: true,
    },
    eventSource: {
      type: String as PropType<EventSource>,
      required: true,
    },
    eventDetails: {
      type: Object as PropType<DrawCardResponse["response"]>,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
