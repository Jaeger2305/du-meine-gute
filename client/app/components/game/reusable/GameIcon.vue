<template>
  <GridLayout columns="*" rows="*" class="game-icon" :class="size">
    <Label v-if="isActionable" col="0" row="0" class="button" />
    <Label col="0" row="0" :text="unicodeIcon" class="fa-icon" :class="size" />

    <Label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="bg-number"
      :class="size"
    />
    <Label
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
.button {
  color: black;
}
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
</style>
