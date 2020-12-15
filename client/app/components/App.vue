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

<style>
/** using .ns-root means these variables don't apply across frames (ie in modals) */
frame {
  --employee-color-base: rgb(203, 154, 94);
  --employee-color-highlight: rgb(216, 183, 142);
  --employee-color-lowlight: rgb(155, 106, 53);

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

  --self-color-base: rgb(94, 134, 203);
  --self-color-highlight: rgb(142, 169, 216);
  --self-color-lowlight: rgb(53, 65, 155);

  --opponent-color-base: rgb(203, 172, 94);
  --opponent-color-highlight: rgb(216, 199, 142);
  --opponent-color-lowlight: rgb(155, 123, 53);

  --server-color-base: rgb(94, 203, 94);
  --server-color-highlight: rgb(142, 216, 142);
  --server-color-lowlight: rgb(58, 155, 53);
}

.button {
  font-family: "Grandstander", "Grandstander-Regular";
  font-size: 30px;
  border-width: 7px;
  border-color: lightblue;
  border-radius: 7px;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgba(188, 209, 215, 1) 0%,
    rgba(211, 229, 235, 1) 25%,
    rgba(211, 229, 235, 1) 75%,
    rgba(237, 246, 249, 1) 100%
  );
  margin: 5px 0px 5px 0px;
}

.button:highlighted {
  border-color: #8ebccc;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgb(209, 225, 230) 0%,
    rgb(227, 240, 245) 25%,
    rgb(227, 242, 247) 75%,
    rgb(250, 254, 255) 100%
  );
}
</style>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
</style>
