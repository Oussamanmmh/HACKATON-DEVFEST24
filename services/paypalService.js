// services/paypalService.js
const paypal = require('@paypal/checkout-server-sdk');

const Environment = process.env.PAYPAL_MODE === 'live'
  ? paypal.core.LiveEnvironment
  : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
));

// Create a PayPal order
exports.createOrder = async (totalAmount) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD', // Customize as needed
        value: totalAmount
      }
    }]
  });

  try {
    const order = await paypalClient.execute(request);
    return order.result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Capture the PayPal order (after user approves it)
exports.captureOrder = async (orderId) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    return capture.result;
  } catch (err) {
    throw new Error(err.message);
  }
};
