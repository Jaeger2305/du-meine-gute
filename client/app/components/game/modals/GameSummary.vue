<template>
  <Frame id="game-summary">
    <Page>
      <ActionBar title="Game summary">
        <ActionItem
          @tap="$modal.close(null)"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <StackLayout>
        <Label :text="`winner: ${winner.name}`" />
      </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { GameState } from "../../../game/types";

export default {
  props: {
    winner: {
      type: Object as PropType<GameState["winner"]>,
      required: true,
    },
  },
};
</script>

<style scoped></style>
