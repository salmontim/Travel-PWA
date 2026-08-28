/* ============================================================
   app.js — UI 渲染、天氣、導航、記帳
   ============================================================ */

(() => {
  'use strict';

  /* ================= 底部導覽列 ================= */
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === btn.dataset.view));
      window.scrollTo({ top: 0 });
    });
  });

  /* ================= 標頭 ================= */
  document.getElementById('trip-title').textContent = TRIP.title;
  document.getElementById('trip-dates').textContent = TRIP.subtitle;

  /* ================= 工具 ================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /**
   * Naver Map 導航連結（濟州自駕導航用）
   * - 有 lat/lng 時：直接開「出發地 → 目的地」路線
   * - 沒有經緯度時：以韓文關鍵字搜尋，點選結果即可規劃路線
   */
  const navUrl = (loc) => {
    const q = encodeURIComponent(loc.query || loc.name);
    if (loc.lat && loc.lng) {
      return `https://m.map.naver.com/mapLink?menu=route&mapType=0&pathType=0` +
             `&destName=${q}&destLng=${loc.lng}&destLat=${loc.lat}`;
    }
    return 'https://map.naver.com/p/search/' + q;
  };

  /**
   * Google Maps 地點捷徑（出發前查看景點地址用；
   * 南韓境內 Google 不支援實際駕車導航，僅作地址查詢）
   */
  const googleUrl = (loc) =>
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(loc.query || loc.name);

  /** 地圖釘圖示（導航按鈕用） */
  const PIN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/>
        <circle cx="12" cy="10" r="2.6"/>
      </svg>`;

  /** 地點按鈕組：Naver 導航（自駕）＋ Google 地圖（出發前查看地址） */
  const navActions = (loc) => `
    <div class="card-actions">
      <a class="btn-nav" href="${navUrl(loc)}" target="_blank" rel="noopener">
        <span class="pin">${PIN_SVG}</span>Naver 導航
      </a>
      <a class="btn-nav btn-google" href="${googleUrl(loc)}" target="_blank" rel="noopener">
        <span class="pin">${PIN_SVG}</span>Google 地圖
      </a>
    </div>`;

  /* ================= 每日路線地圖（嵌入 Google Maps 顯示真實地名；Naver Map 開新視窗） ================= */
  /** 收集當日有經緯度嘅地點（有 lat/lng 先會標示喺地圖上） */
  const dayPins = (day) => day.items
    .filter((it) => it.location && it.location.lat && it.location.lng)
    .map((it) => ({
      name: it.location.name,
      query: it.location.query || it.location.name,
      lat: it.location.lat,
      lng: it.location.lng
    }));

  /** Google 搜尋用地名（加「제주」後綴減少歧義） */
  const gq = (p) => (p.query.includes('제주') ? p.query : `${p.query} 제주`);

  /** Google Maps 全日路線網址（開 Google Maps app／網頁，用真實地名） */
  const googleRouteUrl = (day) =>
    'https://www.google.com/maps/dir/' + dayPins(day).map((p) => `${p.lat},${p.lng}`).join('/');

  /** Naver Map 全日路線網址（多站 directions，開新視窗） */
  const naverRouteUrl = (day) => {
    const pins = dayPins(day);
    if (!pins.length) return '#';
    if (pins.length === 1) {
      return `https://map.naver.com/v5/search/${encodeURIComponent(pins[0].query)}`;
    }
    const seg = pins.map((p) => `${p.lng},${p.lat}`);
    const start = seg[0];
    const end = seg[seg.length - 1];
    const via = seg.slice(1, -1).map((s) => `/-/${s}`).join('');
    return `https://map.naver.com/v5/directions/${start}/${end}${via}`;
  };

  /** 每日路線地圖卡片：嵌入 Google Maps（真實地名），加 Naver／Google 路線按鈕 */
  const dayMapHtml = (day) => {
    const pins = dayPins(day);
    if (!pins.length) return '';
    let src;
    if (pins.length === 1) {
      src = `https://maps.google.com/maps?q=${encodeURIComponent(gq(pins[0]))}&z=14&output=embed`;
    } else {
      src = 'https://maps.google.com/maps?saddr=' + encodeURIComponent(gq(pins[0])) +
            '&daddr=' + pins.slice(1).map((p) => encodeURIComponent(gq(p))).join('+to:') +
            '&output=embed';
    }
    return `
      <div class="day-map">
        <div class="day-map-head">
          <span class="day-map-title">📌 本日路線地圖</span>
          <span class="day-map-actions">
            <a class="btn-map btn-google" href="${googleRouteUrl(day)}" target="_blank" rel="noopener">Google 路線</a>
            <a class="btn-map btn-naver" href="${naverRouteUrl(day)}" target="_blank" rel="noopener">Naver Map 全日路線</a>
          </span>
        </div>
        <div class="day-map-frame">
          <iframe src="${src}" loading="lazy" allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  title="本日路線地圖"></iframe>
        </div>
      </div>`;
  };

  const TYPE_META = {
    spot:      { badge: '景點', cls: 'card--spot' },
    food:      { badge: '餐廳', cls: 'card--food' },
    transport: { badge: '交通', cls: 'card--transport' },
    stay:      { badge: '住宿', cls: 'card--stay' },
    note:      { badge: '備忘', cls: 'card--note' }
  };

  const GUIDE_TAGS = [
    ['food',    'food',    '必吃美食'],
    ['menu',    'menu',    '必點菜單'],
    ['gift',    'gift',    '必買伴手禮'],
    ['booking', 'booking', '預約代號'],
    ['story',   null,      null]   // 景點故事獨立渲染
  ];

  /* ================= 行程渲染 ================= */
  function guideHtml(guide) {
    if (!guide) return '';
    let rows = '';
    for (const [key, cls, label] of GUIDE_TAGS) {
      if (!guide[key]) continue;
      if (key === 'story') {
        rows += `<div class="tag-row"><span class="tag-label" style="background:var(--paper-2);color:var(--ink-soft)">景點故事</span><span class="tag-value">${guide.story}</span></div>`;
      } else {
        rows += `<div class="tag-row"><span class="tag-label ${cls}">${label}</span><span class="tag-value">${guide[key]}</span></div>`;
      }
    }
    return rows ? `<div class="guide-section">${rows}</div>` : '';
  }

  function itemCard(item) {
    const meta = TYPE_META[item.type] || TYPE_META.note;
    const nav = item.location ? navActions(item.location) : '';
    return `
      <article class="card ${meta.cls}">
        <div class="card-head">
          <span class="card-type-badge">${meta.badge}</span>
          <h3>${esc(item.title)}</h3>
          ${item.time ? `<span class="card-time">${esc(item.time)}</span>` : ''}
        </div>
        ${item.desc ? `<p class="card-desc">${item.desc}</p>` : ''}
        ${guideHtml(item.guide)}
        ${nav}
      </article>`;
  }

  function weatherBarHtml(day) {
    return `
      <div class="weather-bar loading" id="weather-${day.date}">
        <div class="w-icon">⛅</div>
        <div class="w-main">
          <div class="w-temp">—</div>
          <div class="w-desc">天氣載入中…</div>
        </div>
        <div class="w-loc"></div>
      </div>`;
  }

  function renderDays() {
    const sel = document.getElementById('day-selector');
    sel.innerHTML = TRIP.days.map((d, i) => {
      const md = d.date.slice(5).replace('-', '/');
      const wd = '日一二三四五六'[new Date(d.date + 'T00:00:00').getDay()];
      return `<button class="day-chip" role="tab" data-idx="${i}">
                <span class="chip-date">${md}</span> (${wd}) ${d.label}
              </button>`;
    }).join('');

    // 預設選到今天（若在旅程期間內），否則選第一天
    const today = new Date();
    const tStr = today.toISOString().slice(0, 10);
    let idx = TRIP.days.findIndex((d) => d.date === tStr);
    if (idx < 0) idx = 0;
    selectDay(idx);

    sel.addEventListener('click', (e) => {
      const chip = e.target.closest('.day-chip');
      if (chip) selectDay(+chip.dataset.idx);
    });
  }

  function selectDay(idx) {
    const day = TRIP.days[idx];
    document.querySelectorAll('.day-chip').forEach((c, i) =>
      c.classList.toggle('active', i === idx));
    // 讓選中的日期膠囊按鈕滾入視野
    const activeChip = document.querySelectorAll('.day-chip')[idx];
    activeChip?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });

    document.getElementById('day-content').innerHTML = `
      ${weatherBarHtml(day)}
      ${dayMapHtml(day)}
      <div class="day-heading">
        <h2>${day.label} · ${esc(day.theme)}</h2>
        <div class="day-theme">${day.date}</div>
      </div>
      ${day.items.map(itemCard).join('')}
    `;
    loadWeather(day);
  }

  /* ================= 天氣（Open-Meteo，免 API 金鑰） ================= */
  const WMO = {
    0: ['☀️', '晴朗'], 1: ['🌤', '大致晴朗'], 2: ['⛅', '多雲'], 3: ['☁️', '陰'],
    45: ['🌫', '霧'], 48: ['🌫', '霧凇'],
    51: ['🌦', '毛毛雨'], 53: ['🌦', '毛毛雨'], 55: ['🌧', '毛毛雨'],
    56: ['🌧', '凍雨'], 57: ['🌧', '凍雨'],
    61: ['🌧', '小雨'], 63: ['🌧', '中雨'], 65: ['🌧', '大雨'],
    66: ['🌧', '凍雨'], 67: ['🌧', '凍雨'],
    71: ['🌨', '小雪'], 73: ['🌨', '中雪'], 75: ['❄️', '大雪'], 77: ['🌨', '雪粒'],
    80: ['🌦', '陣雨'], 81: ['🌧', '陣雨'], 82: ['⛈', '強陣雨'],
    85: ['🌨', '陣雪'], 86: ['🌨', '強陣雪'],
    95: ['⛈', '雷雨'], 96: ['⛈', '雷雨伴冰雹'], 99: ['⛈', '強雷雨']
  };

  async function loadWeather(day) {
    const el = document.getElementById('weather-' + day.date);
    if (!el) return;
    const city = TRIP.weatherCities[day.weatherCity];
    if (!city) { el.style.display = 'none'; return; }

    try {
      const tz = 'auto';
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
        `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
        `&start_date=${day.date}&end_date=${day.date}&timezone=${tz}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('weather http ' + res.status);
      const j = await res.json();

      const isTripDay = j.daily && j.daily.time && j.daily.time.length;
      let icon, desc, tempHtml;
      const now = new Date().toISOString().slice(0, 10);

      if (day.date === now && j.current) {
        [icon, desc] = WMO[j.current.weather_code] || ['🌡', '—'];
        const t = Math.round(j.current.temperature_2m);
        tempHtml = `${t}°C`;
      } else if (isTripDay) {
        [icon, desc] = WMO[j.daily.weather_code[0]] || ['🌡', '—'];
        const hi = Math.round(j.daily.temperature_2m_max[0]);
        const lo = Math.round(j.daily.temperature_2m_min[0]);
        tempHtml = `<span class="w-range">${lo}° / ${hi}°C</span>`;
        const rain = j.daily.precipitation_probability_max?.[0];
        if (rain != null) desc += ` · 降雨機率 ${rain}%`;
      } else {
        throw new Error('no data');
      }

      el.classList.remove('loading');
      el.innerHTML = `
        <div class="w-icon">${icon}</div>
        <div class="w-main">
          <div class="w-temp">${tempHtml}</div>
          <div class="w-desc">${desc}</div>
        </div>
        <div class="w-loc">📍${esc(city.name)}</div>`;
    } catch {
      el.classList.remove('loading');
      el.innerHTML = `
        <div class="w-icon">🌡</div>
        <div class="w-main"><div class="w-desc">${esc(city.name)}天氣暫時無法取得（離線或超出預報範圍）</div></div>
        <div class="w-loc">📍${esc(city.name)}</div>`;
    }
  }

  /* ================= 資訊頁 ================= */
  function infoCardHtml(entry) {
    const rows = (entry.fields || []).map(([k, v, mono, link]) => {
      const val = link ? `<a class="tel-link" href="${link}">${esc(v)}</a>` : esc(v);
      return `<dt>${esc(k)}</dt><dd class="${mono ? 'mono' : ''}">${val}</dd>`;
    }).join('');
    const nav = entry.location ? navActions(entry.location) : '';
    return `
      <div class="info-card">
        <div class="ic-title">${esc(entry.title)}<span class="ic-sub">${esc(entry.sub || '')}</span></div>
        <dl class="info-grid">${rows}</dl>
        ${nav}
      </div>`;
  }

  function renderInfo() {
    $('#flight-list').innerHTML = TRIP.flights.map(infoCardHtml).join('');
    $('#stay-list').innerHTML = TRIP.stays.map(infoCardHtml).join('');
    $('#contact-list').innerHTML = `
      <div class="info-card">
        <dl class="info-grid">
          ${TRIP.contacts.map((c) =>
            `<dt>${esc(c.label)}</dt><dd><a class="tel-link" href="${c.tel}">${esc(c.value)}</a></dd>`).join('')}
        </dl>
      </div>`;
  }

  /* ================= 記帳 ================= */
  const CAT_ICON = { food: '🍜', transport: '🚌', shopping: '🛍', ticket: '🎫', stay: '🏨', other: '📦' };
  let expenses = [];
  let dbMode = 'local';

  function rateOf(code) {
    const c = (TRIP.currencies || []).find((x) => x.code === code);
    return c ? c.rate : 1;
  }
  const baseCur = () => TRIP.budget?.currency || 'TWD';
  const toBase = (e) => e.amount * rateOf(e.currency);
  const fmt = (n, code, digits = 0) =>
    `${code} ${n.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}`;

  function renderBudget() {
    const total = TRIP.budget?.total || 0;
    const spent = expenses.reduce((s, e) => s + toBase(e), 0);
    const remain = total - spent;
    const pct = total ? Math.min(100, (spent / total) * 100) : 0;
    $('#budget-summary').innerHTML = `
      <div class="budget-cell wide">
        <div class="b-label">總預算 (${baseCur()})</div>
        <div class="b-value">${fmt(total, baseCur())}</div>
        <div class="budget-bar"><i class="${pct >= 100 ? 'over' : ''}" style="width:${pct}%"></i></div>
      </div>
      <div class="budget-cell">
        <div class="b-label">已花費</div>
        <div class="b-value">${fmt(spent, baseCur())}</div>
        <div class="b-sub">${expenses.length} 筆紀錄 · ${pct.toFixed(0)}%</div>
      </div>
      <div class="budget-cell">
        <div class="b-label">剩餘</div>
        <div class="b-value ${remain < 0 ? 'neg' : ''}">${fmt(remain, baseCur())}</div>
        <div class="b-sub">${remain < 0 ? '超出預算囉！' : '還在預算內'}</div>
      </div>`;
  }

  function renderExpenses() {
    const ul = $('#expense-list');
    if (!expenses.length) {
      ul.innerHTML = `<li class="expense-empty">還沒有紀錄，記下第一筆吧 ✍️</li>`;
      renderBudget();
      return;
    }
    ul.innerHTML = expenses.map((e) => `
      <li class="expense-item" data-id="${e.id}">
        <span class="e-cat">${CAT_ICON[e.category] || '📦'}</span>
        <div class="e-main">
          <div class="e-title">${esc(e.title)}</div>
          <div class="e-date">${esc(e.date)}</div>
        </div>
        <span class="e-amount">
          <strong>${esc(e.currency)} ${Number(e.amount).toLocaleString()}</strong>
          <small>≈ ${fmt(toBase(e), baseCur(), 2)}</small>
        </span>
        <button class="e-del" aria-label="刪除" title="刪除">✕</button>
      </li>`).join('');
    renderBudget();
  }

  function setSync(state, msg) {
    const el = $('#sync-status');
    el.textContent = msg;
    el.className = 'sync-status ' + state;
  }

  function initExpenses() {
    // 幣別下拉
    $('#exp-currency').innerHTML = (TRIP.currencies || [{ code: 'TWD' }])
      .map((c) => `<option value="${c.code}">${c.code}</option>`).join('');
    // 預設日期 = 今天
    $('#exp-date').value = new Date().toISOString().slice(0, 10);

    // 資料層
    const { mode } = ExpenseDB.init();
    dbMode = mode;
    setSync(mode === 'firestore' ? 'ok' : '', mode === 'firestore' ? '☁ Firestore 同步' : '📱 本機儲存');
    ExpenseDB.subscribe((items, source) => {
      expenses = items;
      renderExpenses();
      if (source === 'cloud') setSync('ok', '☁ Firestore 同步');
      if (source === 'local-error') setSync('err', '☁ 連線失敗，顯示本機資料');
    });

    // 新增
    $('#expense-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const title = $('#exp-title').value.trim();
      const amount = parseFloat($('#exp-amount').value);
      if (!title || !(amount >= 0)) return;
      const btn = $('#exp-submit');
      btn.disabled = true;
      try {
        const saved = await ExpenseDB.add({
          title, amount,
          currency: $('#exp-currency').value,
          category: $('#exp-category').value,
          date: $('#exp-date').value
        });
        $('#exp-title').value = '';
        $('#exp-amount').value = '';
        $('#exp-title').focus();
        if (dbMode !== 'firestore') {
          expenses.unshift(saved);
          renderExpenses();
        }
      } catch (e) {
        console.warn(e);
        setSync('err', '☁ 寫入失敗');
      } finally {
        btn.disabled = false;
      }
    });

    // 刪除（事件委派）
    $('#expense-list').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.e-del');
      if (!btn) return;
      const li = btn.closest('.expense-item');
      const id = li.dataset.id;
      li.style.opacity = '.35';
      try {
        await ExpenseDB.remove(id);
        if (dbMode !== 'firestore') {
          expenses = expenses.filter((item) => item.id !== id);
          renderExpenses();
        }
      } catch {
        li.style.opacity = '';
      }
    });
  }

  /* ================= 啟動 ================= */
  renderDays();
  renderInfo();
  initExpenses();
})();
