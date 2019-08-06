import Axios from "axios";
import { BASE_URL } from "./config";

const accountsApi = {
  getAll() {
    return Axios({ url: `${BASE_URL}/accounts/getall`, method: "GET" }).then(res => res.data);
  },
  get(id) {
    return Axios({ url: `${BASE_URL}/accounts/get`, method: "GET", params: {id: id}}).then(res => res.data);
  },
  add(account) {
    return Axios({ url: `${BASE_URL}/accounts/add`, data: account, method: "POST" }).then(res => res.data);
  },
  update(account) {
    return Axios({ url: `${BASE_URL}/accounts/update`, data: account, method: "POST" }).then(res => res.data);
  },
  delete(id) {
    return Axios({ url: `${BASE_URL}/accounts/delete`, method: "POST", params: {id: id}}).then(res => res.data);
  }
};

export default accountsApi;
