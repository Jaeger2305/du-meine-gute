import Vue from "nativescript-vue";
import App from "./components/App.vue";
import VueDevtools from "nativescript-vue-devtools";
const app = require("tns-core-modules/application");
import RadSideDrawerPlugin from "nativescript-ui-sidedrawer/vue";

Vue.registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
);

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

Vue.use(RadSideDrawerPlugin);

import store from "./store";

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";
import GameListItem from "./components/GameListItem.vue";
import Banner from "./components/game/contextual-board/Banner.vue";
import Card from "./components/Card.vue";
import Deck from "./components/game/Deck.vue";
import Assignment from "./components/game/Assignment.vue";
import AvailableActions from "./components/game/AvailableActions.vue";
import PlayerHand from "./components/game/PlayerHand.vue";
import Factories from "./components/game/Factories.vue";
import ReservedFactory from "./components/game/ReservedFactory.vue";
import Resources from "./components/game/Resources.vue";

Vue.registerElement(
  "ShadowedLabel",
  () => require("nativescript-shadowed-label").ShadowedLabel
);

Vue.component("App", App); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("GameListItem", GameListItem); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("Banner", Banner);
Vue.component("Card", Card);
Vue.component("Deck", Deck);
Vue.component("Resources", Resources);
Vue.component("Factories", Factories);
Vue.component("ReservedFactory", ReservedFactory);
Vue.component("Assignment", Assignment);
Vue.component("AvailableActions", AvailableActions);
Vue.component("PlayerHand", PlayerHand);

new Vue({
  store,
  render: (h) => h(App),
  mounted() {
    if (app.android) {
      const activity = app.android.startActivity;
      const win = activity.getWindow();
      win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }
  },
}).$start();
