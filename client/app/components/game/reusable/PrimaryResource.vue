<template>
  <GridLayout
    class="primary-icon"
    :class="{ activity: isActionHappening }"
    @tap="$emit('tap')"
  >
    <Image :src="resourceSrc" class="primary-image" stretch="fill" />

    <Label :text="formattedNumber" class="bg-number" />
    <Label
      :text="formattedNumber"
      class="fg-number"
      textShadow="0 0 3 rgb(88, 120, 164)"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ResourceType } from "../../../game/resources";
import { activity } from "../../../mixins/activity";

export default {
  mixins: [activity],
  props: {
    displayNumber: {
      type: String,
      required: false,
      default: null,
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
    formattedNumber(): string {
      return this.displayNumber ?? `0`;
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
  text-shadow: 2px 2px 0px #ff0000;
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
