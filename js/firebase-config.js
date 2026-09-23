/* ============================================================
  選用 Firestore 記帳同步的 Firebase 設定
  ------------------------------------------------------------
  GitHub Pages 仍然是網站託管平台。Firestore 只用於在你
  自己的不同裝置之間同步記帳資料。

  請用 Firebase Console 內的網頁應用程式設定取代下方佔位值：
  Firebase Console > 專案設定 > 一般 > 你的應用程式。

  apiKey 在瀏覽器應用程式中不是機密。存取控制必須由
  Firestore 安全規則處理（詳見 README）。

  ※ 變數名稱必須是 FIREBASE_CONFIG —— js/db.js 靠這個名字
     決定要不要啟用 Firestore。名稱寫錯的話 App 會靜靜地
     落回 localStorage（顯示「📱 本機儲存」）。
     為了兼容 Firebase Console 複製出來的 `const firebaseConfig`
     寫法，db.js 亦接受 firebaseConfig 這個備選名稱。
  ============================================================ */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBsUFyKXlTurZ43BLc9pjJ95hyqFXqDcck",
  authDomain: "travel-pwa-f6c24.firebaseapp.com",
  projectId: "travel-pwa-f6c24",
  storageBucket: "travel-pwa-f6c24.firebasestorage.app",
  messagingSenderId: "831763074802",
  appId: "1:831763074802:web:351f3c13d886f8450e8a6b"
};

// Firebase Console 的 snippet 用 firebaseConfig 這個名字，一併別名到同一物件
// （避免日後直接貼上 Console 內容時又要改名）
var firebaseConfig = FIREBASE_CONFIG;

const FIRESTORE_COLLECTION = 'expenses';