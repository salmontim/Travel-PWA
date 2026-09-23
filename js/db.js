/* ============================================================
  db.js — 記帳資料層
  ------------------------------------------------------------
  GitHub Pages 負責託管 PWA。Firestore 是選用功能，只用於
  跨裝置同步記帳資料。未設定 Firebase config 時，App 會
  自動改用 localStorage。
  ============================================================ */

const ExpenseDB = (() => {
  const LS_KEY = 'travel-expenses-v1';
  let firestore = null;
  let ready = false;

  /* ---------- 本機儲存（localStorage） ---------- */
  function lsRead() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  }
  function lsWrite(items) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  }

  function config() {
    // 主要名稱：FIREBASE_CONFIG；兼容 Firebase Console snippet 的 firebaseConfig
    if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG) return FIREBASE_CONFIG;
    if (typeof firebaseConfig !== 'undefined' && firebaseConfig) return firebaseConfig;
    return null;
  }

  function init() {
    const cfg = config();
    if (!cfg || !cfg.apiKey || String(cfg.apiKey).startsWith('YOUR_')) {
      console.info('[記帳] 未設定 Firebase config → 使用 localStorage 本機儲存');
      return { mode: 'local' };
    }
    if (typeof firebase === 'undefined') {
      console.warn('[記帳] Firebase SDK 未載入 → 使用 localStorage；請檢查 index.html 的 SDK script 標籤');
      return { mode: 'local' };
    }

    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      firestore = firebase.firestore();
      firestore.enablePersistence({ synchronizeTabs: true }).catch(() => {});
      ready = true;
      console.info('[記帳] Firestore 已啟用：project=' + cfg.projectId +
                   ' collection=' + FIRESTORE_COLLECTION);
      return { mode: 'firestore' };
    } catch (e) {
      console.warn('Firestore 初始化失敗，改用本機儲存', e);
      return { mode: 'local' };
    }
  }

  const col = () => firestore.collection(FIRESTORE_COLLECTION);

  /* ---------- 錯誤回報 ---------- */
  let onError = null;
  function setErrorHandler(fn) { onError = fn; }
  function reportError(where, e) {
    const code = (e && e.code) ? e.code : 'unknown';
    console.warn(`[記帳] Firestore ${where} 失敗（${code}），已改用本機儲存`, e);
    if (onError) onError(where, code, e);
  }

  function localId(ts) {
    return 'local-' + ts + '-' + Math.random().toString(36).slice(2, 7);
  }

  /** 寫入本機（新增） */
  function localAdd(item) {
    item.id = localId(item.ts);
    item.pendingCloud = true;   // 標記：未同步上雲端
    const items = lsRead();
    items.unshift(item);
    lsWrite(items);
    return item;
  }

  /* ---------- 新增 / 讀取 / 刪除 ---------- */

  /** 訂閱所有支出（新→舊），回呼格式：(items, source)
   *  source: local | cloud | local-error | cloud-partial | write-error */
  function subscribe(callback) {
    callback(lsRead(), 'local');

    if (!ready) return () => {};

    return col().orderBy('ts', 'desc').onSnapshot(
      (snap) => {
        const cloud = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const cloudIds = new Set(cloud.map((x) => x.id));
        // 雲端寫入失敗而暫存本機的紀錄要保留，否則會被雲端快照覆蓋消失
        const pending = lsRead().filter((x) => x.pendingCloud && !cloudIds.has(x.id));
        const items = [...pending, ...cloud].sort((a, b) => (b.ts || 0) - (a.ts || 0));
        lsWrite(items);
        callback(items, pending.length ? 'cloud-partial' : 'cloud');
      },
      (err) => {
        console.warn('Firestore 讀取失敗，顯示本機快取', err);
        callback(lsRead(), 'local-error');
      }
    );
  }

  /** 新增一筆支出。回傳值帶 _cloud:true 代表已寫入雲端 */
  async function add(item) {
    item.ts = Date.now();

    if (ready) {
      try {
        const ref = await col().add(item);
        return { ...item, id: ref.id, _cloud: true };
      } catch (e) {
        // 權限錯誤、離線、配額等：不要讓使用者白填，改存本機
        reportError('寫入', e);
        return localAdd(item);
      }
    }

    return localAdd(item);
  }

  /** 刪除一筆支出 */
  async function remove(id) {
    if (ready && !String(id).startsWith('local-')) {
      try {
        await col().doc(id).delete();
        return { _cloud: true };
      } catch (e) {
        reportError('刪除', e);
        lsWrite(lsRead().filter((x) => x.id !== id));
        return { _cloud: false };
      }
    }

    lsWrite(lsRead().filter((x) => x.id !== id));
    return { _cloud: false };
  }

  return { init, subscribe, add, remove, setErrorHandler, isCloud: () => ready };
})();
