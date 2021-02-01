<template>
  <GridLayout columns="*" :rows="messages ? '3*,5*' : '*'">
    <Image
      col="0"
      row="0"
      rowSpan="2"
      src="~/assets/images/combined-clouds.png"
    />

    <FlexboxLayout
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <GridLayout columns="*" rows="*">
        <Label :text="$t(header)" class="bgh1" :class="size" :textWrap="true" />
        <Label
          :text="$t(header)"
          class="h1"
          :class="size"
          :textWrap="true"
          textShadow="0 0 10 rgb(88, 120, 164)"
        />
      </GridLayout>
      <GameIconImage
        v-if="isDismissable"
        src="~/assets/images/icons/close.png"
        size="large"
        :isActionable="true"
        :isHitboxVisible="false"
        @tap-game-icon="$emit('close')"
      />
    </FlexboxLayout>
    <NotificationMessageContainer
      v-if="messages"
      :messages="messages"
      col="0"
      row="1"
      style="margin: 20px 90px 10px 30px;"
    />
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
  font-size: 34px;
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
  font-size: 34px;
  transform: scale(1.01);
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
