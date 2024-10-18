// services/stripeService.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Make sure the key is in your .env

exports.createPaymentIntent = async (amount, currency) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: currency,   // e.g., 'usd'
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};
