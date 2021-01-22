<template>
  <BaseMessage v-bind="$props">
    <Label :textWrap="true">
      <FormattedString>
        <Span text="New round started" />
      </FormattedString>
    </Label>
  </BaseMessage>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseMessage from "./BaseMessage.vue";
import { EventSource, EventType } from "../../../../game/types";
import { StartRoundResponse } from "../../../../game/server-action/types";

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
      type: Object as PropType<StartRoundResponse["response"]>,
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
