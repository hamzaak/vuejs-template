import Vue from "vue";
import Vuex from "vuex";
import directoryModule from "@/store/modules/directoryModule";
import accountModule from "@/store/modules/accountModule";
import transactionModule from "@/store/modules/transactionModule";

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
