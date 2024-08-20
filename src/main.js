import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store/store'

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


const app = createApp(App)
app.use(store);
app.use(router);
app.mount('#app')