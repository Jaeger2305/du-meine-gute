<template>
  <Frame id="assignment-confirmation">
    <Page actionBarHidden="true">
      <GridLayout columns="2*,*">
        <!-- Actually want this to be transparent fade bg -->
        <Image colSpan="2" src="~/assets/images/backboard.png" stretch="fill" />
        <FlexboxLayout
          column="0"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <Employee
            column="1"
            rowSpan="2"
            :employee="employeeWithFocussedAssignment"
          />
          <GameIcon size="large" :unicodeIcon="`\uf13a`" />
          <Card :card="factory" />
        </FlexboxLayout>
        <FlexboxLayout
          column="1"
          flexDirection="column"
          justifyContent="center"
          alignItems="stretch"
        >
          <Button class="button" @tap="cancel">CANCEL</Button>
          <Button class="button" @tap="confirm">CONFIRM</Button>
        </FlexboxLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  PlayerState,
  Employee,
  Card,
  ProductionEfficiency,
} from "../../../game/types";
import { Resource } from "../../../game/resources";
import EmployeeVue from "./../cards/Employee.vue";
import CardVue from "./../cards/Card.vue";
import GameIcon from "./../reusable/GameIcon.vue";
import { isEqual } from "lodash";

export default {
  components: { Employee: EmployeeVue, Card: CardVue, GameIcon },
  props: {
    factory: {
      type: Object as PropType<Card>,
      required: true,
    },
    employee: {
      type: Object as PropType<Employee>,
      required: true,
    },
    efficiency: {
      type: Object as PropType<ProductionEfficiency>,
      required: true,
    },
  },
  computed: {
    employeeWithFocussedAssignment(): Employee {
      const selectedModes = this.employee.modes.filter((productionEfficiency) =>
        isEqual(productionEfficiency, this.efficiency)
      );
      return {
        ...this.employee,
        modes: selectedModes,
      };
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(false);
    },
    confirm() {
      this.$modal.close(true);
    },
  },
};
</script>

<style scoped></style>
