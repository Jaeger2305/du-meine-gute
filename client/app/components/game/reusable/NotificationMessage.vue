<template>
  <FlexboxLayout justifyContent="space-around" alignContent="center">
    <Label v-if="subheader" :text="$t(subheader)" textWrap class="subheader" />
    <Label :text="$t(content)" class="content" textWrap flexShrink="3" />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export type Message = {
  subheader?: string;
  content: string;
};

export default {
  props: {
    subheader: {
      type: String,
      required: false,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.subheader {
  font-size: 20px;
  color: black;
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-shadow: 2px 2px 0px #ff0000;
}
.content {
  font-size: 16px;
  color: black;
  font-family: "Grandstander", "Grandstander-Regular";
  text-align: center;
}
</style>
