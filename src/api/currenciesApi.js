import Axios from "axios";
import { BASE_URL } from "./config";

const currenciesApi = {
  getAll() {
    return Axios({ url: `${BASE_URL}/currencies/getall`, method: "GET" }).then(res => res.data);
  },
  get(id) {
    return Axios({ url: `${BASE_URL}/currencies/get`, method: "GET", params: {id: id}}).then(res => res.data);
  },
  add(currency) {
    return Axios({ url: `${BASE_URL}/currencies/add`, data: currency, method: "POST" }).then(res => res.data);
  },
  update(currency) {
    return Axios({ url: `${BASE_URL}/currencies/update`, data: currency, method: "POST" }).then(res => res.data);
  },
  delete(id) {
    return Axios({ url: `${BASE_URL}/currencies/delete`, method: "POST", params: {id: id}}).then(res => res.data);
  }
};

export default currenciesApi;