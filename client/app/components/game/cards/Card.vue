<template>
  <GridLayout columns="14*, 30px, 7*" rows="*,3*" class="card-container">
    <FlexboxLayout
      col="0"
      row="0"
      alignItems="center"
      justifyContent="center"
      class="title-container"
    >
      <Label text="test-card" class="h1" />
    </FlexboxLayout>
    <!-- Production info -->
    <GridLayout col="0" row="1" columns="4*,*,8*,*,4*" rows="3*,*,3*">
      <!-- Primary input -->
      <Label col="0" colSpan="2" row="0" rowSpan="2" class="icon-placeholder" />
      <Label col="0" colSpan="2" row="1" rowSpan="2" class="icon-placeholder" />
      <!-- Output -->
      <Label col="2" row="0" rowSpan="3" class="icon-placeholder-big" />
      <!-- Chain input -->
      <Label col="3" colSpan="2" row="0" rowSpan="2" class="icon-placeholder" />
      <Label col="3" colSpan="2" row="1" rowSpan="2" class="icon-placeholder" />
      <!-- Arrows -->
      <Label
        col="0"
        row="0"
        rowSpan="3"
        colSpan="2"
        :text="'\uf138'"
        class="fa left"
      />
      <Label
        col="3"
        row="0"
        rowSpan="3"
        colSpan="2"
        :text="'\uf137'"
        class="fa right"
      />
    </GridLayout>
    <Label col="1" row="1" text="" class="separator" />
    <FlexboxLayout
      col="2"
      row="0"
      alignItems="center"
      justifyContent="space-around"
      class="attribute-container"
    >
      <GameIcon :unicodeIcon="'\uf3ed'" :displayNumber="5" />
      <GameIcon :unicodeIcon="'\uf51e'" :displayNumber="5" />
    </FlexboxLayout>
    <Image col="2" row="1" src="~/assets/images/combined-clouds.png" />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GameIcon from "../reusable/GameIcon.vue";

export default {
  props: {},
  components: { GameIcon },
};
</script>

<style scoped>
.card-container {
  background-color: red;
  width: 600px;
  height: 320px;
}

.title-container {
  background-color: rgb(216, 142, 142);
  border-radius: 100%;
  margin: 5px;
}

.h1 {
  font-size: 20px;
  color: white;
  font-family: "Grenze Gotisch", "GrenzeGotisch-Bold";
  font-weight: bold;

  text-align: center;
  vertical-align: middle;
}

.attribute-container {
  margin: 5px;
}

.attribute-item {
  margin: 5px;
}

.separator {
  background-color: rgb(216, 142, 142);
  height: 60%;
  width: 25px;
}

.icon-placeholder-small {
  background-color: rgb(216, 142, 142);
  height: 50px;
  width: 50px;
  color: white;
}

.icon-placeholder-big {
  background-color: rgb(95, 95, 95);
  height: 150px;
  width: 150px;
}

.icon-placeholder {
  background-color: rgb(95, 95, 95);
  height: 50px;
  width: 90px;
}

.fa {
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  height: 50px;
  width: 50px;
}
.left {
  color: white;
}
.right {
  color: black;
}
</style>