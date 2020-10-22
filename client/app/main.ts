import Vue from "nativescript-vue";
import App from "./components/App.vue";
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
import Deck from "./components/game/Deck.vue";
import Discard from "./components/game/Discard.vue";
import Assignment from "./components/game/Assignment.vue";
import AvailableActions from "./components/game/AvailableActions.vue";
import Employee from "./components/game/Employee.vue";
import EmployeeList from "./components/game/EmployeeList.vue";
import EmployeeDetail from "./components/game/EmployeeDetail.vue";
import Market from "./components/game/Market.vue";
import PlayerHand from "./components/game/PlayerHand.vue";
import Factories from "./components/game/Factories.vue";
import ReservedFactory from "./components/game/ReservedFactory.vue";
import Resources from "./components/game/Resources.vue";
Vue.component("GameListItem", GameListItem); // Locally registering inside of the Lobby didn't seem to work. Maybe it needs a different frame.
Vue.component("Card", Card);
Vue.component("Deck", Deck);
Vue.component("Discard", Discard);
Vue.component("Employee", Employee);
Vue.component("EmployeeList", EmployeeList);
Vue.component("EmployeeDetail", EmployeeDetail);
Vue.component("Resources", Resources);
Vue.component("Factories", Factories);
Vue.component("ReservedFactory", ReservedFactory);
Vue.component("Assignment", Assignment);
Vue.component("AvailableActions", AvailableActions);
Vue.component("Market", Market);
Vue.component("PlayerHand", PlayerHand);

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
