<template>
  <Frame id="base">
    <Page>
      <ActionBar title="Du Meine Güte" />
      <GridLayout columns="*, *" rows="*">
        <Button column="0" text="gotologin" @tap="login" />
        <Button column="1" text="quickStart" @tap="quickStart" />
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
      this.$navigateTo(Login);
    },
    quickStart() {
      this.$navigateTo(GameLocal);
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
