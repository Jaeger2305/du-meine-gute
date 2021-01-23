import VueI18n from "vue-i18n";

const messages = {
  en: {
    action: {
      end: "END",
      buy: "BUY",
      login: "LOGIN",
      backToLobby: "LOBBY",
      join: "JOIN",
      quickStart: "QUICK START",
      draw: "DRAW",
      confirm: "CONFIRM",
      cancel: "CANCEL",
      reset: "RESET",
    },
    notification: {
      header: {
        newRound: "New round",
        drawPhase: "Draw phase",
        market: "Market",
        planning: "Planning",
        production: "Production",
        purchase: "Purchase",
        endRound: "End round",
      },
      subheader: {
        discardCards: "Discard cards",
        drawCards: "Draw cards",
        revealCards: "Reveal cards",
        reserveFactory: "Reserve factory",
        assignment: "Assignment",
        factory: "Factory",
        constructBuilding: "Construct building",
        hireEmployee: "Hire employee",
        endGame: "End game",
        scoresUpdated: "Scores updated",
      },
      content: {
        discard:
          "Don't have the right card? Discard X and draw the same amount",
        draw: "Draw 2 cards, up to a maximum of 8 cards in hand",
        draw2: "More is possible if you have special buildings!",
        reveal: "Cards are revealed from the deck until 3 suns are encountered",
        reveal2:
          "These are the available resources for initial production at your factories.",
        reserve:
          "Choose a card from your hand that you intend to build after production. You don't need to pay yet, and you aren't required to build it",
        assignment:
          "The starting worker can choose to produce inefficiently in case the market doesn't look good",
        assignment2:
          "Alternatively, they can produce efficiently for an extra production boost!",
        production: "Pick a factory where an employee is assigned",
        production2:
          "Use the resources from the market or use a card from your hand if it's not enough",
        production3:
          "If the factory can chain resources, you can keep adding cards from your hand, or produced goods from other factories",
        production4: "Keep going until you can afford no more!",
        constructBuilding: "Pay for the building that was earlier planned",
        hireEmployee:
          "Browse the shop for a new employee. Employees require different combinations of factories, to suit their expertise",
        endGame:
          "When a player reaches 8 factories, the end game is triggered. The following round, friends and families occupy all the empty factories and all can produce resources. The player with the most points at the end of this round wins the game.",
        scoresUpdated:
          "1 point for every 5 resource value, points for built factories, points for hired employees",
      },
    },
    resource: {
      wool: "wool",
      clay: "clay",
      bread: "bread",
      wheat: "wheat",
      metal: "metal",
      cattle: "cattle",
      leather: "leather",
      coal: "coal",
      plank: "plank",
      placeholder: "placeholder",
      unknown: "unknown",
      glass: "glass",
      barrel: "barrel",
      brick: "brick",
      cloth: "cloth",
      feast: "feast",
      grain: "grain",
      ingot: "ingot",
      meat: "meat",
      shirt: "shirt",
      shoe: "shoe",
      tools: "tools",
      window: "window",
    },
    factory: {
      BAKERY: "bakery",
      BRICK_MAKER: "brick maker",
      BUTCHER: "butcher",
      CATTLE_RANCH: "cattle ranch",
      CHARBURNER: "charburner",
      COOPERAGE: "cooperage",
      FOOD_FACTORY: "food factory",
      GLASSMAKER: "glassmaker",
      IRON_SMELTER: "iron smelter",
      MARKET_OFFICE: "market office",
      MILL: "mill",
      SAWMILL: "sawmill",
      SHOE_MAKER: "shoe maker",
      TAILOR: "tailor",
      TANNERY: "tannery",
      TOOL_MAKER: "tool maker",
      UNKNOWN: "unknown",
      WEAVING_MILL: "weaving mill",
      WINDOW_MAKER: "window maker",
    },
    steps: {
      startRound: "start",
      revealMarket: "reveal market",
      assignEmployees: "assign",
      produce: "produce",
      purchase: "purchase",
      endRound: "round end",
    },
    employee: {
      ACTOR: "actor",
      BANKER: "banker",
      BOSS: "boss",
      BRICK_LAYER: "brick layer",
      BUILDER: "builder",
      INVESTOR: "investor",
      FARMHAND: "farmhand",
      FORESTER: "forester",
      MILL_OWNER: "mill owner",
      OFFICE_APPRENTICE: "office apprentice",
      OFFICE_MANAGER: "office manager",
      OVERSEER: "overseer",
      SAWMILL_MANAGER: "sawmill manager",
      SHOP_OWNER: "shop owner",
      SUPERVISOR: "supervisor",
      TAILOR: "tailor",
      WEAVER: "weaver",
    },
  },
};

// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: "en", // set locale
  messages, // set locale messages
});
