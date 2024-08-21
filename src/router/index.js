// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'; 
import ProductList from '../components/ProductList.vue';
import ProductDetail from '../pages/ProductDetail.vue';
import Login from '../pages/Login.vue';
import Cart from '../pages/Cart.vue';
import Wishlist from '../pages/Wishlist.vue';
import Comparison from '../pages/ComparisonPage.vue';
import Checkout  from  '../pages/Checkout.vue';

const routes = [
      {
        path: '/',
        name: 'ProductList',
        component: ProductList,
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true,
      },
      {
    path: '/login',   name: 'Login', component: Login,
      },
      {
    path: '/cart', name: 'Cart', component: Cart,
      },
      {
    path: '/wishlist', name: 'Wishlist', component: Wishlist,
      },
     {
    path: '/comparison', name: 'Comparison', component:Comparison
     },
    {
    path: '/checkout', name: 'Checkout', component:Checkout
    },
    ];
    
    const router = createRouter({
      history: createWebHistory(), 
      routes
    });
    
    export default router;
   