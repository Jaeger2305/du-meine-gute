import * as prompts from "prompts";
import { AssignedEmployee, Card } from "../../types";
import { wood, bread, wheat, cattle, coal } from "../../resources";
import {
  checkOutstandingResources,
  fallbackProduction,
} from "./production-utils";
import { bakery, tannery } from "../cards";

const breadCard: Card = {
  type: "test",
  name: "test-bread",
  resource: wheat,
  output: [bread],
  input: [coal, cattle],
  cost: 2,
};

const boss: AssignedEmployee = {
  name: "assigned",
  assignment: bakery,
  mode: {
    productionCount: 2,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
};

describe("fallback production", () => {
  it("fails production if there aren't enough available cards when using the cards in hand", async () => {
    const result = await fallbackProduction([bread], [tannery], [], boss);
    expect(result.fallbackSuccess).toBe(false);
  });
  it("fails production if too few cards are selected", async () => {
    const cards = [];
    prompts.inject([cards]);
    const result = await fallbackProduction(
      [wheat],
      [tannery, breadCard],
      [wood],
      boss
    );
    expect(result.fallbackSuccess).toBe(false);
  });
  it("fails production if too many cards are selected", async () => {
    const cards = [tannery, breadCard];
    prompts.inject([cards]);
    const result = await fallbackProduction(
      [wheat],
      [tannery, breadCard],
      [wood],
      boss
    );
    expect(result.fallbackSuccess).toBe(false);
  });
  it("succeeds production if there is a discount, but with different combinations of discarded cards", async () => {
    const cards = [breadCard];
    prompts.inject([cards]);
    const result = await fallbackProduction(
      [wheat],
      [tannery, breadCard],
      [wood],
      boss
    );
    expect(result.fallbackSuccess).toBe(true);
  });
  it("returns the indexes of the cards to delete", async () => {
    const cards = [{ ...breadCard, originalIndex: 1 }];
    prompts.inject([cards]);
    const result = await fallbackProduction(
      [wheat],
      [tannery, breadCard],
      [wood],
      boss
    );
    expect(result.cardIndexesToDelete).toEqual([1]);
  });
});

describe("check outstanding resources", () => {
  it("confirms there is enough resources from the input when there is no discount", () => {
    const result = checkOutstandingResources([bread], [bread], 0);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([]);
  });
  it("confirms there is enough resources from the input when there is a discount, even when not needed", () => {
    const result = checkOutstandingResources([bread], [bread], 1);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([]);
  });
  it("confirms there is enough resources from the input when there is a needed discount", () => {
    const result = checkOutstandingResources([bread], [], 1);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([bread]); // maybe this should rename to missing resources
  });
  it("confirms there are not enough resources from the input when there is no discount", () => {
    const result = checkOutstandingResources([bread], [], 0);
    expect(result.isEnoughToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([bread]); // maybe this should rename to missing resources
  });
  it("confirms there are not enough resources from the input even when there is a discount", () => {
    const result = checkOutstandingResources([bread, bread], [], 1);
    expect(result.isEnoughToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([bread, bread]); // maybe this should rename to missing resources
  });
  it("distinguishes between enough and exact input resources with plentiful supplied", () => {
    const result = checkOutstandingResources([bread], [bread, bread, bread], 0);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(false);
  });
  it("matches between enough and exact input resources with exact supplied", () => {
    const result = checkOutstandingResources([bread], [bread], 0);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
  });
});
