// cartService.js

const CART_KEY = 'cartItems';

function getCartItems() {
  const cartItems = localStorage.getItem(CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addItem(item) {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

  if (itemIndex > -1) {
    cartItems[itemIndex].quantity += 1;  
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  saveCartItems(cartItems);
}

function removeItem(itemId) {
  let cartItems = getCartItems();
  cartItems = cartItems.filter(item => item.id !== itemId);
  saveCartItems(cartItems);
}

function updateItemQuantity(itemId, quantity) {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.id === itemId);

  if (itemIndex > -1) {
    cartItems[itemIndex].quantity = quantity;
    if (cartItems[itemIndex].quantity <= 0) {
      cartItems.splice(itemIndex, 1); 
    }
    saveCartItems(cartItems);
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY); 
}

export default {
  getCartItems,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart, 
};
