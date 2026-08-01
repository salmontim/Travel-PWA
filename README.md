# 旅 · Travel PWA

個人旅行 PWA：每日行程卡片、即時天氣、一鍵導航（自駕友善）、景點攻略標籤、記帳與預算（Firebase Firestore 雲端同步）。

**零建置**：純 HTML/CSS/JS，無框架、無打包工具。改 [js/data.js](js/data.js) 就能換成你自己的旅程。

## 功能

| 功能 | 說明 |
|---|---|
| 每日行程 | 景點 / 餐廳 / 交通 / 住宿分類卡片，手機優先、底部導覽像原生 App |
| 導航按鈕 | 卡片有 `location` 就自動產生 Google Maps 導航連結 |
| 天氣 | 每天卡片上方顯示該城市天氣（Open-Meteo，**免 API key**） |
| 導遊標籤 | 必吃美食（紅）、必點菜單（橙）、必買伴手禮（綠）、預約代號（藍）、景點故事 |
| 資訊頁 | 航班、住宿（含預約代號）、緊急聯絡電話（可點擊撥號） |
| 記帳 | 多幣別換算、分類、預算進度條；Firestore 同步，離線自動落回 localStorage |
| PWA | 可安裝到主畫面、Service Worker 離線快取、深色模式 |

## 換成你的行程

只要編輯 [js/data.js](js/data.js) 中的 `TRIP` 物件：

- `flights` / `stays` / `contacts` → 資訊頁
- `days[]` → 每日行程；每個 item 的 `type` 決定卡片樣式（`spot` `food` `transport` `stay` `note`）
- item 加 `location: { name: '...', query: '...' }` → 自動出現「📍導航」按鈕
- item 加 `guide: { food, menu, gift, booking, story }` → 自動出現彩色攻略標籤
- `weatherCities` → 每天的 `weatherCity` 對應的經緯度（[latlong.net](https://www.latlong.net/) 可查）
- `budget` / `currencies` → 預算與匯率（`rate` = 1 外幣換多少本幣）

## Firebase 設定（記帳同步）

> 沒設也能用 — 會自動跑「本機模式」（localStorage）。

1. 到 [Firebase Console](https://console.firebase.google.com) → **新增專案**（可關掉 Analytics）
2. 專案設定 → 一般 → **新增應用程式 → 網頁**（`</>`）→ 複製 `firebaseConfig`
3. 貼到 [js/firebase-config.js](js/firebase-config.js) 的 `FIREBASE_CONFIG`
4. 左側 **Firestore Database → 建立資料庫** → 選「正式環境模式」→ 地區建議 `asia-east1`
5. **規則** 分頁先暫用（個人測試，之後請收緊）：
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /expenses/{doc} { allow read, write: if true; }
     }
   }
   ```
   ⚠️ 這是公開寫入規則，知道網址的人都能寫。個人一次性旅行可接受；要更安全請加 [Firebase App Check](https://firebase.google.com/docs/app-check) 或匿名驗證。

## 部署到 Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
#   ? Use existing project → 選你的專案
#   ? public directory → . （直接輸入一個點）
#   ? single-page app → No
#   ? overwrite index.html → No
#   ? Set up GitHub Action deploys → 可先 No
firebase deploy
```

部署後會得到 `https://你的專案.web.app`，用手機瀏覽器開啟 → 「加到主畫面」即成為 PWA。

### 上傳 GitHub

```bash
git add -A
git commit -m "Travel PWA"
git push
```

（選配）`firebase init hosting:github` 可設定 push 到 main 就自動部署。

## 本地預覽

Service Worker 需要 http(s)，不要用 `file://` 直接開：

```bash
npx serve .        # 或
python -m http.server 8080
```

## 結構

```
├── index.html              # 三個分頁的骨架
├── css/style.css           # Japandi 極簡、手機優先、深色模式
├── js/
│   ├── data.js             # ⭐ 你的行程資料（改這個）
│   ├── firebase-config.js  # ⭐ Firebase config（改這個）
│   ├── db.js               # 記帳資料層（Firestore ⇄ localStorage）
│   └── app.js              # 渲染、天氣、導航、記帳 UI
├── sw.js                   # Service Worker（離線快取）
├── manifest.webmanifest    # PWA 安裝資訊
└── icons/                  # App 圖示
```

## 天氣 API

使用 [Open-Meteo](https://open-meteo.com/)，免費、免 key。預報範圍為未來 16 天；超過範圍的日期會顯示「暫時無法取得」，出發前幾天就會正常。
