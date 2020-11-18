<template>
  <GridLayout columns="*" rows="*" class="primary-icon">
    <Image col="0" row="0" :src="resourceSrc" class="primary-image" />

    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="bg-number"
    />
    <shadowed-label
      v-if="displayNumber"
      col="0"
      row="0"
      :text="displayNumber"
      class="fg-number"
      textShadow="0 0 3 rgb(88, 120, 164)"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ResourceType } from "../../../game/resources";

export default {
  props: {
    displayNumber: {
      type: String,
      required: false,
      default: "",
    },
    resourceType: {
      type: String as () => ResourceType,
      required: true,
    },
  },
  computed: {
    resourceSrc(): string {
      return `~/assets/images/resources/${this.resourceType}.png`;
    },
  },
};
</script>

<style scoped>
.primary-icon {
  height: 80px;
  width: 80px;
}

.primary-image {
  border-width: 3px;
}

.fg-number {
  font-size: 20px;
  color: white;
  font-family: "Grandstander", "Grandstander-Regular";
  text-shadow: 2px 2px #ff0000;
  text-align: center;
  vertical-align: middle;
}
.bg-number {
  font-size: 20px;
  color: rgb(88, 120, 164);
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}
</style>
