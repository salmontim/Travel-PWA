/* ============================================================
  Firebase config for optional Firestore expense sync
  ------------------------------------------------------------
  GitHub Pages remains the hosting platform. Firestore is used
  only for syncing expense records between your own devices.

  Replace the placeholder values with the web app config from:
  Firebase Console > Project settings > General > Your apps.

  apiKey is not a secret in browser apps. Access control must be
  handled by Firestore Security Rules.
  ============================================================ */

const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const FIRESTORE_COLLECTION = 'expenses';