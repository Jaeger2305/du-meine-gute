<template>
  <Frame id="base">
    <Page>
      <FlexboxLayout flexDirection="column">
        <TextField v-model="username" hint="Enter username..." height="70" />
        <Button text="Start" @tap="quickStart" height="70" />
      </FlexboxLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import GameLocal from "./game/GameLocal.vue";
import { getString, setString } from "@nativescript/core/application-settings";

export default {
  components: { GameLocal },
  data() {
    return {
      username: getString("username") || "Hans",
    };
  },
  methods: {
    quickStart() {
      setString("username", this.username);
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
