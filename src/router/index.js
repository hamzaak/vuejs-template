import Vue from "vue";
import Router from "vue-router";
import Axios from "axios";
import AuthApi from "@/api/authApi";
import routes from "@/router/routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = AuthApi.getLocalToken();
  
  if (to.path == "/") {
    if (token) {
      next({ path: "/summary" });
    }
  } else {
    if (!token) {
      next({ path: "/" });
    } else {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      AuthApi.check()
        .then(res => {
          // next({ path: "/" });
          next();
        })
        .catch(err => {
          AuthApi.removeLocalToken();
          next({ path: "/" });
        });
    }
  }
  next();
});

export default router;
