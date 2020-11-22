<template>
  <GridLayout columns="*" rows="*" class="placeholder">
    <Label col="0" row="0" text="placeholder Factory" />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default {
  props: {},
};
</script>

<style scoped>
.placeholder {
  height: 100px;
  width: 100px;
  color: black;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
}
</style>
