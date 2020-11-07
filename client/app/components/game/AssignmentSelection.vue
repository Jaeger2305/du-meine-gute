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
      <ScrollView orientation="vertical">
        <StackLayout>
          <GridLayout
            columns="*, *"
            rows="*, *"
            v-for="employee in employees"
            :key="employee.name"
          >
            <StackLayout column="0" row="0" orientation="horizontal">
              <Label :text="employee.name" />
            </StackLayout>
            <StackLayout column="1" row="0" rowSpan="2" orientation="vertical">
              <Label
                v-for="mode in employee.modes"
                :key="
                  [mode.productionCount, mode.resourceSparingCount].join('~')
                "
                :text="[mode.productionCount, mode.resourceSparingCount].join()"
              />
            </StackLayout>
            <StackLayout
              column="2"
              row="0"
              rowSpan="2"
              orientation="horizontal"
            >
              <Button text="assign" @tap="assignEmployee(employee)" />
            </StackLayout>
          </GridLayout>
        </StackLayout>
      </ScrollView>
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
import AssignmentFactorySelection from "./AssignmentFactorySelection.vue";
import AssignmentModeSelection from "./AssignmentModeSelection.vue";

export default {
  props: {
    employees: {
      type: Array as PropType<Array<Employee>>,
      required: true,
    },
    factories: {
      type: Array as PropType<PlayerState["cardsInPlay"]>,
      required: true,
    },
  },
  computed: {},
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    async assignEmployee(employee: Employee) {
      const factory = await this.$showModal(AssignmentFactorySelection, {
        props: { factories: this.factories },
      });
      if (!factory) return;

      const efficiency = employee.modes.length
        ? await this.$showModal(AssignmentModeSelection, {
            props: { modes: employee.modes },
          })
        : employee.modes[0];
      if (!efficiency) return;
      const assignment: {
        employee: Employee;
        efficiency: ProductionEfficiency;
        factory: Card;
      } = {
        employee,
        efficiency,
        factory,
      };
      this.$modal.close(assignment);
    },
  },
};
</script>

<style scoped></style>
