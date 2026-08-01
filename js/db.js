/* ============================================================
  db.js — 記帳資料層
  ------------------------------------------------------------
  GitHub Pages 靜態部署版本：資料只存 localStorage。
  ============================================================ */

const ExpenseDB = (() => {
  const LS_KEY = 'travel-expenses-v1';

  /* ---------- localStorage ---------- */
  function lsRead() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  }
  function lsWrite(items) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  }

  function init() {
    return { mode: 'local' };
  }

  /* ---------- CRUD ---------- */

  /** 訂閱所有支出（新→舊），回呼 (items, source) */
  function subscribe(callback) {
    callback(lsRead(), 'local');
    return () => {};
  }

  /** 新增一筆支出 */
  async function add(item) {
    item.ts = Date.now();
    item.id = 'local-' + item.ts + '-' + Math.random().toString(36).slice(2, 7);
    const items = lsRead();
    items.unshift(item);
    lsWrite(items);
    return item;
  }

  /** 刪除一筆支出 */
  async function remove(id) {
    lsWrite(lsRead().filter((x) => x.id !== id));
  }

  return { init, subscribe, add, remove };
})();
