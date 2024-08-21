<template>
  <div class="product-list-container">

    <!-- Filter and Sort Controls -->

    <div class="controls">
      <select v-model="selectedCategory" @change="handleCategoryChange" class="dropdown">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="sortOrder" @change="handleSortOrderChange" class="dropdown">
        <option value="default">Default</option>
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
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <img class="product-image" :src="product.image" :alt="product.title" />
            <div class="product-details">
              <header class="product-header">
                <h2 class="product-title">{{ product.title }}</h2>
              </header>

              <!-- Star Ratings -->

              <div class="ratings">
                <template v-for="index in 5" :key="'rating-' + product.id + '-' + index">
                  <svg
                    v-if="index <= Math.floor(product.rating.rate)"
                    class="star-icon filled"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 18l-1.64-7.03L18 7.19l-7.19-.61L10 0 9.19 6.59 2 7.19l5.46 3.76L5.82 18 10 15.27z"/>
                  </svg>
                  <svg
                    v-else
                    class="star-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 18l-1.64-7.03L18 7.19l-7.19-.61L10 0 9.19 6.59 2 7.19l5.46 3.76L5.82 18 10 15.27z"/>
                  </svg>
                </template>
              </div>

              <div class="product-price">
                <h2>$ {{ product.price }}</h2>
              </div>

              <div class="product-category">
                <span>{{ product.category }}</span>
              </div>

              <div class="product-actions">
                <button class="add-to-cart" @click="addToCart(product)">Add To Cart</button>
                <router-link :to="'/product/' + product.id" class="view-details">
                  View Details
                </router-link>
              </div>

<!-- Confirmation message -->
 
<div ref="confirmationMessage" class="confirmation-message">
  Item added to cart!
</div>
              <div class="product-actions-secondary">
                <button @click="toggleWishlist(product)" class="wishlist-button">
                  <svg
                    :class="{'text-red-500': isInWishlist(product), 'text-gray-300': !isInWishlist(product)}"
                    class="wishlist-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 3a3.5 3.5 0 00-3.5 3.5c0 1.575.625 3.075 1.76 4.138a10.99 10.99 0 002.698 2.09L12 21.2l8.542-8.472a10.99 10.99 0 002.698-2.09A5.015 5.015 0 0021 6.5a3.5 3.5 0 00-3.5-3.5 3.506 3.506 0 00-3.36 2.4A3.506 3.506 0 0012 3.5a3.5 3.5 0 00-3.5 3.5c0 1.575.625 3.075 1.76 4.138a10.99 10.99 0 002.698 2.09L12 21.2l8.542-8.472a10.99 10.99 0 002.698-2.09A5.015 5.015 0 0021 6.5a3.5 3.5 0 00-3.5-3.5z"/>
                  </svg>
                </button>

                <button @click="compareProduct(product)" :class="{ 'faded': isFading }">
                  Compare
                  <svg
                    class="compare-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7H7v10h6m5-10h-3m0 0V3m0 4v14"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cartService from "../cartService";

export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      loading: true,
      error: null,
      selectedCategory: "",
      sortOrder: "default",
      isDarkMode: false,
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
      comparisonList: JSON.parse(localStorage.getItem('comparisonList')) || [],
      isFading: false,
    };
  },

  computed: {
    ...mapGetters(["cartProducts"]),
    cart() {
      return this.cartProducts;
    },
    cartItemCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
  },

  methods: {
    ...mapActions(["updateSelectedCategory", "updateSortOrder"]),

    compareProduct(product) {
      const index = this.comparisonList.findIndex(item => item.id === product.id);
      if (index > -1) {
        this.comparisonList.splice(index, 1);
      } else {
        this.comparisonList.push(product);
      }
      localStorage.setItem('comparisonList', JSON.stringify(this.comparisonList));

     
      this.isFading = true;
      setTimeout(() => {
        this.isFading = false;
      }, 1000); 
    },

    addToCart(item) {
      cartService.addItem(item);
      this.$router.push({ name: "Cart" });
    },

    toggleWishlist(product) {
      const index = this.wishlist.findIndex(item => item.id === product.id);
      if (index > -1) {
        this.wishlist.splice(index, 1);
      } else {
        this.wishlist.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    },

    isInComparisonList(product) {
      return this.comparisonList.some(item => item.id === product.id);
    },

    isInWishlist(product) {
      return this.wishlist.some(item => item.id === product.id);
    },

    async getProducts() {
      try {
        let response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        this.products = await response.json();
        this.getCategories();
        this.loadSavedState();
        this.filterProducts();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    getCategories() {
      this.categories = [
        ...new Set(this.products.map((product) => product.category)),
      ];
    },

    filterProducts() {
      let productsToFilter = [...this.products];

      if (this.selectedCategory !== "") {
        productsToFilter = productsToFilter.filter(
          (product) => product.category === this.selectedCategory
        );
      }

      if (this.sortOrder === "asc") {
        productsToFilter.sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === "desc") {
        productsToFilter.sort((a, b) => b.price - a.price);
      }

      this.filteredProducts = productsToFilter;
    },

    handleCategoryChange() {
      this.updateSelectedCategory(this.selectedCategory);
      this.filterProducts();
    },

    handleSortOrderChange() {
      this.updateSortOrder(this.sortOrder);
      this.filterProducts();
    },

    loadSavedState() {
      this.selectedCategory = this.$store.getters.selectedCategory || "";
      this.sortOrder = this.$store.getters.sortOrder || "default";
    },
  },

  created() {
    this.getProducts();
  },
};
</script>


<style>



.product-list-container {
  background-color: #f5f5f5;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.dropdown {
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
}

.product-card {
  background-color: white;
  border: 1px solid #dcdcdc;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-card:hover {
  transform: translateY(-5px);
}
.product-image {
  width: 50%;
  height: 200px;
  object-fit: center; 
  background-color: #f0f0f0; 

}

.product-details {
  padding: 1.5rem;
}

.product-header {
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
}

.ratings {
  display: flex;
  margin-bottom: 1rem;
}

.star-icon {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.2rem;
  fill: #dcdcdc;
}

.star-icon.filled {
  fill: #ffcc00;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.product-category {
  margin-bottom: 1.5rem;
}

.product-category span {
  background-color: #f0f0f0;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  color: #555;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.add-to-cart,
.view-details {
  padding: 0.7rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart {
  background-color: #1a1a1a;
  color: white;
}

.add-to-cart:hover {
  background-color: #333;
}

.view-details {
  background-color: #1a1a1a;
  color: white;
}

.view-details:hover {
  background-color: #333;
}

.product-actions-secondary {
  display: flex;
  justify-content: space-between;
}

.wishlist-button {
  background: none;
  border: none;
  cursor: pointer;
}

.wishlist-icon {
  width: 24px;
  height: 24px;
}

.text-red-500 {
  color: red;
}

.text-gray-300 {
  color: gray;
}

.faded {
  opacity: 0.5;
}
.compare-icon {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease, opacity 1s ease; 
}

.faded {
  opacity: 0.5;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
