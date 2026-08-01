# 旅 · Travel PWA

個人旅行 PWA：每日行程卡片、即時天氣、一鍵導航（自駕友善）、景點攻略標籤、記帳與預算（本機儲存）。

**零建置**：純 HTML/CSS/JS，無框架、無打包工具。改 [js/data.js](js/data.js) 就能換成你自己的旅程。

## 功能

| 功能 | 說明 |
|---|---|
| 每日行程 | 景點 / 餐廳 / 交通 / 住宿分類卡片，手機優先、底部導覽像原生 App |
| 導航按鈕 | 卡片有 `location` 就自動產生 Google Maps 導航連結 |
| 天氣 | 每天卡片上方顯示該城市天氣（Open-Meteo，**免 API key**） |
| 導遊標籤 | 必吃美食（紅）、必點菜單（橙）、必買伴手禮（綠）、預約代號（藍）、景點故事 |
| 資訊頁 | 航班、住宿（含預約代號）、緊急聯絡電話（可點擊撥號） |
| 記帳 | 多幣別選擇、每筆同步顯示港幣換算、分類、預算進度條；資料儲存在瀏覽器 localStorage |
| PWA | 可安裝到主畫面、Service Worker 離線快取、深色模式 |

## 換成你的行程

只要編輯 [js/data.js](js/data.js) 中的 `TRIP` 物件：

- `flights` / `stays` / `contacts` → 資訊頁
- `days[]` → 每日行程；每個 item 的 `type` 決定卡片樣式（`spot` `food` `transport` `stay` `note`）
- item 加 `location: { name: '...', query: '...' }` → 自動出現「📍導航」按鈕
- item 加 `guide: { food, menu, gift, booking, story }` → 自動出現彩色攻略標籤
- `weatherCities` → 每天的 `weatherCity` 對應的經緯度（[latlong.net](https://www.latlong.net/) 可查）
- `budget` / `currencies` → 預算與匯率（預設以 HKD 顯示，`rate` = 1 外幣換多少港幣）

## 部署到 GitHub Pages

這個專案是純靜態 PWA，不需要 build step，首選直接用 GitHub Pages 部署。記帳資料只存在使用者自己的瀏覽器 localStorage，不需要任何後端服務。

### 上傳 GitHub

```bash
git add -A
git commit -m "Travel PWA"
git push origin main
```

### 開啟 GitHub Pages

1. 到 GitHub repo：`https://github.com/salmontim/Travel-PWA`
2. 進入 **Settings → Pages**
3. **Build and deployment** 選：
   - Source：**Deploy from a branch**
   - Branch：**main**
   - Folder：**/ (root)**
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
- 記帳資料儲存在目前瀏覽器的 localStorage；換手機或清除瀏覽器資料後不會自動同步。

## Netlify（後續可選）

測試 GitHub Pages 成功後，可以再把同一個 GitHub repo 接到 Netlify：

1. 到 [Netlify](https://www.netlify.com/) → **Add new site → Import an existing project**
2. 選 GitHub repo：`salmontim/Travel-PWA`
3. Build settings：
   - Build command：留空
   - Publish directory：`.`
4. Deploy

Netlify 會提供 `https://你的站名.netlify.app`。如果之後想用自訂網域、表單、Preview Deploy，Netlify 會比 GitHub Pages 彈性更高。

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
│   ├── db.js               # 記帳資料層（localStorage）
│   └── app.js              # 渲染、天氣、導航、記帳 UI
├── sw.js                   # Service Worker（離線快取）
├── manifest.webmanifest    # PWA 安裝資訊
└── icons/                  # App 圖示
```

## 天氣 API

使用 [Open-Meteo](https://open-meteo.com/)，免費、免 key。預報範圍為未來 16 天；超過範圍的日期會顯示「暫時無法取得」，出發前幾天就會正常。
