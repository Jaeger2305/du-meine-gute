import Vue from "nativescript-vue";
import App from "./components/App.vue";
import VueDevtools from "nativescript-vue-devtools";
const app = require("@nativescript/core/application");
import RadSideDrawerPlugin from "nativescript-ui-sidedrawer/vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
import { i18n } from "./i18n-setup";

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
  i18n,
  store,
  render: (h) => h(App),
  mounted() {
    if (app.android) {
      const activity = app.android.startActivity;
      const win = activity.getWindow();
      var decorView = win.getDecorView();
      try {
        const SYSTEM_UI_FLAG_HIDE_NAVIGATION = 2;
        const SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN = 4;
        const SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION = 512;
        const SYSTEM_UI_FLAG_IMMERSIVE_STICKY = 4098;
        win.addFlags(SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        win.addFlags(SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        win.addFlags(SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        win.addFlags(SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
      } catch {
        console.warn(
          "Failed to set full screen flag - SDK did not recognise constants"
        );
      }
    }
  },
}).$start();
