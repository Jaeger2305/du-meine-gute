<template>
  <GridLayout columns="2*, 5*, 2*" rows="*" class="grid-container">
    <FlexboxLayout
      v-if="isActiveEmployeePurchasable"
      column="0"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
      @tap="hireEmployee"
    >
      <Button class="button">BUY</Button>
    </FlexboxLayout>
    <CarouselSelect
      v-if="activeEmployee"
      column="1"
      :index.sync="activeIndex"
      :selectableListLength="employees.length"
    >
      <Employee :employee="activeEmployee" />
    </CarouselSelect>
    <FlexboxLayout
      column="2"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
    >
      <Button class="button" @tap="endStep">END</Button>
    </FlexboxLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { sumBy } from "lodash";

import Notification from "../reusable/Notification.vue";
import EmployeeVue from "../cards/Employee.vue";
import PurchasingVue from "../Purchasing.vue";
import CarouselSelect from "../../CarouselSelect.vue";

import { CustomEvents } from "../../../types";
import { PlayerActionEnum, playerActions } from "../../../game/client";
import { Employee } from "../../../game/types";
import { Resource } from "../../../game/resources";
import { differenceResources } from "../../../game/utils";

export default {
  props: {},
  components: { Notification, Employee: EmployeeVue, CarouselSelect },
  data() {
    return {
      activeIndex: this.$store.state.gameState.availableEmployees.length
        ? 0
        : null,
    };
  },
  computed: {
    employees() {
      return this.$store.state.gameState.availableEmployees;
    },
    activeEmployee(): Employee | null {
      return Number.isInteger(this.activeIndex)
        ? this.employees[this.activeIndex]
        : null;
    },
    isActiveEmployeePurchasable(): boolean {
      if (!this.activeEmployee) return false;
      const money = sumBy(this.$store.state.playerState.resources, "value");
      const sufficientMoney = money >= this.activeEmployee.cost;

      const buildingsTypesInPlay = this.$store.state.playerState.cardsInPlay.map(
        ({ resource }) => resource
      );
      const sufficientBuildings =
        differenceResources(
          this.activeEmployee.resourceSpecialty,
          buildingsTypesInPlay
        ).length < 1;

      return Boolean(sufficientMoney && sufficientBuildings);
    },
  },
  methods: {
    endStep() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep, null);
    },
    async hireEmployee(): Promise<void> {
      const purchaseResult: {
        resources: Array<Resource>;
      } | null = await this.$showModal(PurchasingVue, {
        props: {
          factory: this.activeEmployee,
          costExtractor: (employee) => employee.cost,
          resources: this.$store.state.playerState.resources,
        },
      });
      if (purchaseResult) {
        const hireEmployeePayload: Parameters<
          typeof playerActions[PlayerActionEnum.hireWorker]
        >[2] = {
          employee: this.activeEmployee,
          resourcePayment: purchaseResult.resources,
        };
        this.$emit(
          CustomEvents.PLAYER_ACTION,
          PlayerActionEnum.hireWorker,
          hireEmployeePayload
        );
      }
    },
  },
};
</script>

<style scoped>
/* needed to make the grid spacing even between items or at the end */
.grid-container {
  margin-left: 15px;
  margin-right: 15px;
}

.grid-item {
  margin: 25px 15px 25px 15px;
}

.fa {
  color: black;
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  font-size: 30px;
  text-align: center;
  vertical-align: center;
}

.button {
  font-family: "Grandstander", "Grandstander-Regular";
  font-size: 30px;
  border-width: 7px;
  border-color: lightblue;
  border-radius: 7px;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgba(188, 209, 215, 1) 0%,
    rgba(211, 229, 235, 1) 25%,
    rgba(211, 229, 235, 1) 75%,
    rgba(237, 246, 249, 1) 100%
  );
  margin: 5px 0px 5px 0px;
}

.button:highlighted {
  border-color: #8ebccc;
  background: rgb(188, 209, 215);
  background: linear-gradient(
    0deg,
    rgb(209, 225, 230) 0%,
    rgb(227, 240, 245) 25%,
    rgb(227, 242, 247) 75%,
    rgb(250, 254, 255) 100%
  );
}
</style>
