<template>
  <div>
    <h1>Comparison Page</h1>
    
    <!-- Back Button -->

    <button @click="goBack" class="back-btn">Back</button>

    <div v-if="comparisonList.length === 0">
      <p>No products to compare.</p>
    </div>
    <div v-else>

      <!-- Clear All Button -->

      <button @click="clearComparisonList" class="clear-btn">Clear All</button>
      
      <!-- Comparison Table -->

      <table v-if="comparisonList.length > 0" class="comparison-table">
        <thead>
          <tr>
            <th v-for="product in comparisonList" :key="product.id">
              <img :src="product.image" :alt="product.title" />
              <h3>{{ product.title }}</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="product in comparisonList" :key="product.id">
              <p>{{ product.description }}</p>
            </td>
          </tr>
          <tr>
            <td v-for="product in comparisonList" :key="product.id">
              <p>Price: ${{ product.price }}</p>
            </td>
          </tr>
          <tr>
            <td v-for="product in comparisonList" :key="product.id">
              <p>Rating: {{ product.rating }}</p>
            </td>
          </tr>
          <tr>
            <td v-for="product in comparisonList" :key="product.id">
              <button @click="removeFromComparison(product)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comparisonList: JSON.parse(localStorage.getItem('comparisonList')) || [],
      maxComparisonItems: 3, 
    };
  },
  methods: {
    removeFromComparison(product) {
      const index = this.comparisonList.findIndex(item => item.id === product.id);
      if (index > -1) {
        this.comparisonList.splice(index, 1);
        localStorage.setItem('comparisonList', JSON.stringify(this.comparisonList));
      }
    },
    clearComparisonList() {
      this.comparisonList = [];
      localStorage.setItem('comparisonList', JSON.stringify(this.comparisonList));
    },
    goBack() {
      window.history.back(); 
    },
  },
  computed: {
    isComparisonFull() {
      return this.comparisonList.length >= this.maxComparisonItems;
    },
  },
  watch: {
    comparisonList(newList) {
      if (newList.length > this.maxComparisonItems) {
        this.comparisonList = newList.slice(0, this.maxComparisonItems);
        localStorage.setItem('comparisonList', JSON.stringify(this.comparisonList));
      }
    },
  },
};
</script>

<style>

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff; 
  border-radius: 8px;
  overflow: hidden;
}

.comparison-table th, .comparison-table td {
  border: 2px solid #000; 
  padding: 16px;
  text-align: center;
  max-width: 20rem; 
}

.comparison-table img {
  max-width: 100px;
  height: auto;
  display: block;
  margin: 0 auto; 
}

.clear-btn, .back-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover, .back-btn:hover {
  background-color: #ff2222;
}

.back-btn {
  margin-right: 16px;
  background-color: #555555; 
}

.back-btn:hover {
  background-color: #333333;
}
</style>