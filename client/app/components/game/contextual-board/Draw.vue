<template>
  <Page actionBarHidden="true">
    <StackLayout orientation="horizontal">
      <Label text="DRAW" />
      <Button @tap="endStep">END</Button>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomEvents } from "../../../types";
import { PlayerActionEnum } from "../../../../../cli/types";

export default {
  props: {},
  methods: {
    endStep() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep);
    },
  },
};
</script>

<style scoped></style>
