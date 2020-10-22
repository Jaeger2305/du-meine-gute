<template>
  <Frame>
    <Page>
      <ActionBar title="Employee Shop">
        <ActionItem
          @tap="cancel"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <!-- |---------------|---------------| -->
      <!-- |                               | -->
      <!-- |         EmployeeDetail        | -->
      <!-- |                               | -->
      <!-- |---------------|---------------| -->
      <!-- |            actions            | -->
      <!-- |---------------|---------------| -->

      <!-- View available employee details -->
      <ScrollView orientation="vertical" column="0" row="0">
        <StackLayout>
          <Label text="Available employees" />
          <EmployeeDetail
            v-for="employee in availableEmployees"
            :key="employee.name"
            :name="employee.name"
            :isHireable="true"
            :modes="employee.modes"
            :resourceSpecialty="employee.resourceSpecialty"
            :cost="employee.cost"
            :points="employee.points"
            @hire-employee="hireEmployee(employee)"
          />
        </StackLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { sum } from "lodash";
import {
  generatePoorRandomKey,
  handleValidationError,
  keyArray,
} from "../../utils";
import {
  PlayerState,
  Employee,
  ProductionEfficiency,
  Card,
  AssignedEmployee,
  GameState,
} from "../../game/types";
import {
  differenceResources,
  checkOutstandingResources,
} from "../../game/utils";
import { Resource } from "../../game/resources";
import Purchasing from "./Purchasing.vue";

export default Vue.extend({
  props: {
    resources: {
      type: Object as PropType<PlayerState["resources"]>,
      required: true,
    },
    availableEmployees: {
      type: Object as PropType<GameState["availableEmployees"]>,
      required: true,
    },
  },
  data(): {} {
    return {};
  },
  computed: {},
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    async hireEmployee(employee: Employee): Promise<void> {
      const {
        resources: chosenResources,
      }: { resources: Array<Resource> } = await this.$showModal(Purchasing, {
        props: {
          factory: employee,
          costExtractor: (employee) => employee.cost,
          resources: this.resources,
        },
      });
      this.$modal.close({ employee, resourcePayment: chosenResources });
    },
  },
});
</script>

<style scoped></style>
