const admin = require('firebase-admin');

try {
  // Initialize Firebase Admin SDK
  const serviceAccount = require('../key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  
  module.exports = db;
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  // Handle the error gracefully, such as throwing an exception or exiting the application
}
