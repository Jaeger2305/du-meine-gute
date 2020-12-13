<template>
  <GridLayout columns="*, 3*, *" rows="*" class="l">
    <Label
      v-if="index > 0"
      :text="'\uf137'"
      class="fa"
      @tap="$emit('update:index', index - 1)"
    />
    <FlexboxLayout column="1">
      <slot />
    </FlexboxLayout>
    <Label
      v-if="index < selectableListLength - 1"
      column="2"
      :text="'\uf138'"
      class="fa"
      @tap="$emit('update:index', index + 1)"
    />
  </GridLayout>
</template>

<script lang="ts">
export default {
  props: {
    selectableListLength: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number as () => number | null,
      default: null,
    },
  },
};
</script>

<style scoped>
.l {
  width: 900px;
}
.fa {
  color: black;
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  font-size: 30px;
  text-align: center;
  vertical-align: center;
}
</style>
