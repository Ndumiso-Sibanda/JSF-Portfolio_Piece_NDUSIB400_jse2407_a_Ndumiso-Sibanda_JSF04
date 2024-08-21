import { createStore } from 'vuex';

export default createStore({
  state: {
    selectedCategory: '',
    sortOrder: 'None', // 'None' or 'Default' can be used as the default sort order
  },
  mutations: {
    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },
    setSortOrder(state, sortOrder) {
      state.sortOrder = sortOrder;
    },
  },
  actions: {
    updateSelectedCategory({ commit }, category) {
      commit('setSelectedCategory', category);
    },
    updateSortOrder({ commit }, sortOrder) {
      commit('setSortOrder', sortOrder);
    },
  },
  getters: {
    selectedCategory: (state) => state.selectedCategory,
    sortOrder: (state) => state.sortOrder,
  },
});
