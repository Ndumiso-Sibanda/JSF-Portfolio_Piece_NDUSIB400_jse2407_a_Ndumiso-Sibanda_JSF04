<template>
  <div class="cart-container">
    <h2 class="cart-header">Shopping Cart</h2>

    <!-- Back Button -->
    <button class="back-button" @click="goBack">← Back</button>

    <div v-if="cartItems.length === 0" class="empty-cart-message">
      Your cart is empty.
    </div>
    <div v-else>
      <ul class="cart-items-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="cart-item-details">
            <img :src="item.image" alt="Product Image" class="cart-item-image" />
            <div class="cart-item-info">
              <span class="cart-item-name">{{ item.name }}</span>
              
              <!-- Quantity Update Section -->
              <div class="quantity-update">
                <button @click="decreaseQuantity(item)" class="quantity-button">-</button>
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item)" class="quantity-input" min="1" />
                <button @click="increaseQuantity(item)" class="quantity-button">+</button>
              </div>
              
              <span class="cart-item-price">$ {{ item.price }} × {{ item.quantity }}</span>
            </div>
          </div>
          <span @click="removeItem(item.id)" class="remove-button">×</span>
        </li>
      </ul>

      <button class="remove-all-button" @click="removeAllItems">Remove All Items</button>

      <div class="cart-total">
        <span><strong>Total:</strong></span>
        <span class="total-price">$ {{ totalPrice }}</span>
      </div>

      <button class="checkout-button" @click="proceedToCheckout">Proceed To Checkout</button>
    </div>
  </div>
</template>

<script>
import cartService from "../cartService";

export default {
  data() {
    return {
      cartItems: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
  },
  methods: {
    loadCart() {
      this.cartItems = cartService.getCartItems();
      this.updateCartItemCount();
    },
    removeItem(itemId) {
      cartService.removeItem(itemId);
      this.loadCart();
    },
    removeAllItems() {
      cartService.clearCart(); 
      this.loadCart(); 
    },
    goBack() {
      this.$router.go(-1); 
    },
    updateCartItemCount() {
      this.$emit("update-item-count", this.cartItems.length);
    },
    proceedToCheckout() {
      this.$router.push('/checkout'); 
    },
    
    // New methods for updating quantity
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.updateQuantity(item);
      }
    },
    increaseQuantity(item) {
      item.quantity++;
      this.updateQuantity(item);
    },
    updateQuantity(item) {
      cartService.updateItemQuantity(item.id, item.quantity);
      this.loadCart();
    },
  },
  mounted() {
    this.loadCart();
  },
};
</script>




<style>

.quantity-update {
  display: flex;
  align-items: center;
}

.quantity-button {
  width: 30px;
  height: 30px;
  background-color: #ddd;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 5px;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.cart-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cart-header {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 12px 24px;
  background-color: #333; 
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #444;
}

.empty-cart-message {
  font-size: 1.8rem;
  text-align: center;
  color: #666;
}

.cart-items-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.cart-item-details {
  display: flex;
  align-items: center;
}

.cart-item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-name {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.cart-item-price {
  display: block;
  font-size: 1rem;
  color: #777;
}

.remove-button {
  font-size: 1.5rem;
  color: #dc3545; 
  cursor: pointer;
  transition: color 0.3s;
}

.remove-button:hover {
  color: #c82333; 
}

.remove-all-button {
  display: block;
  width: 20%;
  padding: 12px;
  margin-top: 20px;
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  padding: center;
}

.remove-all-button:hover {
  background-color: #d32f2f;
}

.cart-total {
  margin-top: 20px;
  font-size: 1.2rem;
  text-align: right;
  font-weight: 600;
  color: #333;
}

.total-price {
  font-size: 1.5rem;
  color: #000;
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.checkout-button:hover {
  background-color: #218838;
}
</style>
