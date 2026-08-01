/* ============================================================
  選用 Firestore 記帳同步的 Firebase 設定
  ------------------------------------------------------------
  GitHub Pages 仍然是網站託管平台。Firestore 只用於在你
  自己的不同裝置之間同步記帳資料。

  請用 Firebase Console 內的網頁應用程式設定取代下方佔位值：
  Firebase Console > 專案設定 > 一般 > 你的應用程式。

  apiKey 在瀏覽器應用程式中不是機密。存取控制必須由
  Firestore 安全規則處理。
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