<template>
  <Frame id="assignment-mode-selection">
    <Page>
      <ActionBar title="Pick an efficiency">
        <ActionItem
          @tap="cancel"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <ScrollView orientation="horizontal">
        <StackLayout orientation="horizontal">
          <FlexboxLayout backgroundColor="#3c495e">
            <Card
              v-for="mode in displayModes"
              :key="mode.key"
              :name="mode.name"
              :is-enabled="true"
              @click="selectMode(mode)"
            />
          </FlexboxLayout>
        </StackLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ProductionEfficiency } from "../../game/types";

export default {
  props: {
    modes: {
      type: Array as PropType<Array<ProductionEfficiency>>,
      required: true,
    },
  },
  computed: {
    displayModes(): Array<
      ProductionEfficiency & { key: string; name: string }
    > {
      return this.modes.map((mode) => ({
        ...mode,
        key: `${mode.productionCount}~${mode.resourceSparingCount}`,
        name: `produces: ${mode.productionCount} and can discount with ${mode.resourceSparingCount}`,
      }));
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    selectMode(mode): void {
      this.$modal.close(mode);
    },
  },
};
</script>

<style scoped></style>
