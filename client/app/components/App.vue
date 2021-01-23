<template>
  <Frame id="base">
    <GameLocal />
  </Frame>
</template>

<script lang="ts">
import Login from "./Login.vue";
import GameLocal from "./game/GameLocal.vue";
import orientation from "nativescript-orientation";

orientation.enableRotation();
orientation.setOrientation("landscape");

export default {
  components: { GameLocal },
  methods: {
    login() {
      this.$navigateTo(Login, { frame: "base" });
    },
    quickStart() {
      this.$navigateTo(GameLocal, {
        frame: "base",
        animated: true,
        // An example transition - can think more about this as part of design iterations.
        transition: {
          name: "slide",
          duration: 380,
          curve: "easeIn",
        },
      });
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
</style>
