const appleSignin = require('apple-signin-auth');

const verifyAppleToken = async (idToken) => {
  const payload = await appleSignin.verifyIdToken(idToken, {
    audience: process.env.APPLE_CLIENT_ID,
    nonce: 'NONCE', // Optional
  });
  
  return {
    email: payload.email || '', // Apple may not return email
    name: payload.name || '',
    appleId: payload.sub, // Apple user ID
  };
};

module.exports = { verifyAppleToken };
