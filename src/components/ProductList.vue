<template>
  <div>
    <!-- Filter and Sort Controls -->
    <div class="controls">
      <select v-model="selectedCategory" @change="handleCategoryChange">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="sortOrder" @change="handleSortOrderChange">
        <option value="none">None</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>

    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="grid justify-center">
        <div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-4">
          <router-link
            v-for="product in filteredProducts"
            :key="product.id"
            :to="'/product/' + product.id"
            class="flex flex-col max-h-[130rem] cursor-pointer max-w-80 hover:-translate-y-1 hover:scale-105 duration-300 bg-white border border-slate-200 shadow shadow-slate-950/5 rounded-2xl overflow-hidden"
          >
            <img class="object-contain h-48 mt-3" :src="product.image" :alt="product.title" />
            <div class="flex-1 flex flex-col p-6">
              <header class="mb-2 flex-2">
                <h2 class="text-lg line-clamp-2 font-extrabold leading-snug text-slate-600">
                  {{ product.title }}
                </h2>
              </header>

              <!-- Star Ratings -->
              <div class="flex items-center mb-2">
                <template v-for="index in 5" :key="'rating-' + product.id + '-' + index">
                  <svg
                    v-if="index <= Math.floor(product.rating.rate)"
                    class="w-4 h-4 text-yellow-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 18l-1.64-7.03L18 7.19l-7.19-.61L10 0 9.19 6.59 2 7.19l5.46 3.76L5.82 18 10 15.27z"/>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 18l-1.64-7.03L18 7.19l-7.19-.61L10 0 9.19 6.59 2 7.19l5.46 3.76L5.82 18 10 15.27z"/>
                  </svg>
                </template>
              </div>

              <div class="text-base line-clamp-2 font-extrabold text-slate-500 leading-snug">
                <h2>$ {{ product.price }}</h2>
              </div>

              <div class="flex mt-1 space-x-2 my-3">
                <div class="justify-start flex-1">
                  <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {{ product.category }}
                  </span>
                </div>
                <div class="justify-end space-x-2">
                  <button aria-label="Add to Favourites">
                    <svg
                      class="me-1.5 h-5 w-5 hover:fill-red-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      transform="scale(1.6)"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                class="inline-flex justify-center whitespace-nowrap rounded-lg bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                @click="addToCart(product)"
              >
                Add To Cart
              </button>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    ...mapGetters(['selectedCategory', 'sortOrder']),
  },
  methods: {
    async getProducts() {
      try {
        let response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        this.products = await response.json();
        this.filteredProducts = [...this.products];
        this.getCategories();
        this.filterProducts(); // Apply filters and sorting on load
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    getCategories() {
      this.categories = [...new Set(this.products.map((product) => product.category))];
    },
    filterProducts() {
      let productsToFilter = [...this.products];
      
      if (this.selectedCategory !== '') {
        productsToFilter = productsToFilter.filter(
          (product) => product.category === this.selectedCategory
        );
      }

      switch (this.sortOrder) {
        case 'asc':
          productsToFilter.sort((a, b) => a.price - b.price);
          break;
        case 'desc':
          productsToFilter.sort((a, b) => b.price - a.price);
          break;
        case 'None':
        default:
          break;
      }
      
      this.filteredProducts = productsToFilter;
    },
    handleCategoryChange(event) {
      this.$store.dispatch('updateSelectedCategory', event.target.value);
      this.filterProducts();
    },
    handleSortOrderChange(event) {
      this.$store.dispatch('updateSortOrder', event.target.value);
      this.filterProducts();
    },
    addToCart(product) {
      console.log('Add to cart:', product);
    },
  },
  mounted() {
    this.getProducts();
  },
  watch: {
    selectedCategory() {
      this.filterProducts();
    },
    sortOrder() {
      this.filterProducts();
    },
  },
};
</script>


 <style scoped>
 .loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
}

.spinner {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  .controls {
    margin-bottom: 20px;
  }
  select {
    margin-right: 10px;
    padding: 5px;
  }
  button {
    margin-left: 10px;
  }
</style>
