<template>
  <Frame id="discard-selection">
    <Page>
      <ActionBar title="Discard cards">
        <ActionItem
          @tap="cancel"
          ios.systemIcon="1"
          ios.position="right"
          android.systemIcon="ic_menu_close_clear_cancel"
          android.position="actionBar"
        />
      </ActionBar>
      <GridLayout columns="*" rows="4*, *" backgroundColor="#3c8888">
        <ScrollView column="0" row="0" orientation="horizontal">
          <StackLayout orientation="horizontal">
            <FlexboxLayout backgroundColor="#3c495e">
              <Card
                v-for="card in displayCards"
                :key="card.name"
                :name="card.name"
                :is-enabled="!card.isInBasket"
                @click="toggleBasket(card)"
              />
            </FlexboxLayout>
          </StackLayout>
        </ScrollView>
        <StackLayout column="0" row="1" orientation="horizontal">
          <Button @tap="reset" text="reset" />
          <Button @tap="submitBasket" text="discard selected cards" />
        </StackLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Card } from "../../game/types";

interface CardForBasket extends Card {
  isInBasket: boolean;
}

export default {
  props: {
    cards: {
      type: Array as PropType<Array<Card>>,
      required: true,
    },
  },
  data(): {
    basket: Array<Card>;
  } {
    return {
      basket: [],
    };
  },
  computed: {
    isSomethingInBasket(): boolean {
      return Boolean(this.basket.length);
    },
    displayCards(): Array<CardForBasket> {
      return this.cards.map((card) => ({
        ...card,
        isInBasket: !!this.basket.find(({ name }) => name === card.name),
      }));
    },
  },
  methods: {
    cancel(): void {
      this.$modal.close(null);
    },
    reset(): void {
      this.basket.splice(0, this.basket.length);
    },
    toggleBasket(cardToToggle: CardForBasket): void {
      if (!cardToToggle.isInBasket) return this.basket.push(cardToToggle);

      const cardIndexInBasket = this.basket.findIndex(
        ({ name }) => name === cardToToggle.name
      );

      this.basket.splice(cardIndexInBasket, 1);
    },
    submitBasket(): void {
      this.$modal.close(this.basket);
    },
  },
};
</script>

<style scoped></style>
