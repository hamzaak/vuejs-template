import Vue from "vue";
import Vuex from "vuex";
import directoryModule from "./modules/directoryModule";
import accountModule from "./modules/accountModule";
import transactionModule from "./modules/transactionModule";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    directoryModule,
    accountModule,
    transactionModule
  },
  strict: debug
});
