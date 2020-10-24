<template>
  <Frame id="assignment-selection">
    <Page>
      <ActionBar title="Assignment selection">
        <ActionItem
          @tap="cancel"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <StackLayout>
        <Label>
          <Span>
            {{
              {
                employee: employee,
                efficiency: employee.modes[0],
                factory: factories[0],
              }
            }}
          </Span>
        </Label>
        <Button @tap="submitAssignment" text="Close" />
      </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  PlayerState,
  Employee,
  ProductionEfficiency,
  Card,
} from "../../game/types";

export default {
  props: {
    employee: {
      type: Object as PropType<Employee>,
      required: true,
    },
    factories: {
      type: Object as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
  },
  computed: {},
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    submitAssignment() {
      // Just manually force this for now without a choice.
      const assignment: {
        employee: Employee;
        efficiency: ProductionEfficiency;
        factory: Card;
      } = {
        employee: this.employee,
        efficiency: this.employee.modes[0],
        factory: this.factories[0],
      };
      this.$modal.close(assignment);
    },
  },
};
</script>

<style scoped></style>
