# Manufacturing Sensor Data Backend

This project is a backend for processing real-time manufacturing sensor data from machines such as welding robots, stamping presses, CNC machines, AGVs, and more. The system provides APIs for receiving and tracking machine data, including the number of products produced.

## Setup

### 1. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```plaintext
# Server configuration
PORT=4000
NODE_ENV=development

# MongoDB connection
MONGO_URI=mongodb+srv://younes:younes@cluster0.8fm7l.mongodb.net/sensorDb?retryWrites=true&w=majority

# JWT configuration
JWT_ACCESS_EXPIRES_IN=3d                 # Access token expiration
JWT_REFRESH_EXPIRES_IN=7d                # Refresh token expiration

# Secret keys for JWT tokens
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
```

### 2.Install Dependencies

Run the following command to install the required packages:

```
npm install
```

### 3. Start the Server

Run the development server with:

```
npm run dev
// The server will start on http://localhost:4000.
```

4. Expose Server for Webhooks (Optional)
   To expose your local server for webhooks or external connections, you can use localtunnel:

```plaintext
lt --port 4000 --subdomain cool-api-project --local-host "localhost" -o --print-requests
```
