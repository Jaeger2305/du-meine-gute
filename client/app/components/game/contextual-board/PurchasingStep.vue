<template>
  <GridLayout columns="2*, 5*, 2*" rows="*" class="grid-container">
    <FlexboxLayout
      column="0"
      class="grid-item"
      alignItems="stretch"
      justifyContent="center"
      flexDirection="column"
      @tap="buy"
    >
      <Button class="button">BUY</Button>
    </FlexboxLayout>
    <CarouselSelect
      v-if="Number.isInteger(activeIndex)"
      column="1"
      :index.sync="activeIndex"
      :selectableListLength="employees.length"
    >
      <Employee :employee="employees[activeIndex]" />
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
import { PlayerActionEnum } from "../../../game/client";
import Notification from "../reusable/Notification.vue";
import { CustomEvents } from "../../../types";
import Employee from "../cards/Employee.vue";
import CarouselSelect from "../../CarouselSelect.vue";

export default {
  props: {},
  components: { Notification, Employee, CarouselSelect },
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
  },
  methods: {
    endStep() {
      this.$emit(CustomEvents.PLAYER_ACTION, PlayerActionEnum.endStep, null);
    },
    buy() {
      console.warn("not implemented yet");
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
