<template>
  <GridLayout columns="*" rows="*" class="game-icon">
    <Label col="0" row="0" :text="unicodeIcon" class="fa-icon" />

    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="bg-number"
    />
    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="fg-number"
      textShadow="0 0 3 rgb(88, 120, 164)"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default {
  props: {
    displayNumber: {
      type: String,
      required: false,
      default: "",
    },
    unicodeIcon: {
      type: String,
      required: true,
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
  text-shadow: 2px 2px #ff0000;
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
</style>
