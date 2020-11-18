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

.ns-root {
  --clay-color-base: rgb(203, 94, 94);
  --clay-color-highlight: rgb(216, 142, 142);
  --clay-color-lowlight: rgb(155, 53, 53);

  --wood-color-base: rgb(112, 203, 94);
  --wood-color-highlight: rgb(167, 216, 142);
  --wood-color-lowlight: rgb(101, 155, 53);

  --metal-color-base: rgb(94, 152, 203);
  --metal-color-highlight: rgb(142, 184, 216);
  --metal-color-lowlight: rgb(53, 111, 155);

  --wheat-color-base: rgb(203, 194, 94);
  --wheat-color-highlight: rgb(216, 207, 142);
  --wheat-color-lowlight: rgb(155, 135, 53);

  --wool-color-base: rgb(94, 203, 196);
  --wool-color-highlight: rgb(142, 209, 216);
  --wool-color-lowlight: rgb(53, 153, 155);

  --unknown-color-base: rgb(139, 94, 203);
  --unknown-color-highlight: rgb(173, 142, 216);
  --unknown-color-lowlight: rgb(104, 53, 155);
}
</style>
