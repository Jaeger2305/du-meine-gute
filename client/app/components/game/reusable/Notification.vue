<template>
  <GridLayout columns="*" :rows="messages ? '3*,5*' : '*'">
    <Image
      col="0"
      row="0"
      rowSpan="2"
      src="~/assets/images/combined-clouds.png"
    />

    <shadowed-label col="0" row="0" :text="header" class="bgh1" :class="size" />
    <shadowed-label
      col="0"
      row="0"
      :text="header"
      class="h1"
      :class="size"
      textShadow="0 0 10 rgb(88, 120, 164)"
    />
    <NotificationMessageContainer
      v-if="messages"
      :messages="messages"
      col="0"
      row="1"
      style="margin: 20px 90px 10px 30px;"
    />
    <FlexboxLayout
      v-if="isDismissable"
      col="0"
      rowSpan="2"
      justifyContent="flex-end"
    >
      <FlexboxLayout
        class="notification-button"
        justifyContent="center"
        @tap="$emit('close')"
      >
        <GameIconImage
          src="~/assets/images/icons/close.png"
          size="large"
          @tap-game-icon="$emit('close')"
        />
      </FlexboxLayout>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import NotificationMessageContainer from "./NotificationMessageContainer.vue";
import GameIconImage from "./GameIconImage.vue";
import { Notification } from "../../../game/round-description";

export default {
  props: {
    header: {
      type: String as PropType<Notification["header"]>,
      required: true,
    },
    messages: {
      type: Array as PropType<Notification["messages"]>,
      required: false,
      default: null,
    },
    size: {
      type: String,
      default: "small",
    },
    isDismissable: {
      type: Boolean,
      default: false,
    },
  },
  components: { NotificationMessageContainer, GameIconImage },
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
  text-shadow: 2px 2px 0px #ff0000;
}
.h1.large {
  margin-top: 80px;
  font-size: 70px;
}
.bgh1 {
  font-size: 42px;
  color: rgb(88, 120, 164);
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
}
.bgh1.large {
  margin-top: 80px;
  font-size: 73px;
}

.notification-button {
  margin: 30% 0px 50% 0px;
}
</style>
