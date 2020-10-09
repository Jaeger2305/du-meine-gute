import Vue from "nativescript-vue";
import App from "./components/App";
import VueDevtools from "nativescript-vue-devtools";
const app = require("tns-core-modules/application");

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}
import store from "./store";

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";
import GameListItem from "./components/GameListItem.vue";
import Card from "./components/Card.vue";
import Deck from "./components/Deck.vue";
import Discard from "./components/Discard.vue";
Vue.component("GameListItem", GameListItem); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("Card", Card);
Vue.component("Deck", Deck);
Vue.component("Discard", Discard);

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
  mounted() {
    if (app.android) {
      const activity = app.android.startActivity;
      const win = activity.getWindow();
      win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }
  },
}).$start();
