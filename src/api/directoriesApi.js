import Axios from "axios";
import { BASE_URL } from "@/api/config";

const directoriesApi = {
  getAll() {
    return Axios({ url: `${BASE_URL}/directories/getall`, method: "GET" }).then(res => res.data);
  },
  get(id) {
    return Axios({ url: `${BASE_URL}/directories/get`, method: "GET", params: {id: id}}).then(res => res.data);
  },
  add(directory) {
    return Axios({ url: `${BASE_URL}/directories/add`, data: directory, method: "POST" }).then(res => res.data);
  },
  update(directory) {
    return Axios({ url: `${BASE_URL}/directories/update`, data: directory, method: "POST" }).then(res => res.data);
  },
  delete(id) {
    return Axios({ url: `${BASE_URL}/directories/delete`, method: "POST", params: {id: id}}).then(res => res.data);
  }
};

export default directoriesApi;
