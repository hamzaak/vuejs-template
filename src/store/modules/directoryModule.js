import * as ACTION from "../constants/actions";

const state = {
  all: []
};

const getters = {};

const actions = {
  set({ commit }, items) {
    commit(ACTION.DIRECTORY_SET, items);
  },
  add({ commit }, item) {
    commit(ACTION.DIRECTORY_ADD, item)
  },
  update({ commit }, item) {
    commit(ACTION.DIRECTORY_UPDATE, item)
  },
  delete({ commit }, id) {
    commit(ACTION.DIRECTORY_DELETE, id)
  }
};

const mutations = {
  set(state, items) {
    state.all = items;
  },
  add(state, item) {
    let _items = state.all;
    _items.push(item);
    _items = _items.sort(function(a,b){ return a.name.localeCompare(b.name)});
    state.all = _items;
  },
  update(state, item) {
    let _items = state.all.filter(x => x.id != item.id);
    _items.push(item);
    _items = _items.sort(function(a,b){ return a.name.localeCompare(b.name)});
    state.all = _items;
  },
  delete(state, id) {
    state.all = state.all.filter(x => x.id != id);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
