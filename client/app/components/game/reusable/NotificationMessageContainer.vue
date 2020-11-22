<template>
  <FlexboxLayout
    class="message-container"
    flexDirection="column"
    justifyContent="center"
  >
    <NotificationMessage
      v-for="message in messages"
      :key="message.content"
      :subheader="message.subheader"
      :content="message.content"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import NotificationMessage, { Message } from "./NotificationMessage.vue";

export default {
  props: {
    messages: {
      type: Array as PropType<Array<Message>>,
      required: true,
    },
  },
  components: { NotificationMessage },
};
</script>

<style scoped>
.message-container {
  background: white;
  border-width: 5px;
  border-color: lightblue;
  border-radius: 10px;
}
</style>
