<template>
  <Button :text="name" @tap="$emit('click')" />
</template>

<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
