import { ServerActionEnum } from "./server-action/types";

export type Message = { subheader?: string; content: string };
export type Notification = { header: string; messages: Array<Message> };

export const notificationConfig: {
  [key in ServerActionEnum]?: Notification;
} = {
  [ServerActionEnum.startRound]: {
    header: "notification.header.newRound",
    messages: [
      {
        subheader: "notification.subheader.discardCards",
        content: "notification.content.discard",
      },
    ],
  },
  [ServerActionEnum.drawStep]: {
    header: "notification.header.drawPhase",
    messages: [
      {
        subheader: "notification.subheader.drawCards",
        content: "notification.content.draw",
      },
      { content: "notification.content.draw2" },
    ],
  },
  [ServerActionEnum.revealMarket]: {
    header: "notification.header.market",
    messages: [
      {
        subheader: "notification.subheader.revealCards",
        content: "notification.content.reveal",
      },
      {
        content: "notification.content.reveal2",
      },
    ],
  },
  [ServerActionEnum.assignWorkers]: {
    header: "notification.header.planning",
    messages: [
      {
        subheader: "notification.subheader.reserveFactory",
        content: "notification.content.reserve",
      },
      {
        subheader: "notification.subheader.assignment",
        content: "notification.content.assignment",
      },
      {
        content: "notification.content.assignment2",
      },
    ],
  },
  [ServerActionEnum.produceStep]: {
    header: "notification.header.production",
    messages: [
      {
        subheader: "notification.subheader.factory",
        content: "notification.content.production",
      },
      {
        content: "notification.content.production2",
      },
      {
        content: "notification.content.production3",
      },
      { content: "notification.content.production4" },
    ],
  },
  [ServerActionEnum.purchaseStep]: {
    header: "notification.header.purchase",
    messages: [
      {
        subheader: "notification.subheader.constructBuilding",
        content: "notification.content.constructBuilding",
      },
      {
        subheader: "notification.subheader.hireEmployee",
        content: "notification.content.hireEmployee",
      },
    ],
  },
  [ServerActionEnum.endRound]: {
    header: "notification.header.endRound",
    messages: [
      {
        subheader: "notification.subheader.endGame",
        content: "notification.content.endGame",
      },
      {
        subheader: "notification.subheader.scoresUpdated",
        content: "notification.content.scoresUpdated",
      },
    ],
  },
};
