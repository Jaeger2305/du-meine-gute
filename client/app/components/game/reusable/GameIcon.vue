<template>
  <GridLayout
    columns="*"
    rows="*"
    class="game-icon"
    :class="size"
    @tap="$emit('tap')"
  >
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
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

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
</style>
