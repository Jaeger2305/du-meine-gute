<template>
  <GridLayout columns="*" rows="*" class="secondary-container">
    <Label col="0" row="0" class="bg-halo" :text="resourceType" />
    <Image col="0" row="0" :src="resourceSrc" class="secondary-icon" />

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
      textShadow="0 0 5 rgb(88, 120, 164)"
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
.bg-halo {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.secondary-container {
  height: 170px;
  width: 170px;
}

.secondary-icon {
  height: 140px;
  width: 140px;
}

.fg-number {
  font-size: 24px;
  color: white;
  font-family: "Grandstander", "Grandstander-Regular";
  text-shadow: 2px 2px #ff0000;
  text-align: center;
  vertical-align: middle;
}
.bg-number {
  font-size: 24px;
  color: rgb(88, 120, 164);
  font-family: "Grandstander", "Grandstander-Bold";
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}
</style>
