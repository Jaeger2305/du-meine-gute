<template>
  <Frame id="banner">
    <Page actionBarHidden="true" class="cover-image">
      <Discard />
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Discard from "./Discard.vue";

export default {
  props: {},
  components: { Discard },
  methods: {},
};
</script>

<style scoped>
.cover-image {
  background-image: url("~/assets/images/backboard.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
