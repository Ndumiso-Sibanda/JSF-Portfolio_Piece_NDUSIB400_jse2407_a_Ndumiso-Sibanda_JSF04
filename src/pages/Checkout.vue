<template>
  <div class="checkout-container">
    <h1><strong>Checkout</strong></h1>

    <!-- User Information Form -->

    <div class="user-info">
      <h2><strong>Personal Information</strong></h2>
      <form @submit.prevent="updateUserInfo">
        <label for="name"><strong>Name:</strong></label>
        <input type="text" id="name" v-model="userInfo.name" required />

        <label for="address"><strong>Residential Address:</strong></label>
        <input type="text" id="address" v-model="userInfo.address" required />

        <label for="email"><strong>Email:</strong></label>
        <input type="email" id="email" v-model="userInfo.email" required />

        <button type="submit" class="update-button"><strong>Update Information</strong></button>
      </form>
    </div>

    <!-- Order Summary -->

    <div class="order-summary">
      <h2><strong>Order Summary</strong></h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id" class="order-item">
          <img :src="item.image" alt="Product Image" class="order-item-image" />
          <div class="order-item-info">
            <span class="order-item-name"><strong>{{ item.name }}</strong></span>
            <span class="order-item-price"><strong>$ {{ item.price }} x {{ item.quantity }}</strong></span>
          </div>
        </li>
      </ul>
      <div class="total"><strong>Total: ${{ totalPrice }}</strong></div>
    </div>

    <!-- Payment Method Selection -->

    <div class="payment-method">
      <h2><strong>Select Payment Method</strong></h2>
      <select v-model="selectedPaymentMethod">
        <option value="paypal">PayPal</option>
        <option value="credit_card">Credit Card</option>
        <option value="debit_card">Debit Card</option>
        <option value="apple_pay">Apple Pay</option>
        <option value="google_pay">Google Pay</option>
        <option value="bank_transfer">Bank Transfer</option>
        <option value="crypto">Cryptocurrency</option>
      </select>
    </div>

    <!-- Place Order Button -->

    <button class="checkout-button" @click="placeOrder"><strong>Place Order</strong></button>

    <!-- Confirmation/Error Messages -->

    <div v-if="confirmationMessage" class="confirmation-message">
      <strong>{{ confirmationMessage }}</strong>
    </div>
    <div v-if="errorMessage" class="error-message">
      <strong>{{ errorMessage }}</strong>
    </div>

    <!-- View and Cancel Past Orders -->
     
    <div class="past-orders">
      <h2><strong>Past Orders</strong></h2>
      <ul>
        <li v-for="order in pastOrders" :key="order.id">
          <strong>Order #{{ order.id }} - ${{ order.total }}</strong>
          <button @click="cancelOrder(order.id)"><strong>Cancel</strong></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import cartService from "../cartService";

export default {
  data() {
    return {
      userInfo: {
        name: '',
        address: '',
        email: ''
      },
      cartItems: [],
      totalPrice: 0,
      selectedPaymentMethod: 'paypal',
      confirmationMessage: '',
      errorMessage: '',
      pastOrders: []
    };
  },
  methods: {
    loadCart() {
      this.cartItems = cartService.getCartItems();
      this.totalPrice = this.cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
    updateUserInfo() {
      console.log('User information updated:', this.userInfo);
    },
    async placeOrder() {
      try {
        const response = await fetch('http://localhost:3000/api/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userInfo: this.userInfo,
            items: this.cartItems,
            paymentMethod: this.selectedPaymentMethod,
            total: this.totalPrice
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (this.selectedPaymentMethod === 'paypal') {
            window.location.href = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${data.token}`;
          }

         

          this.confirmationMessage = 'Order placed successfully!';
          this.errorMessage = '';
          this.loadPastOrders(); 
        } else {
          this.errorMessage = `Failed to place order: ${data.message}`;
          this.confirmationMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Error during order placement. Please try again.';
        this.confirmationMessage = '';
        console.error('Order placement error:', error);
      }
    },
    async loadPastOrders() {
      try {
        const response = await fetch('http://localhost:3000/api/past-orders');
        this.pastOrders = await response.json();
      } catch (error) {
        console.error('Failed to load past orders:', error);
      }
    },
    async cancelOrder(orderId) {
      try {
        const response = await fetch(`http://localhost:3000/api/cancel-order/${orderId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.confirmationMessage = 'Order canceled successfully!';
          this.errorMessage = '';
          this.loadPastOrders(); 
        } else {
          this.errorMessage = 'Failed to cancel order.';
          this.confirmationMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Error during order cancellation. Please try again.';
        this.confirmationMessage = '';
        console.error('Order cancellation error:', error);
      }
    }
  },
  mounted() {
    this.loadCart();
    this.loadPastOrders();
  }
};

</script>

<style scoped>
  .checkout-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(33, 33, 33, 0.1);
  }
  
  .user-info, .order-summary, .payment-method, .past-orders {
    margin-bottom: 20px;
  }
  
  input, select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    
  }
  
  button[type="submit"], .checkout-button {
    background-color: #333333;
    color: white;
  }
  
  button[type="submit"]:hover, .checkout-button:hover {
    background-color: #ccc;
  }
  
  .confirmation-message, .error-message {
    margin-top: 20px;
    font-weight: bold;
  }
  
  .confirmation-message {
    color: #333333;
  }
  
  .error-message {
    color: #dc3545;
  }
  
  .order-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .order-item-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 5px;
  }
  
  .order-item-info {
    flex: 1;
  }
  
  .order-item-name {
    display: block;
    font-weight: bold;
  }
  
  .order-item-price {
    color: #333;
  }
  </style>
  