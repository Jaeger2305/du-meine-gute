<template>
  <GridLayout columns="*" :rows="messages ? '*,*' : '*'">
    <Image col="0" row="0" src="~/assets/images/combined-clouds.png" />

    <shadowed-label col="0" row="0" :text="header" class="bgh1" />
    <shadowed-label
      col="0"
      row="0"
      :text="header"
      class="h1"
      textShadow="0 0 10 rgb(88, 120, 164)"
    />
    <NotificationMessageContainer
      v-if="messages"
      :messages="messages"
      col="1"
      row="1"
      style="margin: 10px;"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import NotificationMessageContainer from "./NotificationMessageContainer.vue";
import { Message } from "./NotificationMessage.vue";

export default {
  props: {
    header: {
      type: String,
      required: true,
    },
    messages: {
      type: Array as PropType<Array<Message>>,
      required: false,
      default: null,
    },
  },
  components: { NotificationMessageContainer },
};
</script>

<style scoped>
.h1 {
  font-size: 40px;
  color: white;
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
  text-shadow: 2px 2px #ff0000;
}
.bgh1 {
  font-size: 42px;
  color: rgb(88, 120, 164);
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
}
</style>
