import * as prompts from "prompts";
import { wood, bread, wheat, placeholder } from "../../resources";
import {
  checkOutstandingResources,
  fallbackProduction,
} from "./production-utils";
import { tannery, breadCard } from "../../__mocks__/card";
import { bossAssigned } from "../../__mocks__/employee";

describe("fallback production", () => {
  it("fails production if there aren't enough available cards when using the cards in hand", async () => {
    const result = await fallbackProduction(
      [bread],
      [tannery],
      [],
      bossAssigned
    );
    expect(result.fallbackSuccess).toBe(false);
  });
  it("fails production if too few cards are selected", async () => {
    const cards = [];
    prompts.inject([cards]);
    const result = await fallbackProduction(
      [wheat],
      [tannery, breadCard],
      [wood],
      bossAssigned
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
      bossAssigned
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
      bossAssigned
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
      bossAssigned
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
    const result = checkOutstandingResources([wheat], [], 1);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([wheat]); // maybe this should rename to missing resources
  });
  it("rejects enough if there's a discount, but the required is a secondary resource", () => {
    const result = checkOutstandingResources([bread], [], 1);
    expect(result.isEnoughToProduce).toBe(false);
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
  it("rejects production when there are more placeholders required than in the input", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder],
      [wheat],
      0
    );
    expect(result.isEnoughToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([placeholder]);
  });
  it("rejects production when there aren't enough base input resources", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder],
      [bread, bread, bread],
      0
    );
    expect(result.isEnoughToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([placeholder, placeholder]);
  });
  it("accepts production when there are excessive extra base input resources for the required placeholders", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder],
      [wheat, wheat, wheat],
      0
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([]);
  });
  it("accepts production when there are exact extra input resources for the required placeholders", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder],
      [wheat, wheat],
      0
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([]);
  });
  it("accepts production when there are resource savings to cover the required placeholders", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder],
      [wheat],
      1
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([placeholder]);
  });
  it("accepts production when there are big resource savings and no input", () => {
    const result = checkOutstandingResources([placeholder, placeholder], [], 2);
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([placeholder, placeholder]);
  });
  it("accepts production when there are big resource savings with some input", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder, placeholder],
      [wheat],
      2
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([placeholder, placeholder]);
  });
  it("accepts production when there are big resource savings but superfluous secondary input", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder, placeholder],
      [wheat, bread],
      2
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(false);
    expect(result.requiredExtraResources).toEqual([placeholder, placeholder]);
  });
  it("accepts production when there are big resource savings with mixed placeholder/base input", () => {
    const result = checkOutstandingResources(
      [placeholder, placeholder, wheat],
      [wheat],
      2
    );
    expect(result.isEnoughToProduce).toBe(true);
    expect(result.isExactToProduce).toBe(true);
    expect(result.requiredExtraResources).toEqual([placeholder, placeholder]);
  });
});
