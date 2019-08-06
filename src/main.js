import Vue from "vue";
import Axios from "axios";
import VueApexCharts from "vue-apexcharts";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import Mock from "./mock";
import AuthApi from "./api/authApi";

locale.el.pagination.goto = "";
locale.el.pagination.total = "{total} items found";

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

if (process.env.NODE_ENV.trim() === "mock") {
  Mock.bootstrap();
}

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.component("v-icon", Icon);
Vue.use(ElementUI, { locale });

const token = AuthApi.getLocalToken();
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
