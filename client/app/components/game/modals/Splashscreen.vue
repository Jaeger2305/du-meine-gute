<template>
  <Frame id="production">
    <Page actionBarHidden="true">
      <GridLayout columns="*" rows="*" @swipe="$modal.close()">
        <Image src="~/assets/images/backboard.png" stretch="fill" />
        <Notification size="large" header="Industrialist" />
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Notification from "../reusable/Notification.vue";
import { setTimeout, clearTimeout } from "@nativescript/core/timer";

export default {
  components: {
    Notification,
  },
  created() {
    setTimeout(() => {
      this.$modal.close();
    }, 2500);
  },
};
</script>

<style scoped></style>
