<template>
  <BaseMessage v-bind="$props">
    <Label :textWrap="true" class="event-message">
      <FormattedString>
        <Span text="Market added " />
        <Span :text="eventDetails.drawnCards.length" fontWeight="bold" />
        <Span text=" resources" />
      </FormattedString>
    </Label>
    <template v-slot:icon>
      <Image src="~/assets/images/icons/suns.png" />
    </template>
  </BaseMessage>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseMessage from "./BaseMessage.vue";
import { EventSource, EventType } from "../../../../game/types";
import { RevealMarketResponse } from "../../../../game/server-action/types";

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
      type: Object as PropType<RevealMarketResponse["response"]>,
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
