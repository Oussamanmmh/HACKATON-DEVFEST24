### main branch : master
### Environment Variables (.env)

To configure the project, create a `.env` file in the root of your project with the following environment variables:

```bash
# Server configuration
PORT=4000
NODE_ENV=development

# MongoDB connection
MONGO_URI=mongodb+srv://younes:younes@cluster0.8fm7l.mongodb.net/sensorDb?retryWrites=true&w=majority

# JWT configuration
JWT_ACCESS_EXPIRES_IN=3d                 # Access token expiration (e.g., 3 days)
JWT_REFRESH_EXPIRES_IN=7d                # Refresh token expiration (e.g., 7 days)

# Secret keys for JWT tokens
JWT_SECRET=b411c485b40b4966f4525d11de3fbdd370eca504693494265f45597edb9012b447e953d857dec02fc711e69767c01b3a530c2bae6bdedd63ee866c3bf259b62c
JWT_REFRESH_SECRET=588c31563bd905cb46a15cca1ad7e83ef9810f4d23943ce65e1bef65ad5b351fe32d0c2442acc3add19ee0b7a58fe95b36ee6a0d502a95dd30abc1b1e60e21c3

# Email configuration (Gmail)
EMAIL_USER=hellalet.younes@gmail.com
EMAIL_PASS=yxmh ovfm pxqo yshi

# Google OAuth configuration
GOOGLE_CLIENT_ID=your-google-client-id

# Apple OAuth configuration
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# Stripe configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# PayPal configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # Use 'live' for production
