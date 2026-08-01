/* ============================================================
   db.js — 記帳資料層
   ------------------------------------------------------------
   策略：Firestore 優先（有 config 時），localStorage 永遠作為
   本地快取/離線備援。Firestore 寫入失敗或尚未設定時，App 依然
   完全可用，資料存本機。
   ============================================================ */

const ExpenseDB = (() => {
  const LS_KEY = 'travel-expenses-v1';
  let firestore = null;
  let ready = false;

  /* ---------- localStorage ---------- */
  function lsRead() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  }
  function lsWrite(items) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  }

  /* ---------- Firebase init ---------- */
  function init() {
    const cfg = typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG : null;
    if (!cfg || !cfg.apiKey || cfg.apiKey.startsWith('YOUR_')) {
      return { mode: 'local' };
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      firestore = firebase.firestore();
      // 離線持久化（失敗也沒關係，例如多分頁情境）
      firestore.enablePersistence({ synchronizeTabs: true }).catch(() => {});
      ready = true;
      return { mode: 'firestore' };
    } catch (e) {
      console.warn('Firebase 初始化失敗，改用本機模式', e);
      return { mode: 'local' };
    }
  }

  const col = () => firestore.collection(FIRESTORE_COLLECTION);

  /* ---------- CRUD ---------- */

  /** 訂閱所有支出（新→舊），回呼 (items, source) */
  function subscribe(callback) {
    const locals = lsRead();
    callback(locals, 'local'); // 先立即顯示本地資料

    if (!ready) return () => {};

    const un = col().orderBy('ts', 'desc').onSnapshot(
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        lsWrite(items);            // 更新本地快取
        callback(items, 'cloud');
      },
      (err) => {
        console.warn('Firestore 讀取失敗', err);
        callback(lsRead(), 'local-error');
      }
    );
    return un;
  }

  /** 新增一筆支出 */
  async function add(item) {
    item.ts = Date.now();
    if (ready) {
      const ref = await col().add(item);
      return { ...item, id: ref.id };
    }
    item.id = 'local-' + item.ts + '-' + Math.random().toString(36).slice(2, 7);
    const items = lsRead();
    items.unshift(item);
    lsWrite(items);
    return item;
  }

  /** 刪除一筆支出 */
  async function remove(id) {
    if (ready && !String(id).startsWith('local-')) {
      await col().doc(id).delete();
      return;
    }
    lsWrite(lsRead().filter((x) => x.id !== id));
  }

  return { init, subscribe, add, remove, isCloud: () => ready };
})();
