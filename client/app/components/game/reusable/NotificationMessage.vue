<template>
  <FlexboxLayout justifyContent="center">
    <Label
      v-if="subheader"
      :text="subheader"
      textWrap
      class="subheader"
      flexShrink="3"
    />
    <Label :text="content" class="content" textWrap />
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
  font-size: 24px;
  color: black;
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-shadow: 2px 2px #ff0000;
}
.content {
  font-size: 16px;
  color: black;
  font-family: "Grandstander", "Grandstander-Regular";
  text-align: center;
}
</style>
