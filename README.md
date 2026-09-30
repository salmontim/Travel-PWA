# 旅 · Travel PWA

個人旅行 PWA：每日行程卡片、即時天氣、一鍵導航（自駕友善）、景點攻略標籤、記帳與預算（Firestore 跨裝置同步）。

**零建置**：純 HTML/CSS/JS，無框架、無打包工具。修改 [js/data.js](js/data.js) 即可換成你自己的旅程。

## 功能

| 功能 | 說明 |
|---|---|
| 每日行程 | 景點 / 餐廳 / 交通 / 住宿分類卡片，手機優先、底部導覽像原生 App |
| 每日 Google 地圖 | 每天行程上方嵌入 Google Maps，顯示當日全部景點路線；「Google Maps 全日路線」按鈕可一鍵開路線（免 API 金鑰） |
| 導航按鈕 | 卡片有 `location` 就自動產生 **Naver 導航**（自駕）＋ **Google 地圖**（出發前查看地址）兩個按鈕 |
| 天氣 | 每天卡片上方顯示該城市天氣（Open-Meteo，**免 API 金鑰**） |
| 導遊標籤 | 必吃美食（紅）、必點菜單（橙）、必買伴手禮（綠）、互動體驗（紫）、預約代號（藍）、景點故事 |
| 資訊頁 | 航班、住宿（含預約代號）、緊急聯絡電話（可點擊撥號） |
| 記帳 | 多幣別選擇（**預設 KRW**）、每筆同步顯示港幣換算、分類、預算進度條；Firestore 跨裝置同步，未設定時自動落回 localStorage |
| 可調式總預算 | 記帳頁「總預算」可直接輸入修改，即時重算進度條／剩餘，超支轉紅；存 localStorage 並同步 Firestore `settings/trip` |
| 消費明細排序／篩選 | 可按**日期（新→舊，預設／舊→新）**或**金額（高→低／低→高）**排序，並可按**分類**篩選；顯示筆數與篩選後合計。以日期排序時每日加**小計標題**。選擇存 localStorage |
| PWA | 可安裝到主畫面、Service Worker 離線快取、深色模式 |

## 換成你的行程

只要編輯 [js/data.js](js/data.js) 中的 `TRIP` 物件：

- `flights` / `stays` / `contacts` → 旅行資訊分頁
- `days[]` → 每日行程；每個項目的 `type` 決定卡片樣式（`spot` `food` `transport` `stay` `note`）
- 行程項目加上 `location: { name: '...', query: '...' }` → 自動出現「Naver 導航」按鈕（可另加 `lat`/`lng` 直開路線規劃）
- 行程項目加上 `lat`/`lng`（經緯度）→ 會標示喺該日嘅 Google 地圖上；有 `lat`/`lng` 嘅地點愈多，地圖路線愈完整（[latlong.net](https://www.latlong.net/) 可查座標）
- 行程項目加上 `guide: { food, menu, gift, booking, story }` → 自動出現彩色攻略標籤
- `weatherCities` → 每天的 `weatherCity` 對應的經緯度（[latlong.net](https://www.latlong.net/) 可查）
- `budget` / `currencies` → 預算與匯率（預設以 HKD 顯示，`rate` = 1 外幣換多少港幣）
- `budget.total` 只是**預設值**：App 記帳頁可隨時調整（存 localStorage ＋ Firestore `settings/trip`，記住要開放 `settings` 規則）
- `defaultExpenseCurrency` → 新增支出時幣別下拉的預設值（現為 `KRW`）；幣別清單第一位就是下拉首選項

## 資料同步：Firestore

Hosting 使用 GitHub Pages；Firestore 只負責記帳資料同步。兩者可以並行，不需要 Firebase Hosting。

未填 Firebase 設定時，App 會自動使用本機 localStorage；填好後，同一個 Firestore 資料集合會在不同 iPhone / 瀏覽器之間同步記帳資料。

### 建立 Firebase / Firestore

1. 到 [Firebase Console](https://console.firebase.google.com/) 建立專案
2. 專案設定 → 一般 → **新增網頁應用程式**
3. 複製 `firebaseConfig`，貼到 [js/firebase-config.js](js/firebase-config.js) 的 `FIREBASE_CONFIG`
   - ⚠️ 變數名稱必須是 `FIREBASE_CONFIG`（`js/db.js` 靠這個名字決定是否啟用 Firestore）。
     名稱寫錯不會報錯，App 會靜靜地落回 localStorage，狀態顯示「📱 本機儲存」。
     為了兼容 Console 複製出來的 `const firebaseConfig`，`db.js` 亦接受 `firebaseConfig` 這個備選名稱。
4. 左側 **Firestore Database** → 建立資料庫
5. 左側 **Firestore Database → 規則** → 貼上下面任一組規則並 **發佈**
   - 預設規則會拒絕所有讀寫（403），未發佈規則的話 App 會顯示
     「⚠ 雲端讀取失敗（多為安全規則）」
6. 資料集合名稱預設是 `expenses`，可在 [js/firebase-config.js](js/firebase-config.js) 的 `FIRESTORE_COLLECTION` 修改

### Firestore 安全規則

> **總預算同步需要額外開放 `settings` 集合。** 下面方案一的規則已包含
> `match /settings/{docId}` 區塊。如果只開放 `/expenses/{docId}`，
> 記帳可以同步但**總預算會寫入失敗**（`permission-denied`），App 會顯示
> 「⚠ 總預算只存本機，未上雲端」，數字仍可調整但只留在該部裝置。

#### 方案一：公開讀寫（最簡單，先求可用）

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{docId} {
      // 任何人（知道 projectId 的人）都可以讀寫
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(
                        ['title','amount','currency','category','date','ts'])
                    && request.resource.data.title is string
                    && request.resource.data.title.size() > 0
                    && request.resource.data.title.size() <= 100
                    && request.resource.data.amount is number
                    && request.resource.data.amount >= 0
                    && request.resource.data.amount <= 1000000
                    && request.resource.data.ts is int;
      allow update: if false;   // 記帳不需要編輯，禁止改寫
      allow delete: if true;
    }

    // 旅程設定（總預算 settings/trip）——只允許改 budgetTotal 一個數值
    match /settings/{docId} {
      allow read: if true;
      allow create, update: if request.resource.data.keys().hasOnly(
                                 ['budgetTotal','updatedAt'])
                             && request.resource.data.budgetTotal is number
                             && request.resource.data.budgetTotal >= 0
                             && request.resource.data.budgetTotal <= 100000000;
      allow delete: if false;
    }
  }
}
```

上面 `settings` 的規則用 `hasOnly(['budgetTotal','updatedAt'])`，即只接受這兩個欄位，
寫入其他東西一律拒絕，避免有人把 `settings/trip` 當成免費儲存空間。

⚠️ **風險（請務必了解）**：`apiKey` 同 `projectId` 會出現喺公開嘅 `js/firebase-config.js`，
所以任何人只要知道 projectId 就可以讀取、新增、刪除你嘅記帳紀錄。以上規則只係
阻擋亂七八糟嘅資料格式同禁止修改，**不能阻止別人讀取或刪除**。

實際建議：
- 記帳「項目」欄唔好寫敏感資料（唔好寫卡號、完整姓名、地址）。
- 發現被亂寫時，去 Console → Firestore → `expenses` 逐筆刪除，或者改名 `FIRESTORE_COLLECTION`
  再發佈新規則。
- 想真正安全就要用方案二。

#### 方案二：電郵密碼登入（真正安全，需要加登入 UI）

1. Console → **Authentication** → 開始使用 → Sign-in method → **電子郵件/密碼** → 啟用
2. **Users** → 新增使用者（你自己的 email + 密碼；兩部手機共用同一組）
3. 規則改為每位用戶只可存取自己的資料：

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/expenses/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid}/settings/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

4. App 需要加入登入畫面（`firebase-auth-compat.js`）並把資料路徑改為
   `users/{uid}/expenses`，目前程式碼**尚未實作**這部分。

#### 只改規則、不重新部署（最快做法）

1. [Firebase Console](https://console.firebase.google.com/) → 選 `travel-pwa-f6c24` 專案
2. 左側 **Firestore Database** → 頂部 **規則** 分頁
3. 貼上上面方案一的完整規則（**記得包含 `settings` 那一段**）
4. 按 **發佈**
5. 回到 App 記帳頁，改一次總預算 → 狀態應該由
   「⚠ 總預算只存本機，未上雲端」變成「☁ Firestore 同步」

`settings` 集合不需要手動建立，第一次寫入時會自動建立文件 `settings/trip`。

### 排查同步問題

| 狀態顯示 | 原因 | 處理 |
|---|---|---|
| 📱 本機儲存 | 未填設定，或變數名稱不是 `FIREBASE_CONFIG` / `firebaseConfig` | 檢查 `js/firebase-config.js` |
| ☁ 連線中… | 已初始化，等第一次雲端回應 | 正常，數秒內會變 |
| ☁ Firestore 同步 | 正常運作 | — |
| ⚠ 總預算只存本機，未上雲端 | 規則未開放 `settings` 集合（`permission-denied`） | 按上面「只改規則、不重新部署」加 `match /settings/{docId}` |
| ⚠ 雲端讀取／寫入失敗（多為安全規則） | 規則未發佈或拒絕存取（403） | 見上方「Firestore 安全規則」 |
| ⚠ 部分紀錄只存本機，未上雲端 | 有紀錄寫入雲端失敗，暫存本機 | 修正規則後重新輸入該筆 |

寫入失敗時 App 會自動暫存本機並保留在畫面上（不會白填），修正規則後不會自動補上傳，
需要重新輸入一次。

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
│   ├── db.js               # 記帳資料層（Firestore ⇄ localStorage）＋ 總預算設定同步
│   └── app.js              # 渲染、天氣、導航、記帳 UI
├── sw.js                   # Service Worker（離線快取）
├── manifest.webmanifest    # PWA 安裝資訊
└── icons/                  # App 圖示
```

## 天氣 API

使用 [Open-Meteo](https://open-meteo.com/)，免費、免金鑰。預報範圍為未來 16 天；超過範圍的日期會顯示「暫時無法取得」，出發前幾天就會正常。
