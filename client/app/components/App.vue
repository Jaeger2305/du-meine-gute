<template>
  <Frame id="base">
    <Page>
      <ActionBar title="Industrialist" />
      <GridLayout columns="*, *" rows="*">
        <Button column="0" :text="$t('action.login')" @tap="login" />
        <Button column="1" :text="$t('action.quickStart')" @tap="quickStart" />
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Login from "./Login.vue";
import GameLocal from "./game/GameLocal.vue";
import orientation from "nativescript-orientation";

orientation.enableRotation();
orientation.setOrientation("landscape");

export default {
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
