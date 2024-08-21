<template>
    <div class="container mx-auto p-4">
      <!-- Back Button -->
      <button @click="goBack" class="back-button mb-4">Back</button>
      
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
      
      <!-- Product Details -->
      <div v-else class="product-details bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4">{{ product.title }}</h1>
        <img :src="product.image" alt="Product image" class="w-full max-w-md mx-auto mb-4" />
        <p class="mb-2">{{ product.description }}</p>
        <p class="mb-2 text-lg font-semibold">Price: ${{ product.price }}</p>
        <p class="mb-2 text-lg">Category: {{ product.category }}</p>
        <p class="mb-2 text-lg">Rating: {{ product.rating.rate }} ({{ product.rating.count }} reviews)</p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        product: {},
        loading: true,
      };
    },
    computed: {
      ...mapGetters(['selectedCategory', 'sortOrder']),
    },
    methods: {
      async fetchProduct() {
        const productId = this.$route.params.id;
        try {
          const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          this.product = await response.json();
        } catch (err) {
          console.error(err.message);
        } finally {
          this.loading = false;
        }
      },
      goBack() {
        this.$router.push('/');
      },
    },
    mounted() {
      this.fetchProduct();
    },
  };
  </script>
  
  <style scoped>
  .back-button {
    background-color: blue;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-block;
    text-align: center;
  }
  .back-button:hover {
    background-color: lightblue;
  }
  
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
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .product-details {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
  }
  </style>
  