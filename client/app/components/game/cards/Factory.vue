<template>
  <GridLayout
    columns="*,*"
    rows="*,2*"
    :class="{ placeholder: isPlaceholder && !isActionable }"
  >
    <Image
      rowSpan="2"
      colSpan="2"
      :src="factorySrc"
      :class="{ 'animated-fade': isAnimated }"
    />
    <GameIconImage
      v-if="isActionable || assignedEmployee"
      :src="actionSrc"
      :isActionable="isActionable"
      class="assignment"
      :class="{ 'animated-bounce': isActionable }"
      @tap-game-icon="contextHandler"
    />
    <Image
      v-if="card.boostDrawCount"
      colSpan="2"
      row="1"
      src="~/assets/images/icons/draw-cards.png"
    />
    <Image
      v-if="card.marketBoost"
      row="1"
      colSpan="2"
      :src="
        `~/assets/images/icons/boost-market-${card.marketBoost[0].type}.png`
      "
    />
    <SecondaryResourceCollection
      v-if="card.productionConfig"
      row="1"
      colSpan="2"
      :resources="card.productionConfig.output"
      :isFiltered="true"
      :isBackgroundVisible="false"
    />
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { AssignedEmployee, Card, PlayerActionEnum } from "../../../game/types";
import SecondaryResourceCollection from "../right-drawer/SecondaryResourceCollection.vue";
import GameIconImage from "../reusable/GameIconImage.vue";
import {
  filterCardsToAffordable,
  isActionAvailable,
} from "../../../game/utils";
import { CustomEvents } from "../../../types";
import { handleValidationError } from "../../../utils";
import { MutationEnum } from "../../../store";
import { playerActions } from "../../../game/client";
import ProductionVue from "../modals/Production.vue";
import { Resource } from "../../../game/resources";
import PurchasingVue from "../modals/Purchasing.vue";
import AssignmentConfirmationVue from "../modals/AssignmentConfirmation.vue";
import { cardImageRecords } from "../../../game/cards";
import { LogLevel } from "../../../game/server-action/types";

export default {
  components: { SecondaryResourceCollection, GameIconImage },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    assignedEmployee: {
      type: Object as PropType<AssignedEmployee>,
      required: false,
      default: null,
    },
    isPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    actionSrc(): string {
      if (this.isProductionable) return "~/assets/images/resources/generic.png";
      if (this.isAssignable) return "~/assets/images/employees/generic-man.png";
      if (this.isUnassignable) return "~/assets/images/icons/unassignment.png";
      if (this.isConstructable)
        return "~/assets/images/icons/pay-construction.png";
      if (this.isUnreservable)
        return "~/assets/images/icons/undo-construction.png";
      if (this.assignedEmployee.hasProduced)
        return "~/assets/images/icons/exhausted-production.png";
      return "~/assets/images/employees/generic-man.png";
    },
    isAnimated(): boolean {
      // This is a bit of a hack - when the props change, the component gets re-rendered and so animation will always trigger.
      // If we want the animation class to trigger selectively, we have to manually hook into what we think the animated states are.
      return !this.isPlaceholder || this.isUnreservable;
    },
    isActionable(): boolean {
      return (
        Boolean(
          this.card.productionConfig &&
            (this.isUnassignable || this.isAssignable || this.isProductionable)
        ) ||
        this.isConstructable ||
        this.isUnreservable
      );
    },
    isProductionable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.produceAtFactory
        ) &&
          this.assignedEmployee &&
          !this.assignedEmployee.hasProduced &&
          !this.isPlaceholder
      );
    },
    isUnassignable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.unassignEmployee
        ) &&
          this.assignedEmployee &&
          this.assignedEmployee.unassignmentCost &&
          !this.isPlaceholder
      );
    },
    isUnreservable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.unreserveFactory
        ) && this.isPlaceholder
      );
    },
    isAssignable(): boolean {
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.assignEmployee
        ) &&
          !this.assignedEmployee &&
          this.$store.state.stagedAssignment &&
          !this.isPlaceholder
      );
    },
    isConstructable(): boolean {
      const affordableFactories = filterCardsToAffordable<Card>(
        [this.card],
        (card: Card) => card.cost,
        this.$store.state.playerState.resources
      );
      return Boolean(
        isActionAvailable(
          this.$store.state.playerState.availableActions,
          PlayerActionEnum.buildFactory
        ) &&
          this.isPlaceholder &&
          affordableFactories.length
      );
    },
    factorySrc(): string {
      return cardImageRecords[this.card.type];
    },
  },
  methods: {
    async produceAtFactory(): Promise<void> {
      const {
        resources,
        cardsInHand,
        cardsInPlay,
      } = this.$store.state.playerState;
      const marketResources = [
        ...this.$store.state.gameState.marketCards.map((card) => card.resource),
        ...cardsInPlay.flatMap((card) => card.marketBoost).filter(Boolean),
      ];
      const production:
        | Parameters<typeof playerActions[PlayerActionEnum.produceAtFactory]>[2]
        | null = await this.$showModal(ProductionVue, {
        fullscreen: true,
        animated: true,
        props: {
          assignedEmployee: this.assignedEmployee,
          cardsInHand,
          marketResources,
          resources,
        },
      });
      if (production) {
        this.$emit(
          CustomEvents.PRODUCE_AT_FACTORY,
          PlayerActionEnum.produceAtFactory,
          LogLevel.Debug,
          production
        );
      }
    },
    async unassignEmployee(): Promise<void> {
      // Employees are only unassignable manually if they have a cost. Otherwise they are auto unassigned during the end round.
      // Therefore, to unassign them here, we always show the modal.
      const purchasingResult: {
        resources: Array<Resource>;
      } | null = await this.$showModal(PurchasingVue, {
        fullscreen: true,
        animated: true,
        props: {
          factory: this.assignedEmployee,
          costExtractor: (factory) => factory.unassignmentCost,
          resources: this.$store.state.playerState.resources,
        },
      });
      const unassignmentPayload: Parameters<
        typeof playerActions[PlayerActionEnum.unassignEmployee]
      >[2] = {
        nameOfEmployeeToUnassign: this.assignedEmployee.name,
        resourcePayment: purchasingResult.resources,
      };
      if (purchasingResult) {
        this.$emit(
          CustomEvents.UNASSIGN_EMPLOYEE,
          PlayerActionEnum.unassignEmployee,
          LogLevel.Debug,
          unassignmentPayload
        );
      }
    },
    async buildFactory() {
      const purchasingResult: {
        resources: Array<Resource>;
      } | null = await this.$showModal(PurchasingVue, {
        fullscreen: true,
        animated: true,
        props: {
          factory: this.card,
          costExtractor: (factory) => factory.cost,
          resources: this.$store.state.playerState.resources,
        },
      });

      const buildPayload: Parameters<
        typeof playerActions[PlayerActionEnum.buildFactory]
      >[2] = {
        resources: purchasingResult.resources,
      };
      if (purchasingResult) {
        this.$emit(
          CustomEvents.BUILD_FACTORY,
          PlayerActionEnum.buildFactory,
          LogLevel.Debug,
          buildPayload
        );
      }
    },
    async stageEmployee(): Promise<void> {
      const isConfirmedAssignment = await this.$showModal(
        AssignmentConfirmationVue,
        {
          fullscreen: true,
          animated: true,
          props: {
            efficiency: this.$store.state.stagedAssignment.efficiency,
            employee: this.$store.state.stagedAssignment.employee,
            factory: this.card,
          },
        }
      );

      if (!isConfirmedAssignment) return;

      const assignmentPayload: Parameters<
        typeof playerActions[PlayerActionEnum.assignEmployee]
      >[2] = {
        efficiency: this.$store.state.stagedAssignment.efficiency,
        employee: this.$store.state.stagedAssignment.employee,
        factory: this.card,
      };
      this.$emit(
        CustomEvents.ASSIGN_EMPLOYEE,
        PlayerActionEnum.assignEmployee,
        LogLevel.Debug,
        assignmentPayload
      );
      this.$store.commit(MutationEnum.StageEmployee, null);
    },
    unreserveFactory() {
      this.$emit(
        CustomEvents.UNRESERVE_FACTORY,
        PlayerActionEnum.unreserveFactory,
        LogLevel.Debug
      );
    },
    contextHandler(): Promise<void> {
      if (!this.isActionable) return;

      if (this.isAssignable) {
        this.stageEmployee();
      } else if (this.isUnassignable) {
        this.unassignEmployee();
      } else if (this.isProductionable) {
        this.produceAtFactory();
      } else if (this.isConstructable) {
        this.buildFactory();
      } else if (this.isUnreservable) {
        this.unreserveFactory();
      } else {
        handleValidationError(
          new Error(
            `Worker toggled for ${JSON.stringify(
              this.card
            )}, but this is an ilegal move`
          )
        );
      }
    },
  },
};
</script>

<style scoped>
.placeholder {
  opacity: 0.5;
}

.animated-bounce {
  animation-iteration-count: infinite;
  animation-name: shakeDelay;
  animation-duration: 9s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.assignment {
  height: 150px;
}
</style>
