import * as ACTION from "@/store/constants/actions";

const state = {
  all: []
};

const getters = {};

const actions = {
  set({ commit }, items) {
    commit(ACTION.TRANSACTION_SET, items);
  }
};

const mutations = {
  set(state, items) {
    state.all = items;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
