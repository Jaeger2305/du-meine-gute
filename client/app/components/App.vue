<template>
  <Page>
    <ActionBar title="Du Meine Güte" />
    <GridLayout columns="*" rows="*">
      <Button text="gotologin" @tap="login" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Login from "./Login.vue";
import Lobby from "./Lobby.vue";
import orientation from "nativescript-orientation";

orientation.enableRotation();
orientation.setOrientation("landscape");

export default {
  methods: {
    login() {
      this.$navigateTo(Login);
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
