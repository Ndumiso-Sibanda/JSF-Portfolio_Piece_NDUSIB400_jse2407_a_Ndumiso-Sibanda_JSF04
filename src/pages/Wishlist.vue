<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">My Wishlist</h1>

    <!-- Back Button -->
    <button
      @click="goBack"
      class="mb-4 inline-flex justify-center whitespace-nowrap rounded-lg bg-[#333] px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
    >
      Back
    </button>

    <!-- Remove All Items Button -->
    <button
      v-if="wishlist.length > 0"
      @click="removeAllFromWishlist"
      class="mb-4 inline-flex justify-center whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300"
    >
      Remove All Items
    </button>

    <!-- Filtering and Sorting Controls -->
    <div class="mb-4 flex space-x-4">
      <select v-model="selectedCategory" class="p-2 border border-gray-300 rounded">
        <option value="">All Categories</option>
        <option v-for="category in uniqueCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <select v-model="selectedSort" class="p-2 border border-gray-300 rounded">
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="titleAsc">Title: A to Z</option>
        <option value="titleDesc">Title: Z to A</option>
      </select>
    </div>

    <!-- Wishlist Items or Empty Message -->
    <div v-if="filteredSortedWishlist.length === 0" class="text-center text-gray-500">
      <p>No items in the wishlist.</p>
    </div>
    <div v-else class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-4">
      <div
        v-for="product in filteredSortedWishlist"
        :key="product.id"
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
            <!-- Existing star ratings code -->
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
          </div>

          <div class="flex space-x-2">
          
            <router-link
              :to="'/product/' + product.id"
              class="inline-flex justify-center whitespace-nowrap rounded-lg bg-[#333] px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
            >
              View Details
            </router-link>
            <button
              class="inline-flex justify-center whitespace-nowrap rounded-lg bg-[#333] px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
              @click="removeFromWishlist(product)"
            >
              <span class="text-xl">×</span> 
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
      selectedCategory: '',
      selectedSort: 'priceAsc',
    };
  },
  computed: {
    uniqueCategories() {
      const categories = this.wishlist.map(product => product.category);
      return [...new Set(categories)];
    },
    filteredSortedWishlist() {
      let filtered = this.wishlist;
      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.category === this.selectedCategory);
      }

      switch (this.selectedSort) {
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
  methods: {
    goBack() {
      this.$router.go(-1); 
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = cart.findIndex(item => item.id === product.id);

      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    },
    removeFromWishlist(product) {
      const index = this.wishlist.findIndex(item => item.id === product.id);
      if (index > -1) {
        this.wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
      }
    },
    removeAllFromWishlist() {
      this.wishlist = [];
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    },
  },
};
</script>

