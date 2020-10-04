import * as prompts from "prompts";
import { BuildingType, Card, ProductionConfig } from "./types";
import { resourceRecords } from "./resources";
import { sortBy, cloneDeep } from "lodash";
import { writeFileSync } from "fs";

async function main() {
  let keepGoing = true;
  // get the base attributes
  const cards: Array<Card> = [];
  while (keepGoing) {
    const card = await getBaseConfig({
      name: undefined,
      resource: undefined,
      cost: undefined,
      points: undefined,
      type: undefined,
      boostDrawCount: undefined,
      marketBoost: undefined,
    });

    // production config
    card.productionConfig = await getProductionConfig();

    cards.push(card);

    ({ value: keepGoing } = await prompts({
      type: "toggle",
      message: `Keep going?`,
      name: "value",
      active: "yes",
      inactive: "no",
    }));
  }
  // sort
  const sortedCards = sortBy(cards, "name");

  // construct into typescript export
  const typescriptCards = convertToTypescript(sortedCards);
  writeFileSync(`cards-${new Date()}.ts`, typescriptCards);

  process.exit();
}

async function getBaseConfig(baseConfig): Promise<Card> {
  // Building name
  ({ value: baseConfig.name } = await prompts({
    type: "text",
    message: `type name`,
    name: "value",
  }));

  // Building type
  const { value: buildingType } = await prompts({
    type: "select",
    message: `type`,
    name: "value",
    choices: Object.entries(BuildingType).map(([k, v]) => ({
      title: v,
      value: k,
    })),
  });
  baseConfig.type = buildingType;

  // Resource type
  const { value: myResource } = await prompts({
    type: "select",
    message: `resource type`,
    name: "value",
    choices: Object.entries(resourceRecords).map(([k, v]) => ({
      title: k,
      value: v,
    })),
  });
  baseConfig.resource = myResource;

  // Cost
  const { value: cost } = await prompts({
    type: "number",
    message: `how much does it cost`,
    name: "value",
  });
  baseConfig.cost = cost;

  // Points
  const { value: chosenPoints } = await prompts({
    type: "number",
    message: `how much is it worth at the end of the game`,
    name: "value",
  });
  baseConfig.points = chosenPoints;

  // isSunny
  const { value: isSunny } = await prompts({
    type: "toggle",
    message: `Is the card sunny?`,
    name: "value",
    active: "yes",
    inactive: "no",
  });
  if (isSunny) baseConfig.isSunny = isSunny;

  // boostDrawCount
  const { value: boostDrawCount } = await prompts({
    type: "number",
    message: `Boost draw count`,
    name: "value",
  });
  if (boostDrawCount) baseConfig.boostDrawCount = boostDrawCount;

  // marketBoost resources
  const { value: marketBoost } = await prompts({
    type: "multiselect",
    message: `Boost market resources`,
    name: "value",
    choices: Object.entries(resourceRecords).map(([k, v]) => ({
      title: k,
      value: v,
    })),
  });
  if (marketBoost && marketBoost.length) baseConfig.marketBoost = marketBoost;

  return baseConfig;
}

async function getProductionConfig(): Promise<ProductionConfig | undefined> {
  // Does it produce ?
  const { value: isProducing } = await prompts({
    type: "toggle",
    message: `Is the card producing?`,
    name: "value",
    active: "yes",
    inactive: "no",
  });
  if (!isProducing) return undefined;

  const productionConfig = {
    output: [],
    input: [],
    chainInput: undefined,
  };
  // Handle input
  let moreInput = true;
  while (moreInput) {
    const { value: input } = await prompts({
      type: "multiselect",
      message: `resources required for input`,
      name: "value",
      choices: Object.entries(resourceRecords).map(([k, v]) => ({
        title: k,
        value: v,
      })),
    });
    if (input && input.length) productionConfig.input.push(...input);
    else moreInput = false;
  }

  // Handle output
  let moreOutput = true;
  while (moreOutput) {
    const { value: output } = await prompts({
      type: "multiselect",
      message: `resources output by the building`,
      name: "value",
      choices: Object.entries(resourceRecords).map(([k, v]) => ({
        title: k,
        value: v,
      })),
    });
    if (output && output.length) productionConfig.output.push(...output);
    else moreOutput = false;
  }

  // Handle chained input
  const { value: isChainable } = await prompts({
    type: "toggle",
    message: `Is the card chainable?`,
    name: "value",
    active: "yes",
    inactive: "no",
  });
  if (!isChainable) return productionConfig;

  productionConfig.chainInput = [];
  let moreChainInput = true;
  while (moreChainInput) {
    const { value: chainInput } = await prompts({
      type: "multiselect",
      message: `which resources are required to chain the input`,
      name: "value",
      choices: Object.entries(resourceRecords).map(([k, v]) => ({
        title: k,
        value: v,
      })),
    });
    if (chainInput && chainInput.length)
      productionConfig.chainInput.push(...chainInput);
    else moreChainInput = false;
  }

  return productionConfig;
}

function convertToTypescript(cards: Array<Card>): string {
  return cards
    .map((card) => {
      const typescriptCard: any = cloneDeep(card);
      typescriptCard.type = `BuildingType.${BuildingType[card.type]}`;
      typescriptCard.resource = card.resource.type;
      typescriptCard.marketBoost = card.marketBoost?.map(
        (resource) => resource.type
      );
      if (card.productionConfig) {
        typescriptCard.productionConfig = {
          input: card.productionConfig.input.map((resource) => resource.type),
          output: card.productionConfig.output.map((resource) => resource.type),
          chainInput: card.productionConfig.chainInput?.map(
            (resource) => resource.type
          ),
        };
      }
      return `export const ${camelize(
        typescriptCard.name
      )}: Card = ${JSON.stringify(typescriptCard)}`;
    })
    .join("\n");
}

function camelize(str) {
  let arr = str.split("-");
  let capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  // ^-- change here.
  let capitalString = capital.join("");

  return capitalString;
}

main();
