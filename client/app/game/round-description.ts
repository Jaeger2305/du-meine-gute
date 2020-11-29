import { ServerActionEnum } from "./server-action/types";

export type Message = { subheader?: string; content: string };
export type Notification = { header: string; messages: Array<Message> };

export const notificationConfig: {
  [key in ServerActionEnum]?: Notification;
} = {
  [ServerActionEnum.startRound]: {
    header: "New round",
    messages: [
      {
        subheader: "Discard cards",
        content:
          "Don't have the right card? Discard X and draw the same amount",
      },
    ],
  },
  [ServerActionEnum.drawStep]: {
    header: "Draw phase",
    messages: [
      {
        subheader: "Draw cards",
        content: "Draw 2 cards, up to a maximum of 8 cards in hand",
      },
      { content: "More is possible if you have special buildings!" },
    ],
  },
  [ServerActionEnum.revealMarket]: {
    header: "Market",
    messages: [
      {
        subheader: "Reveal cards",
        content:
          "Cards are revealed from the deck until 3 suns are encountered",
      },
      {
        content:
          "These are the available resources for initial production at your factories.",
      },
    ],
  },
  [ServerActionEnum.assignWorkers]: {
    header: "Planning",
    messages: [
      {
        subheader: "Reserve factory",
        content:
          "Choose a card from your hand that you intend to build after production. You don't need to pay yet, and you aren't required to build it",
      },
      {
        subheader: "Assignment",
        content:
          " The starting worker can choose to produce inefficiently in case the market doesn't look good",
      },
      {
        content:
          "Alternatively, they can produce efficiently for an extra production boost!",
      },
    ],
  },
  [ServerActionEnum.produceStep]: {
    header: "Production",
    messages: [
      {
        subheader: "Factory",
        content: "Pick a factory where an employee is assigned",
      },
      {
        content:
          "Use the resources from the market or use a card from your hand if it's not enough",
      },
      {
        content:
          "If the factory can chain resources, you can keep adding cards from your hand, or produced goods from other factories",
      },
      { content: "Keep going until you can afford no more!" },
    ],
  },
  [ServerActionEnum.purchaseStep]: {
    header: "Purchase",
    messages: [
      {
        subheader: "Construct building",
        content: "Pay for the building that was earlier planned",
      },
      {
        subheader: "Hire employee",
        content:
          "Browse the shop for a new employee. Employees require different combinations of factories, to suit their expertise",
      },
    ],
  },
  [ServerActionEnum.endRound]: {
    header: "End round",
    messages: [
      {
        subheader: "End game",
        content:
          "When a player reaches 8 factories, the end game is triggered. The following round, friends and families occupy all the empty factories and all can produce resources. The player with the most points at the end of this round wins the game.",
      },
      {
        subheader: "Scores updated",
        content:
          "1 point for every 5 resource value, points for built factories, points for hired employees",
      },
    ],
  },
};
