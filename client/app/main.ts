import Vue from "nativescript-vue";
import App from "./components/App.vue";
import VueDevtools from "nativescript-vue-devtools";
const app = require("@nativescript/core/application");
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
import PlayerHand from "./components/game/PlayerHand.vue";
import Factories from "./components/game/Factories.vue";

Vue.component("App", App); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("GameListItem", GameListItem); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("Banner", Banner);
Vue.component("Factories", Factories);
Vue.component("PlayerHand", PlayerHand);

new Vue({
  store,
  render: (h) => h(App),
  mounted() {
    if (app.android) {
      const activity = app.android.startActivity;
      const win = activity.getWindow();
      const FULL_SCREEN_ENUM = 4; // No guidance on how to do this via NS7, lost during migration. Obviously fragile.
      win.addFlags(FULL_SCREEN_ENUM);
    }
  },
}).$start();
