/* ============================================================
   Firebase 設定
   ------------------------------------------------------------
   1. 到 https://console.firebase.google.com 建立專案
   2. 專案設定 → 一般 → 新增「網頁應用程式」→ 複製 config 貼到下面
   3. Firestore Database → 建立資料庫（正式環境模式即可）
   4. Firestore 規則範例（個人使用、請盡快限制）：
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /expenses/{doc} {
              allow read, write: if true;   // ⚠️ 公開寫入，僅供個人測試
            }
          }
        }
   5. 部署到 Firebase Hosting 後，請把規則收緊
      （例如加上 App Check 或簡易密碼閘門）。
   ------------------------------------------------------------
   apiKey 不是機密（會出現在前端），安全性由 Firestore Rules 把關。
   ============================================================ */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/* Firestore collection 名稱（換一個就等於換一本新帳本） */
const FIRESTORE_COLLECTION = "expenses";
