<template>
  <GridLayout columns="*" rows="*" class="game-icon" :class="size">
    <Label v-if="isActionable" col="0" row="0" class="button" />
    <Label col="0" row="0" :text="unicodeIcon" class="fa-icon" :class="size" />

    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="bg-number"
      :class="size"
    />
    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="fg-number"
      :class="size"
      textShadow="0 0 3 rgb(88, 120, 164)"
    />
    <Label
      v-if="isActionable"
      col="0"
      row="0"
      class="hitbox"
      @tap="tapGameIcon"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../../types";

export default {
  props: {
    displayNumber: {
      type: Number,
      required: false,
      default: 0,
    },
    unicodeIcon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
    isActionable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    tapGameIcon(): void {
      this.$emit(CustomEvents.TAP_GAME_ICON);
    },
  },
};
</script>

<style scoped>
.game-icon {
  height: 80px;
  width: 80px;
  color: black;
  text-align: center;
  vertical-align: middle;
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  font-size: 20px;
}

.fg-number {
  font-size: 20px;
  color: white;
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-shadow: 2px 2px 0px #ff0000;
  text-align: center;
  vertical-align: middle;
}
.bg-number {
  font-size: 20px;
  color: rgb(88, 120, 164);
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}

.large {
  height: 180px;
  width: 180px;
  font-size: 35px;
}

.button {
  height: 100%;
  width: 100%;
  border-width: 7px;
  border-color: lightblue;
  border-radius: 7px;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgba(188, 209, 215, 1) 0%,
    rgba(211, 229, 235, 1) 25%,
    rgba(211, 229, 235, 1) 75%,
    rgba(237, 246, 249, 1) 100%
  );
  margin: 5px 0px 5px 0px;
}

.button:highlighted {
  border-color: #8ebccc;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgb(209, 225, 230) 0%,
    rgb(227, 240, 245) 25%,
    rgb(227, 242, 247) 75%,
    rgb(250, 254, 255) 100%
  );
}
</style>
