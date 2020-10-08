<template>
  <Button :text="name" @tap="$emit('click')" :isEnabled="isEnabled" />
</template>

<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped></style>
