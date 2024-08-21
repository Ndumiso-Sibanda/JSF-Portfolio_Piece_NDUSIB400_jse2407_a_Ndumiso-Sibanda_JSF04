<template>
  <div id="app">
    <header class="bg-white shadow-md">
      <nav class="container mx-auto p-4 flex items-center justify-between">
        <router-link to="/">
          <button class="flex items-center">
            <img src="/online-shop.png" class="h-8 w-8" alt="SwiftCart Logo" />
            <span class="ml-2 text-xl font-bold text-black">SwiftCart</span>
          </button>
        </router-link>
        <button
          @click="toggleNavbar"
          class="lg:hidden text-black focus:outline-none"
          aria-controls="navbar-dropdown"
          :aria-expanded="isNavbarOpen ? 'true' : 'false'"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          :class="{'block': isNavbarOpen, 'hidden': !isNavbarOpen}"
          class="lg:flex lg:items-center lg:space-x-4 absolute lg:static top-16 left-0 right-0 bg-white lg:bg-transparent lg:shadow-none shadow-md lg:shadow-none"
          id="navbar-dropdown"
        >
          <router-link
            v-if="isLoggedIn"
            to="/wishlist"
            class="relative flex items-center text-gray-800 hover:text-teal-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21.75l-9-9 1.5-1.5 7.5 7.5 7.5-7.5 1.5 1.5-9 9z"
              />
            </svg>
            <div
              v-if="wishlistItemCount"
              class="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-3 h-3 flex items-center justify-center"
            >
              {{ wishlistItemCount }}
            </div>
          </router-link>
          <router-link
            v-if="isLoggedIn"
            to="/cart"
            class="relative flex items-center text-gray-800 hover:text-teal-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.5l.6 3.75h13.5L21 6h1.5v1.5H21l-1.125 6.75H7.5L6.375 7.5H3.75L2.25 3zM6.75 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm12 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
            <div
              v-if="cartItemCount"
              class="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-3 h-3 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </div>
          </router-link>
          <router-link
            v-if="isLoggedIn"
            to="/comparison"
            class="relative flex items-center text-gray-800 hover:text-teal-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 9l3-3 3 3M9 15l3 3 3-3M4.5 12h15"
              />
            </svg>
            <div
              v-if="comparisonItemCount"
              class="absolute top-0 right-0 bg-blue-600 text-white rounded-full text-xs w-3 h-3 flex items-center justify-center"
            >
              {{ comparisonItemCount }}
            </div>
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-gray-800 hover:text-teal-300"
            @click="redirectToLogin('/wishlist')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 12l-3 3 3 3m0-6h13.5m0 0L5.25 15m13.5-3l3-3-3-3"
              />
            </svg>
            Wishlist
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-gray-800 hover:text-teal-300"
            @click="redirectToLogin('/cart')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 12l-3 3 3 3m0-6h13.5m0 0L5.25 15m13.5-3l3-3-3-3"
              />
            </svg>
            Cart
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-gray-800 hover:text-teal-300"
            @click="redirectToLogin('/comparison')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 12l-3 3 3 3m0-6h13.5m0 0L5.25 15m13.5-3l3-3-3-3"
              />
            </svg>
            Comparison
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-gray-800 hover:text-teal-300"
          >
            Login
          </router-link>
          <button
            v-if="isLoggedIn"
            @click="logout"
            class="text-gray-800 hover:text-teal-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isNavbarOpen: false,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "cartItemCount", "wishlistItemCount", "comparisonItemCount"]),
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login"); 
    },
    redirectToLogin(page) {
      alert(`Please log in to access your ${page.slice(1)}.`);
      this.$store.commit("setRedirectPath", page);
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>

@media (max-width: 1024px) {
  #navbar-dropdown {
    transition: max-height 0.3s ease;
  }
  .lg\\:hidden {
    display: block;
  }
}
</style>
