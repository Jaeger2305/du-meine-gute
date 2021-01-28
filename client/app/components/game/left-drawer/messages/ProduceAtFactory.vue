<template>
  <BaseMessage v-bind="$props">
    <Label :textWrap="true">
      <FormattedString>
        <Span text="Produced " />
        <Span
          :text="$t(eventDetails.producedResources.length)"
          fontWeight="bold"
        />
        <Span text=" resources at " />
        <Span
          :text="$t(`factory.${eventDetails.factory.type}`)"
          fontWeight="bold"
        />
      </FormattedString>
    </Label>
    <template v-slot:icon>
      <Image src="~/assets/images/resources/generic.png" />
    </template>
  </BaseMessage>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseMessage from "./BaseMessage.vue";
import { EventSource, EventType } from "../../../../game/types";
import { ProduceAtFactoryResponse } from "../../../../game/server-action/types";

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
      type: Object as PropType<ProduceAtFactoryResponse["response"]>,
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
