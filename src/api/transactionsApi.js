import Axios from "axios";
import { BASE_URL } from "./config";

const transactionsApi = {
  getAll(query) {
    return Axios({ url: `${BASE_URL}/transactions/getall`, method: "GET", params: { query: query }}).then(res => res.data);
  },
  get(id) {
    return Axios({ url: `${BASE_URL}/transactions/get`, method: "GET", params: {id: id}}).then(res => res.data);
  },
  add(transaction) {
    return Axios({ url: `${BASE_URL}/transactions/add`, data: transaction, method: "POST" }).then(res => res.data);
  },
  update(transaction) {
    return Axios({ url: `${BASE_URL}/transactions/update`, data: transaction, method: "POST" }).then(res => res.data);
  },
  transfer(item) {
    return Axios({ url: `${BASE_URL}/transactions/transfer`, data: item, method: "POST" }).then(res => res.data);
  },
  delete(id) {
    return Axios({ url: `${BASE_URL}/transactions/delete`, method: "POST", params: {id: id}}).then(res => res.data);
  },
  getSumsByAccount() {
    return Axios({ url: `${BASE_URL}/transactions/getsumsbyaccount`, method: "GET" }).then(res => res.data);
  },
  getSumsByDate() {
    return Axios({ url: `${BASE_URL}/transactions/getsumsbydate`, method: "GET" }).then(res => res.data);
  }
};

export default transactionsApi;
