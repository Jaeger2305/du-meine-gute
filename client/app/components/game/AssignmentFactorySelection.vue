<template>
  <Frame id="assignment-factory-selection">
    <Page>
      <ActionBar title="Pick a factory">
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
              v-for="factory in factories"
              :key="factory.name"
              :name="factory.name"
              :is-enabled="true"
              @click="selectFactory(factory)"
            />
          </FlexboxLayout>
        </StackLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Card } from "../../game/types";

export default {
  props: {
    factories: {
      type: Array as PropType<Array<Card>>,
      required: true,
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    selectFactory(factory): void {
      this.$modal.close(factory);
    },
  },
};
</script>

<style scoped></style>
