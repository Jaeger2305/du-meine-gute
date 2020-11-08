<template>
  <FlexboxLayout>
    <Label
      v-if="subheader"
      :text="subheader"
      textWrap
      alignSelf="center"
      class="subheader"
      flexShrink="3"
    />
    <Label :text="content" class="content" textWrap alignSelf="center" />
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
  font-size: 25px;
  color: black;
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;

  text-align: center;
  text-shadow: 2px 2px #ff0000;
}
.content {
  font-size: 20px;
  color: black;
  font-family: "Grandstander", "Grandstander-Regular";

  text-align: center;
}
</style>
