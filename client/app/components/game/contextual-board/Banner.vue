<template>
  <Frame id="banner">
    <Page actionBarHidden="true" class="cover-image">
      <!-- History (just websockets for now)  -->
      <ScrollView orientation="vertical">
        <StackLayout orientation="horizontal">
          <Resources :resources="$store.state.playerState.resources" />
          <Market :resources="$store.state.gameState.marketCards" />
          <Button text="navi" @tap="navi" />
          <Label
            v-for="message in $store.state.messages"
            :key="message"
            :text="message"
          />
        </StackLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default {
  props: {},
  methods: {},
};
</script>

<style scoped>
.cover-image {
  background-image: url("~/assets/images/backboard.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
