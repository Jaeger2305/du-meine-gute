<template>
  <Page>
    <FlexboxLayout flexDirection="column" justifyContent="space-around">
      <TextField v-model="username" hint="Enter username..." height="70" />
      <Button text="Login" @tap="login" height="70" />
    </FlexboxLayout>
  </Page>
</template>

<script lang="ts">
import { getString, setString } from "@nativescript/core/application-settings";
import Lobby from "./Lobby.vue";

export default {
  data() {
    return {
      username: "",
      savedUsername: getString("username"),
    };
  },
  created() {
    if (getString("authtoken")) return this.$navigateTo(Lobby); // this appears buggy - it goes to the right place, but then gets sent back again
  },
  methods: {
    async login() {
      try {
        const username = this.username;
        const response = await fetch(`${dmgAppConfig.apiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        });
        const data = await response.json();
        if (data.Status !== 200 || data.IsError) {
          throw new Error("response returned error");
        }
        setString("username", username);
        setString("authtoken", data.Body);
        this.$navigateTo(Lobby);
      } catch (error) {
        console.error("couldn't login", error);
      }
    },
  },
};
</script>

<style scoped></style>
