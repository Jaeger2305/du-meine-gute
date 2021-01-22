import Discard from "./Discard.vue";
import Draw from "./Draw.vue";
import FactoryBuilt from "./FactoryBuilt.vue";
import HiredEmployee from "./HiredEmployee.vue";
import MarketOpened from "./MarketOpened.vue";
import MarketClosed from "./MarketClosed.vue";
import PointsUpdate from "./PointsUpdate.vue";
import ProduceAtFactory from "./ProduceAtFactory.vue";
import StartRound from "./StartRound.vue";

import { EventType } from "../../../../game/types";

// These components are referenced dynamically, based on an enum. Hence the unconventional names and index import.

export default {
  [EventType.Discard]: Discard,
  [EventType.Draw]: Draw,
  [EventType.HiredEmployee]: HiredEmployee,
  [EventType.FactoryOpened]: FactoryBuilt,
  [EventType.MarketOpened]: MarketOpened,
  [EventType.MarketClosed]: MarketClosed,
  [EventType.PointsUpdate]: PointsUpdate,
  [EventType.Production]: ProduceAtFactory,
  [EventType.StartRound]: StartRound,
};
