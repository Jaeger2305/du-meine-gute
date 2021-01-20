<template>
  <GridLayout columns="*" rows="*" class="game-icon" :class="size">
    <Label v-if="isActionable" col="0" row="0" class="button" />
    <Image :src="src" />

    <Label
      v-if="displayNumber"
      :text="displayNumber"
      class="bg-number"
      :class="size"
    />
    <Label
      v-if="displayNumber"
      :text="displayNumber"
      class="fg-number"
      :class="size"
    />
    <Label v-if="isActionable" class="hitbox" @tap="tapGameIcon" />
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
    size: {
      type: String,
      default: "small",
    },
    src: {
      type: String,
      required: true,
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

.small {
  height: 100px;
  width: 100px;
  font-size: 15px;
}
</style>
