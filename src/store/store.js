import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
      comparison: JSON.parse(localStorage.getItem('comparison')) || [],
      selectedCategory: '',
      sortOrder: 'default',
      isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
      redirectPath: '/', 
    };
  },
  getters: {
    cartItemCount(state) {
      return state.cart.length;
    },
    wishlistItemCount(state) {
      return state.wishlist.length;
    },
    comparisonItemCount(state) {
      return state.comparison.length;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    selectedCategory(state) {
      return state.selectedCategory;
    },
    sortOrder(state) {
      return state.sortOrder;
    },
    cartProducts(state) {
      return state.cart;
    },
    wishlistProducts(state) {
      return state.wishlist;
    },
    comparisonProducts(state) {
      return state.comparison;
    },
    redirectPath(state) {
      return state.redirectPath;
    },
    uniqueCategories(state) {
      // Extract unique categories from wishlist products
      const categories = state.wishlist.map(product => product.category);
      return [...new Set(categories)];
    },
    filteredSortedWishlist(state) {
      // Filter and sort wishlist based on selectedCategory and sortOrder
      let filtered = state.wishlist;
      if (state.selectedCategory) {
        filtered = filtered.filter(product => product.category === state.selectedCategory);
      }

      switch (state.sortOrder) {
        case 'priceAsc':
          filtered = filtered.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          filtered = filtered.sort((a, b) => b.price - a.price);
          break;
        case 'titleAsc':
          filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'titleDesc':
          filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }

      return filtered;
    },
  },
  mutations: {
    ADD_TO_CART(state, product) {
      console.log('Adding product to cart:', product); 
      const existingProduct = state.cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        product.quantity = 1;
        state.cart.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    ADD_TO_WISHLIST(state, product) {
      const existingProduct = state.wishlist.find(item => item.id === product.id);
      if (!existingProduct) {
        state.wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },
    REMOVE_FROM_WISHLIST(state, productId) {
      // Remove product from wishlist by its ID
      state.wishlist = state.wishlist.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
    ADD_TO_COMPARISON(state, product) {
      // Add product to comparison list if not already added
      const existingProduct = state.comparison.find(item => item.id === product.id);
      if (!existingProduct) {
        state.comparison.push(product);
        localStorage.setItem('comparison', JSON.stringify(state.comparison));
      }
    },
    REMOVE_FROM_COMPARISON(state, productId) {
      // Remove product from comparison list by its ID
      state.comparison = state.comparison.filter(item => item.id !== productId);
      localStorage.setItem('comparison', JSON.stringify(state.comparison));
    },
    UPDATE_SELECTED_CATEGORY(state, category) {
      // Update the currently selected category for filtering
      state.selectedCategory = category;
    },
    UPDATE_SORT_ORDER(state, order) {
      // Update the sort order for wishlist products
      state.sortOrder = order;
    },
    SET_LOGGED_IN(state, status) {
      // Set login status and persist it in localStorage
      state.isLoggedIn = status;
      localStorage.setItem('isLoggedIn', JSON.stringify(status));
    },
    SET_REDIRECT_PATH(state, path) {
      // Set the path to redirect after login/logout
      state.redirectPath = path;
    },
  },
  actions: {
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product);
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId);
    },
    addToWishlist({ commit }, product) {
      commit('ADD_TO_WISHLIST', product);
    },
    removeFromWishlist({ commit }, productId) {
      commit('REMOVE_FROM_WISHLIST', productId);
    },
    addToComparison({ commit }, product) {
      commit('ADD_TO_COMPARISON', product);
    },
    removeFromComparison({ commit }, productId) {
      commit('REMOVE_FROM_COMPARISON', productId);
    },
    updateSelectedCategory({ commit }, category) {
      commit('UPDATE_SELECTED_CATEGORY', category);
    },
    updateSortOrder({ commit }, order) {
      commit('UPDATE_SORT_ORDER', order);
    },
    setLoggedIn({ commit }, status) {
      commit('SET_LOGGED_IN', status);
    },
    logout({ commit }) {
      commit('SET_LOGGED_IN', false);
      localStorage.removeItem('isLoggedIn');
      commit('SET_REDIRECT_PATH', '/'); 
    },
    setRedirectPath({ commit }, path) {
      commit('SET_REDIRECT_PATH', path);
    },
  },
});
