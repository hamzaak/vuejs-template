import Axios from "axios";
import { BASE_URL } from "@/api/config";
import { TOKEN, USER } from "@/store/constants/storage";

const authApi = {
  setLocalUser(user) {
    sessionStorage.setItem(USER, JSON.stringify(user));
  },
  getLocalUser() {
    return JSON.parse(sessionStorage.getItem(USER) || "{}");
  },
  removeLocalToken() {
    localStorage.removeItem(TOKEN);
  },
  setLocalToken(token) {
    localStorage.setItem(TOKEN, token);
  },
  getLocalToken() {
    return localStorage.getItem(TOKEN) || "";
  },
  login(user) {
    return Axios({ url: `${BASE_URL}/auth/login`, data: user, method: "POST" }).then(res => res.data);
  },
  check() {
    return Axios({ url: `${BASE_URL}/auth/check`, method: "GET" }).then(res => res.data);
  },
  logout() {
    localStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER);
  }
};

export default authApi;
