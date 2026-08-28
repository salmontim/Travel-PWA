# 旅 · Travel PWA

個人旅行 PWA：每日行程卡片、即時天氣、一鍵導航（自駕友善）、景點攻略標籤、記帳與預算（Firestore 跨裝置同步）。

**零建置**：純 HTML/CSS/JS，無框架、無打包工具。修改 [js/data.js](js/data.js) 即可換成你自己的旅程。

## 功能

| 功能 | 說明 |
|---|---|
| 每日行程 | 景點 / 餐廳 / 交通 / 住宿分類卡片，手機優先、底部導覽像原生 App |
| 導航按鈕 | 卡片有 `location` 就自動產生 **Naver 導航**（自駕）＋ **Google 地圖**（出發前查看地址）兩個按鈕 |
| 天氣 | 每天卡片上方顯示該城市天氣（Open-Meteo，**免 API 金鑰**） |
| 導遊標籤 | 必吃美食（紅）、必點菜單（橙）、必買伴手禮（綠）、預約代號（藍）、景點故事 |
| 資訊頁 | 航班、住宿（含預約代號）、緊急聯絡電話（可點擊撥號） |
| 記帳 | 多幣別選擇、每筆同步顯示港幣換算、分類、預算進度條；Firestore 跨裝置同步，未設定時自動落回 localStorage |
| PWA | 可安裝到主畫面、Service Worker 離線快取、深色模式 |

## 換成你的行程

只要編輯 [js/data.js](js/data.js) 中的 `TRIP` 物件：

- `flights` / `stays` / `contacts` → 旅行資訊分頁
- `days[]` → 每日行程；每個項目的 `type` 決定卡片樣式（`spot` `food` `transport` `stay` `note`）
- 行程項目加上 `location: { name: '...', query: '...' }` → 自動出現「Naver 導航」按鈕（可另加 `lat`/`lng` 直開路線規劃）
- 行程項目加上 `guide: { food, menu, gift, booking, story }` → 自動出現彩色攻略標籤
- `weatherCities` → 每天的 `weatherCity` 對應的經緯度（[latlong.net](https://www.latlong.net/) 可查）
- `budget` / `currencies` → 預算與匯率（預設以 HKD 顯示，`rate` = 1 外幣換多少港幣）

## 資料同步：Firestore

Hosting 使用 GitHub Pages；Firestore 只負責記帳資料同步。兩者可以並行，不需要 Firebase Hosting。

未填 Firebase 設定時，App 會自動使用本機 localStorage；填好後，同一個 Firestore 資料集合會在不同 iPhone / 瀏覽器之間同步記帳資料。

### 建立 Firebase / Firestore

1. 到 [Firebase Console](https://console.firebase.google.com/) 建立專案
2. 專案設定 → 一般 → **新增網頁應用程式**
3. 複製 `firebaseConfig`，貼到 [js/firebase-config.js](js/firebase-config.js) 的 `FIREBASE_CONFIG`
4. 左側 **Firestore Database** → 建立資料庫
5. 資料集合名稱預設是 `expenses`，可在 [js/firebase-config.js](js/firebase-config.js) 的 `FIRESTORE_COLLECTION` 修改

### 測試用 Firestore Rules

個人測試可先用以下規則，確認兩部 iPhone 可以同步：

```text
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /expenses/{doc} {
         allow read, write: if true;
      }
   }
}
```

這組規則是公開讀寫，只適合短期測試。正式旅行使用前，建議加入 Firebase Authentication 或 App Check，再限制只有你自己的裝置/帳號可以存取。

## 部署到 GitHub Pages

這個專案是純靜態 PWA，不需要建置步驟，首選直接用 GitHub Pages 部署。Firestore 只作為資料同步服務，不需要 Firebase Hosting。

### 上傳 GitHub

```bash
git add -A
git commit -m "Travel PWA"
git push origin main
```

### 開啟 GitHub Pages

1. 到 GitHub 儲存庫：`https://github.com/salmontim/Travel-PWA`
2. 進入 **Settings → Pages**
3. **Build and deployment（建置與部署）** 選：
   - Source（來源）：**Deploy from a branch（從分支部署）**
   - Branch（分支）：**main**
   - Folder（資料夾）：**/ (root)**
4. 按 **Save**

等待 1-3 分鐘後，GitHub 會產生網址：

```text
https://salmontim.github.io/Travel-PWA/
```

用手機瀏覽器開啟後，選「加到主畫面」即可安裝成 PWA。

### GitHub Pages 注意事項

- `manifest.webmanifest` 的 `start_url` / `scope` 已使用 `./`，可以在 `/Travel-PWA/` 子路徑正常運作。
- Service Worker 只會控制 GitHub Pages 網址底下的 `/Travel-PWA/` 範圍，這是正常行為。
- 每次修改 `js/` 或 `css/` 後，請遞增 [sw.js](sw.js) 裡的 `VERSION`，避免手機繼續讀到舊快取。
- GitHub Pages 只負責 hosting；記帳同步由 Firestore 負責。
- 未設定 Firestore 時，記帳資料只存在目前瀏覽器的 localStorage；換手機或清除瀏覽器資料後不會自動同步。

## Netlify（後續可選）

測試 GitHub Pages 成功後，可以再把同一個 GitHub 儲存庫接到 Netlify：

1. 到 [Netlify](https://www.netlify.com/) → **Add new site → Import an existing project（新增網站 → 匯入現有專案）**
2. 選 GitHub 儲存庫：`salmontim/Travel-PWA`
3. Build settings（建置設定）：
   - Build command（建置指令）：留空
   - Publish directory（發布目錄）：`.`
4. 按 **Deploy（部署）**

Netlify 會提供 `https://你的站名.netlify.app`。如果之後想用自訂網域、表單、預覽部署，Netlify 會比 GitHub Pages 彈性更高。

## 本地預覽

Service Worker 需要 http(s)，不要用 `file://` 直接開：

```bash
npx serve .        # 或
python -m http.server 8080
```

## 結構

```
├── index.html              # 三個分頁的骨架
├── css/style.css           # 日式簡約、手機優先、深色模式
├── js/
│   ├── data.js             # ⭐ 你的行程資料（改這個）
│   ├── firebase-config.js  # ⭐ Firestore 同步設定（改這個）
│   ├── db.js               # 記帳資料層（Firestore ⇄ localStorage）
│   └── app.js              # 渲染、天氣、導航、記帳 UI
├── sw.js                   # Service Worker（離線快取）
├── manifest.webmanifest    # PWA 安裝資訊
└── icons/                  # App 圖示
```

## 天氣 API

使用 [Open-Meteo](https://open-meteo.com/)，免費、免金鑰。預報範圍為未來 16 天；超過範圍的日期會顯示「暫時無法取得」，出發前幾天就會正常。
