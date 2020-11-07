<template>
  <FlexboxLayout backgroundColor="#3c495e">
    <Button
      v-for="action in actions"
      :key="action"
      :text="action"
      :isEnabled="false"
    />
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlayerState } from "../../game/types";

export default Vue.extend({
  // There's no intellisense on "this.zzz". Tutorials seem to specify using decorator syntax - https://nativescripting.com/posts/typescript-class-components-in-nativescript-vue
  // But this syntax seems to work in a normal web dev project. To revisit.
  props: {
    actions: {
      type: Array as PropType<PlayerState["availableActions"]>,
      required: true,
    },
  },
});
</script>

<style scoped></style>
