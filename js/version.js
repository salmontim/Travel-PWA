/* ============================================================
   js/version.js — App 版本號（單一來源）
   ------------------------------------------------------------
   這裡是版本號的唯一出處，兩邊都讀同一個檔案：

     1. index.html  → 右上角版本水印顯示 APP_VERSION
     2. sw.js       → importScripts() 後組成 cache 名
                      `travel-pwa-` + APP_VERSION

   ⚠️ 所以每次改動 js/ 或 css/，只要改這裡一個地方就可以。
      唔需要再手動同步 index.html 同 sw.js。

   為何用 var 而唔用 const？
       Service Worker 用 importScripts() 載入這個檔。
       var 會成為 globalThis 的屬性，在 page 同 worker 兩種
       環境都一定讀得到，最穩陣。
   ============================================================ */

var APP_VERSION = 'v40';
