const admin = require("firebase-admin");
const path = require("path");
const { format } = require("util");
const serviceAccount = require("../firebase-config.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "devfest-32d78.appspot.com",
});

const bucket = admin.storage().bucket();

/**
 * Upload file to Firebase under a custom path.
 * @param {Object} file - The file object.
 * @param {String} filePath - The chatId for custom directory.
 */
const uploadFileToFirebase = async (file, filePath) => {
  return new Promise((resolve, reject) => {
    console.log(file); // Log the file object for debugging

    if (!file || !file.name) {
      return reject(new Error("File object or name property is missing."));
    }

    const filename = `${Date.now()}${path.extname(file.name)}`;
    const firebaseFilePath = `uploads/${filePath}/${filename}`;

    const firebaseFile = bucket.file(firebaseFilePath);

    const stream = firebaseFile.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    stream.on("error", (error) => reject(error));

    stream.on("finish", async () => {
      await firebaseFile.makePublic();
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${firebaseFile.name}`
      );
      resolve(publicUrl); // Return the public URL of the uploaded file
    });

    stream.end(file.data); // Send the file buffer to Firebase
  });
};

/**
 * Send Push Notification using Firebase Cloud Messaging (FCM).
 * @param {String} fcmToken - The FCM token of the user/device.
 * @param {String} title - Title of the notification.
 * @param {String} body - Body message of the notification.
 * @param {Object} [data] - Additional data to send with the notification (optional).
 */
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body,
    },
    data, // Optional additional data
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

module.exports = {
  uploadFileToFirebase,
  sendPushNotification,
};
