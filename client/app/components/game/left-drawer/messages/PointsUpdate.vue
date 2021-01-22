<template>
  <BaseMessage v-bind="$props">
    <Label :textWrap="true">
      <FormattedString>
        <Span text="Current score " />
        <Span :text="eventDetails.score" fontWeight="bold" />
      </FormattedString>
      <FormattedString v-if="eventDetails.winner">
        <Span :text="eventDetails.winner" fontWeight="bold" />
        <Span text=" won the game!" />
      </FormattedString>
      <FormattedString v-else-if="eventDetails.isGameEnding">
        <Span text="Game ends next turn!" />
      </FormattedString>
    </Label>
    <template v-slot:icon>
      <Image src="~/assets/images/icons/points.png" />
    </template>
  </BaseMessage>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseMessage from "./BaseMessage.vue";
import { EventSource, EventType } from "../../../../game/types";
import { EndRoundResponse } from "../../../../game/server-action/types";

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
      type: Object as PropType<EndRoundResponse["response"]>,
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
