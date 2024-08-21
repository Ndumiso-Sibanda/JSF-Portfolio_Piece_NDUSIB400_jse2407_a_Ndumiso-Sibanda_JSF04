const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
const paymentRoutes = require('./router/paymentRoutes'); // Assuming your routes are in this file

const app = express();
app.use(bodyParser.json());

paypal.configure({
  mode: 'sandbox',
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
});

app.use('/api', paymentRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
