<template>
  <Frame id="employee-shop">
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
          <Label :text="`Available employees, money: ${totalFunds}`" />
          <EmployeeDetail
            v-for="employee in employeesInShop"
            :key="employee.name"
            :name="employee.name"
            :isHireable="employee.isHireable"
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
import { sumBy } from "lodash";
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
  computed: {
    totalFunds(): number {
      return sumBy(this.resources, "value");
    },
    employeesInShop(): Array<
      GameState["availableEmployees"] & { isHireable: boolean }
    > {
      return this.availableEmployees.map((employee) => ({
        ...employee,
        isHireable: employee.cost <= this.totalFunds,
      }));
    },
  },
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
