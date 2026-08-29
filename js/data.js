/* ============================================================
   旅程資料 — 改成你自己的行程即可（結構勿動）
   ------------------------------------------------------------
   欄位說明：
   - location.name : 地點名（會自動產生「Naver 導航」＋「Google 地圖」兩個按鈕）
   - location.query: （可省略）導航搜尋用字，預設用 name
   - location.lat / location.lng: （可省略）經緯度；有提供時 Naver 直接開啟路線規劃
   - guide         : 導遊導覽資訊，會以彩色標籤呈現
       food    → 必吃美食（紅）
       menu    → 必點菜單（橙）
       gift    → 必買伴手禮（綠）
       booking → 重要預約代號（藍）
       story   → 景點故事 / 攻略（灰字）
   ============================================================ */

const TRIP = {
  title: '濟州島・自駕之旅',
  subtitle: '2026/9/26 — 10/3 · 8 天 7 夜',
  startDate: '2026-09-26',          // 日期格式：YYYY-MM-DD

  // 記帳設定（rate 代表 1 單位外幣可兌換多少港幣 HKD）
  budget: { total: 18000, currency: 'HKD' },
  currencies: [
    { code: 'HKD', rate: 1 },
    { code: 'JPY', rate: 0.052 },
    { code: 'TWD', rate: 0.243 },
    { code: 'USD', rate: 7.8 },
    { code: 'CNY', rate: 1.08 },
    { code: 'KRW', rate: 0.0057 },
    { code: 'EUR', rate: 9.1 },
    { code: 'GBP', rate: 10.5 },
    { code: 'SGD', rate: 6.05 },
    { code: 'THB', rate: 0.24 }
  ],

  // 每日天氣地點（Open-Meteo 經緯度，免 API 金鑰）
  // 每天行程要標 weatherCity，並對應這裡的城市代碼
  weatherCities: {
    jeju:     { name: '濟州市', lat: 33.4996, lon: 126.5312 },
    seongsan: { name: '城山', lat: 33.4586, lon: 126.9406 },
    east:     { name: '月汀里', lat: 33.5516, lon: 126.7993 },
    aewol:    { name: '涯月', lat: 33.4679, lon: 126.3280 },
    south:    { name: '南線', lat: 33.3061, lon: 126.2890 },
    seogwipo: { name: '西歸浦', lat: 33.2544, lon: 126.5600 }
  },

  // ---------- 航班 ----------
  flights: [
    {
      title: '去程 · 香港 → 濟州（凌晨機）',
      sub: '2026-09-26 (六)',
      fields: [
        ['航班', 'UO698', true],
        ['起飛', 'HKG 香港 · 02:30'],
        ['抵達', 'CJU 濟州 · 06:30'],
        ['提醒', '凌晨機！建議 00:30 前到香港機場辦理手續']
      ]
    },
    {
      title: '回程 · 濟州 → 香港',
      sub: '2026-10-03 (六)',
      fields: [
        ['航班', 'UO699', true],
        ['起飛', 'CJU 濟州 · 07:30'],
        ['抵達', 'HKG 香港 · 09:40'],
        ['提醒', '05:30 前抵達濟州機場，預留 2 小時辦理離境']
      ]
    }
  ],

  // ---------- 住宿 ----------
  stays: [
    {
      title: '濟州市酒店（9/26–9/27・2 晚）',
      sub: '首選 Hotel Leo',
      location: { name: 'Hotel Leo Jeju', query: '호텔 레오 제주' },
      fields: [
        ['區域', '濟州市新濟州／塔洞一帶'],
        ['備選', 'Diamond Hotel Jeju、Jeju Oriental Hotel'],
        ['自駕', '三間均有停車；位置方便首兩日'],
        ['備註', 'Day 1 抵達後先寄存行李或提早 check-in']
      ]
    },
    {
      title: '西歸浦市酒店（9/28–9/30・3 晚）',
      sub: '首選 Nine Boutique',
      location: { name: 'Nine Boutique Hotel Seogwipo', query: '나인부티크호텔 서귀포' },
      fields: [
        ['區域', '西歸浦市（近每日偶來市場）'],
        ['備選', 'Poong Gyung Hotel、Beomseom Punggyeong'],
        ['自駕', '均有停車；較方便市場及市內景點'],
        ['備註', '10/1 退房後行李上車，傍晚北返機場']
      ]
    },
    {
      title: '機場附近酒店（10/1–10/2・2 晚）',
      sub: '首選 Hotel JM',
      location: { name: 'Hotel JM Jeju', query: '호텔 제이엠 제주' },
      fields: [
        ['區域', '濟州機場附近（約 5–10 分鐘車程）'],
        ['備選', 'Sweet Hotel、Major Hotel'],
        ['自駕', '均有停車；官方資料稱距機場 5–10 分鐘'],
        ['備註', '10/3 約 05:00 酒店叫車到機場']
      ]
    }
  ],

  // ---------- 緊急聯絡 ----------
  contacts: [
    { label: '韓國緊急電話（警察）', value: '112', tel: 'tel:112' },
    { label: '韓國緊急電話（救護/火警）', value: '119', tel: 'tel:119' },
    { label: '韓國旅遊諮詢熱線（24h 外語）', value: '1330', tel: 'tel:1330' },
    { label: '入境處協助在外港人 24h 熱線', value: '+852 1868', tel: 'tel:+8521868' },
    { label: '同行家人', value: '+852-9123-4567', tel: 'tel:+85291234567' }
  ],

  // ---------- 每日行程 ----------
  // type 欄位：spot(景點) | food(餐廳) | transport(交通) | stay(住宿) | note(備忘)
  days: [
    {
      date: '2026-09-26',
      label: 'Day 1',
      theme: '抵達濟州・梨湖・龍頭岩・東門市場夜市',
      weatherCity: 'jeju',
      items: [
        {
          time: '06:30',
          type: 'transport',
          title: '抵達濟州機場 CJU',
          desc: 'UO698 凌晨 02:30 從香港起飛、06:30 抵達，入境後直接往 Rent-a-Car House 移動，不要先吃早餐。',
          guide: { booking: '去程機票 <b>UO698</b>' }
        },
        {
          time: '07:30',
          type: 'transport',
          title: '取車：Hyundai Ioniq 5 Long Range',
          location: { name: '濟州機場 Rent-a-Car House', query: '제주공항 렌터카하우스', lat: 33.5053, lng: 126.4927 },
          desc: '機場 <strong>Gate 5</strong> 過馬路 → Rent-a-Car House → <strong>Zone 1, Platform 2</strong> 搭 SK 接駁車。已含 <strong>Full CDW 全保</strong>，預留 45–60 分鐘取車及拍攝車況。',
          guide: {
            booking: '租車 <b>SK Rent-a-Car</b> · Full CDW · <b>KRW 743,940</b>',
            story: '取車及還車各拍一段完整環車影片，記錄輪圈、擋風玻璃、內裝及電量。'
          }
        },
        {
          time: '08:30',
          type: 'transport',
          title: '機場早餐（行李留車內）→ 梨湖',
          desc: '行李留車內、不外露；簡單早餐後直接開往梨湖馬燈塔（約 10–15 分鐘），避免疲勞空腹駕駛。'
        },
        {
          time: '09:15',
          type: 'spot',
          title: '梨湖木筏海邊馬燈塔',
          location: { name: '梨湖木筏海邊', query: '이호테우해변', lat: 33.4977, lng: 126.4528 },
          desc: '免費、全天開放。海邊兩座小馬燈塔是濟州打卡地標，停留約 45 分鐘。'
        },
        {
          time: '10:15',
          type: 'spot',
          title: '龍頭岩',
          location: { name: '龍頭岩', query: '용두암', lat: 33.5160, lng: 126.5120 },
          desc: '免費、全天開放；有停車場（費率現場確認）。市區海岸最輕鬆的散步點。',
          guide: {
            story: '龍頭岩是濟州島地標之一，火山岩被海浪長期沖刷形似龍頭，傳說有龍在此被射落化為岩石。'
          }
        },
        {
          time: '11:30',
          type: 'food',
          title: '黑豬肉午餐：Donsadon',
          location: { name: 'Donsadon 本店', query: '돈사돈 본점', lat: 33.4789, lng: 126.4641 },
          desc: '濟州必吃黑豬肉燒烤，12:30 開門，現場登記候位；免費大型停車場。黑豬肉 400g 約 44,000 韓元（2 人份）。',
          guide: {
            booking: '12:30 開門；每月第 2、4 個星期二休息',
            menu: '<b>黑豬肉</b> 400g 約 <b>44,000 韓元</b>（適合 2 人）'
          }
        },
        {
          time: '13:30',
          type: 'stay',
          title: '酒店休息（3 小時）',
          desc: '入住或寄存後休息，把通宵航班疲勞留在酒店，下午不再安排長車程。'
        },
        {
          time: '17:00',
          type: 'food',
          title: 'Abebe Bakery・塔洞海旁',
          location: { name: 'Abebe Bakery', query: '아베베 베이커리', lat: 33.5127, lng: 126.5288 },
          desc: '東門市場 12 號門旁，10:00–21:00；甜甜圈約 2,700 韓元起；無自有停車場，停東門市場公營停車場。'
        },
        {
          time: '18:15',
          type: 'food',
          title: '東門市場晚餐及夜市',
          location: { name: '東門市場', query: '동문재래시장', lat: 33.5122, lng: 126.5276 },
          desc: '市場約 07:00–21:00（各店不同）；5–10 月夜市 19:00–24:00 位於 8 號門。免費入場。',
          guide: {
            food: '<b>豬肉湯麵</b>、<b>海鮮湯飯</b>、<b>黑豬肉串</b>',
            gift: '<b>柑橘巧克力</b>、<b>石頭爺爺周邊</b>'
          }
        }
      ]
    },
    {
      date: '2026-09-27',
      label: 'Day 2',
      theme: '西部日：涯月・翰林公園・協才海灘',
      weatherCity: 'aewol',
      items: [
        {
          time: '08:30',
          type: 'transport',
          title: '濟州市 → 涯月漢潭',
          desc: '約 35–40 分鐘車程，往濟州西北海岸。'
        },
        {
          time: '09:10',
          type: 'spot',
          title: '涯月漢潭海岸步道',
          location: { name: '涯月漢潭海岸步道', query: '애월 한담해안산책로', lat: 33.4591, lng: 126.3104 },
          desc: '免費、全天開放。火山岩海岸與湛藍海水的經典步道，風大時可縮短停留。',
          guide: {
            story: '漢潭海岸步道全長約 1.2 公里，沿黑色玄武岩海岸而建，可遠眺飛揚島。'
          }
        },
        {
          time: '10:25',
          type: 'food',
          title: '午餐：Jeju Gwanghae 涯月店',
          location: { name: 'Jeju Gwanghae 涯月店', query: '제주광해 애월점', lat: 33.4878, lng: 126.3904 },
          desc: '10:00–20:00，最後點餐 19:00，全年無休；帶魚燉煮小份約 41,000 韓元；有停車場，適合 2 人。',
          guide: {
            menu: '<b>帶魚燉煮</b>（小份約 41,000 韓元）',
            booking: 'CatchTable 取號'
          }
        },
        {
          time: '11:50',
          type: 'food',
          title: 'Haejigae Cafe 咖啡',
          location: { name: 'Haejigae Cafe', query: '해지개 카페', lat: 33.4642, lng: 126.3090 },
          desc: '09:00–21:00；海景咖啡及烘焙，現場入座；飲品約 6,000–8,500 韓元。',
          guide: {
            story: '海景第一排的韓屋風格咖啡廳，涯月海岸的熱門打卡點。'
          }
        },
        {
          time: '13:35',
          type: 'spot',
          title: '翰林公園',
          location: { name: '翰林公園', query: '한림공원', lat: 33.3893, lng: 126.2403 },
          desc: '9–10 月售票 09:00–17:00；成人 15,000 韓元；免費停車。熔岩洞窟與亞熱帶植物園。',
          guide: {
            booking: '成人 <b>15,000 韓元</b>，免費停車'
          }
        },
        {
          time: '16:10',
          type: 'spot',
          title: '協才海水浴場',
          location: { name: '協才海水浴場', query: '협재해수욕장', lat: 33.3941, lng: 126.2397 },
          desc: '免費、全天開放、免費停車。2026 泳季已於 9/6 結束，只作散步與日落攝影，不安排下水。'
        },
        {
          time: '17:15',
          type: 'transport',
          title: '返回濟州市',
          desc: '約 50–55 分鐘，進城預留緩衝。'
        },
        {
          time: '18:30',
          type: 'food',
          title: '晚餐：海鮮湯',
          location: { name: '三星血海鮮湯 1 號店', query: '삼성혈 해물탕 1호점', lat: 33.5039, lng: 126.4654 },
          desc: '11:00–21:00，15:00–17:00 休息，逢星期二休；海鮮湯小份約 60,000 韓元；可停車及預約，建議先電話訂位。'
        }
      ]
    },
    {
      date: '2026-09-28',
      label: 'Day 3',
      theme: '東部轉場日：萬丈窟 → 入住西歸浦',
      weatherCity: 'east',
      items: [
        {
          time: '07:20',
          type: 'transport',
          title: '退房 → 咸德海灘',
          desc: '行李留車內時不要外露，車程約 30–35 分鐘。'
        },
        {
          time: '07:55',
          type: 'spot',
          title: '咸德海水浴場',
          location: { name: '鹹德海水浴場', query: '함덕해수욕장', lat: 33.5432, lng: 126.6699 },
          desc: '免費、全天開放；大型停車場（費率未核實）。濟州最受歡迎的海水浴場之一，白沙灘與珊瑚砂。'
        },
        {
          time: '08:55',
          type: 'food',
          title: 'London Bagel Museum Jeju 早餐',
          location: { name: 'London Bagel Museum Jeju', query: '런던베이글뮤지엄 제주점', lat: 33.5536, lng: 126.7156 },
          desc: '位於舊左邑東福路 85（不在涯月），08:00–18:00；從咸德約 15–20 分鐘。抵達後取號候位。',
          guide: {
            booking: '可用 <b>Catch Table</b> App 候位',
            food: '<b>招牌貝果</b>＋<b>奶油乳酪</b>'
          }
        },
        {
          time: '10:35',
          type: 'spot',
          title: '月汀里海灘',
          location: { name: '月汀里海水浴場', query: '월정리해변', lat: 33.5560, lng: 126.7962 },
          desc: '免費、全天開放。白色風車與漸層海水，濟州最具代表性的海岸咖啡街。'
        },
        {
          time: '11:40',
          type: 'spot',
          title: '萬丈窟',
          location: { name: '萬丈窟', query: '만장굴', lat: 33.5283, lng: 126.7701 },
          desc: '09:00–18:00，最後入場 17:00；每月首個星期三休館（9/28 不受影響）；成人 4,000 韓元；135 個免費車位。',
          guide: {
            booking: '成人 <b>4,000 韓元</b>，免費停車',
            story: '世界自然遺產，2026 年 5 月 30 日已重開。洞內濕滑，建議穿抓地鞋及薄外套。'
          }
        },
        {
          time: '13:40',
          type: 'food',
          title: '城山午餐',
          desc: '從萬丈窟約 35–40 分鐘到城山，午餐後順路往西歸浦。'
        },
        {
          time: '14:50',
          type: 'transport',
          title: '前往西歸浦（約 70–75 分鐘）',
          desc: '全程向東再轉南，不折返濟州市。'
        },
        {
          time: '16:05',
          type: 'stay',
          title: '入住西歸浦酒店・休息',
          desc: '入住後不再安排長車程，好好休息。'
        },
        {
          time: '19:00',
          type: 'food',
          title: '西歸浦市內晚餐',
          desc: '酒店附近餐廳用餐，今晚不安排景點，把體力留給明天城山與牛島。'
        }
      ]
    },
    {
      date: '2026-09-29',
      label: 'Day 4',
      theme: '城山日出峰・牛島・涉地可支',
      weatherCity: 'seongsan',
      items: [
        {
          time: '06:45',
          type: 'transport',
          title: '西歸浦 → 城山日出峰',
          desc: '約 70–75 分鐘，本行程車程最長的一天，早點出發。'
        },
        {
          time: '08:00',
          type: 'spot',
          title: '城山日出峰',
          location: { name: '城山日出峰', query: '성산일출봉', lat: 33.4581, lng: 126.9425 },
          desc: '9–10 月 05:00–19:00，售票至 18:00；每月首個星期一休；成人 5,000 韓元；免費停車。步道約 30 分鐘可登頂。',
          guide: {
            booking: '成人 <b>5,000 韓元</b>，免費停車',
            story: '世界自然遺產，10 萬年前海底火山噴發形成的巨大穹丘，頂部是凹陷火山口，濟州東端的地標。'
          }
        },
        {
          time: '09:45',
          type: 'transport',
          title: '城山港停車・購票',
          location: { name: '城山港', query: '성산항', lat: 33.4703, lng: 126.9301 },
          desc: '一般租車不可上牛島，車留城山港。首 30 分鐘免費，之後每 30 分鐘 500 韓元，當日上限 5,000 韓元。攜帶護照正本，提早 45 分鐘到港。',
          guide: {
            booking: '城山港電話 <b>064-782-5671</b>（出發前確認船費及文件）'
          }
        },
        {
          time: '10:30',
          type: 'spot',
          title: '牛島（約 5 小時含船程）',
          location: { name: '牛島', query: '우도', lat: 33.5073, lng: 126.9550 },
          desc: '9 月船班約每 30 分鐘一班（城山首班 08:00、末班 18:20；牛島末班 18:00）。島上可搭循環巴士（約 5,000 韓元一日券）或租單車（約 10,000／3 小時）。',
          guide: {
            food: '<b>海鮮麵</b>、<b>花生冰淇淋</b>（牛島必試）',
            story: '牛島是濟州最大的附屬島嶼，以花生、海女與黑色玄武岩海岸聞名，又稱「小濟州」。如遇停航改城山日出峰＋涉地可支慢遊。'
          }
        },
        {
          time: '16:20',
          type: 'spot',
          title: '涉地可支',
          location: { name: '涉地可支', query: '섭지코지', lat: 33.4366, lng: 126.9221 },
          desc: '免費入場、全天開放；停車首 30 分鐘 1,000 韓元，全日上限 3,000。黃昏海岸步道特別適合拍照。',
          guide: {
            story: '濟州東岸的火山岩海角，因韓劇《All In》在此取景而聲名大噪。'
          }
        },
        {
          time: '17:30',
          type: 'transport',
          title: '返回西歸浦',
          desc: '約 70–75 分鐘。本日不安排晚間景點，晚餐留在市內。'
        }
      ]
    },
    {
      date: '2026-09-30',
      label: 'Day 5',
      theme: '西歸浦市內：正房瀑布・市場・天地淵夜景',
      weatherCity: 'seogwipo',
      items: [
        {
          time: '09:00',
          type: 'spot',
          title: '正房瀑布',
          location: { name: '正房瀑布', query: '정방폭포', lat: 33.2449, lng: 126.5715 },
          desc: '09:00–17:50，最後入場 17:30，全年無休；成人 2,000 韓元。亞洲少數直接落入海的瀑布，海邊石階濕滑，雨天改天地淵。',
          guide: {
            booking: '成人 <b>2,000 韓元</b>'
          }
        },
        {
          time: '10:30',
          type: 'food',
          title: '西歸浦每日偶來市場',
          location: { name: '西歸浦每日偶來市場', query: '서귀포매일올레시장', lat: 33.2487, lng: 126.5641 },
          desc: '在地市場小吃與咖啡，周邊有公營停車場。',
          guide: {
            food: '<b>市場小吃</b>、<b>黑豬肉湯飯</b>'
          }
        },
        {
          time: '12:45',
          type: 'spot',
          title: '外돌개',
          location: { name: '外돌개', query: '외돌개', lat: 33.2415, lng: 126.5482 },
          desc: '全天開放、免費入場及免費停車。下午較適合海岸攝影。',
          guide: {
            story: '西歸浦海岸的孤立岩石柱，由火山岩長期受海浪侵蝕而成，是濟州南岸的代表性地標。'
          }
        },
        {
          time: '14:10',
          type: 'spot',
          title: '天帝淵瀑布或中文海岸散步',
          location: { name: '天帝淵瀑布', query: '천제연폭포', lat: 33.2501, lng: 126.4165 },
          desc: '天帝淵時間與票價出發前致電 064-740-6000 核實；若無法確認，改在中文海岸、柱狀節理附近外圍散步。'
        },
        {
          time: '16:30',
          type: 'stay',
          title: '返回西歸浦酒店・休息',
          desc: '西歸浦酒店第三晚（9/30），全程最輕鬆的一天，稍作休息後晚餐。'
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：海鮮湯',
          location: { name: '三星血海鮮湯 西歸浦店', query: '삼성혈 해물탕 서귀포점', lat: 33.2550, lng: 126.5660 },
          desc: '10:30–15:00、16:00–22:30；時間出發前電話 064-739-7200 確認。'
        },
        {
          time: '19:30',
          type: 'spot',
          title: '天地淵瀑布夜景',
          location: { name: '天地淵瀑布', query: '천지연폭포', lat: 33.2469, lng: 126.5545 },
          desc: '09:00–22:00，最後入場 21:20，全年無休；成人 2,000 韓元；免費停車。夜晚燈光下的瀑布很值得一看。',
          guide: {
            booking: '成人 <b>2,000 韓元</b>，免費停車',
            story: '天地淵瀑布意為「天之淵」，高約 22 公尺，位於西歸浦市區附近、酒店步行可達。'
          }
        }
      ]
    },
    {
      date: '2026-10-01',
      label: 'Day 6',
      theme: '西南環線：花園・茶園・龍頭海岸',
      weatherCity: 'south',
      items: [
        {
          time: '08:15',
          type: 'transport',
          title: '退房・行李上車 → Camellia Hill',
          desc: '西歸浦退房、行李上車，往 Camellia Hill 約 30–35 分鐘。'
        },
        {
          time: '09:05',
          type: 'spot',
          title: 'Camellia Hill',
          location: { name: 'Camellia Hill', query: '카멜리아힐', lat: 33.2896, lng: 126.3699 },
          desc: '3–10 月 08:30–18:30，最後入場 17:30，全年無休；成人 12,000 韓元；有停車場（費率未核實）。10 月主題為粉黛亂子草及蒲葦。',
          guide: {
            booking: '成人 <b>12,000 韓元</b>'
          }
        },
        {
          time: '11:05',
          type: 'spot',
          title: 'Osulloc 雪綠茶博物館',
          location: { name: 'Osulloc 雪綠茶博物館', query: '오설록 티뮤지엄', lat: 33.3059, lng: 126.2894 },
          desc: '09:00–18:00，全年無休；入場費以現場為準。茶園景觀與綠茶產品。',
          guide: {
            gift: '<b>綠茶伴手禮</b>'
          }
        },
        {
          time: '12:35',
          type: 'food',
          title: 'Jejudang 咖啡及簡餐',
          location: { name: 'Jejudang Bakery Cafe', query: '제주당' },
          desc: '10:00–21:00，無固定休息日；大型停車場；招牌蔬菜造型麵包套裝約 19,800 韓元。'
        },
        {
          time: '14:00',
          type: 'spot',
          title: '龍頭海岸（或山房窟寺）',
          location: { name: '龍頭海岸', query: '용머리해안', lat: 33.2333, lng: 126.3131 },
          desc: '09:00–17:00，最後入場 16:30；成人 2,000 韓元。潮汐、風浪或天氣可令園區即日關閉，當天先查 Instagram @6sot_official 或致電 064-794-2940。',
          guide: {
            booking: '成人 <b>2,000 韓元</b>；關閉時改山房窟寺或山房山外圍'
          }
        },
        {
          time: '15:45',
          type: 'food',
          title: 'Chunsimine 早晚餐',
          location: { name: 'Chunsimine 本店', query: '춘심이네', lat: 33.2645, lng: 126.3705 },
          desc: '營業時間資料有 10:30–20:50 與 11:00–20:20 兩版本，最後點餐約 20:30；整條烤帶魚約 78,000 韓元起；免費停車，適合 2 人。出發前致電 064-794-4010 確認。',
          guide: {
            menu: '<b>整條烤帶魚</b>（約 78,000 韓元起）'
          }
        },
        {
          time: '17:15',
          type: 'transport',
          title: '北返機場酒店（約 70–80 分鐘）',
          desc: 'Chunsimine 後北上，入住機場附近酒店（Hotel JM／Sweet／Major）。'
        },
        {
          time: '18:35',
          type: 'stay',
          title: '入住機場附近酒店',
          desc: '機場酒店第一晚（10/1、10/2 共 2 晚）。'
        }
      ]
    },
    {
      date: '2026-10-02',
      label: 'Day 7',
      theme: '還車日：Waboda・最後採買・20:00 前還車',
      weatherCity: 'jeju',
      items: [
        {
          time: '09:00',
          type: 'note',
          title: '酒店早餐・整理行李',
          desc: '還車日由機場出發，無需南下，朝頭好鬆動。行李可先寄存酒店。'
        },
        {
          time: '09:30',
          type: 'food',
          title: 'Waboda Bakery 早午餐',
          location: { name: 'Waboda Bakery', query: '와보다', lat: 33.5197, lng: 126.4985 },
          desc: '地址 제주시 서해안로 560，已找到 2025/12/30 營業登記，但無可靠官方營業時間。10/1 晚在 Naver Map 查看翌日營業狀態；若 10:00 前無法確認，直接改去 Abebe Bakery。',
          guide: {
            booking: '執行條件：10/1 晚核實營業狀態'
          }
        },
        {
          time: '11:00',
          type: 'food',
          title: '東門市場・塔洞・午餐及採買',
          location: { name: '東門市場', query: '동문재래시장', lat: 33.5122, lng: 126.5276 },
          desc: '最後採買與市區散步（約 2.5 小時），公營停車場收費。',
          guide: {
            gift: '<b>柑橘巧克力</b>、<b>石頭爺爺周邊</b>'
          }
        },
        {
          time: '13:30',
          type: 'note',
          title: '咖啡・酒店寄存行李・休息',
          desc: '不再往東部，保留體力準備還車。'
        },
        {
          time: '15:45',
          type: 'spot',
          title: '梨湖馬燈塔黃昏拍攝',
          location: { name: '梨湖木筏海邊', query: '이호테우해변', lat: 33.4977, lng: 126.4528 },
          desc: '免費。黃昏時分拍攝小馬燈塔與日落。'
        },
        {
          time: '16:50',
          type: 'food',
          title: '近機場早晚餐',
          desc: '選有停車的餐廳，食完準備補電還車。'
        },
        {
          time: '17:50',
          type: 'note',
          title: '補電・整理行李・拍攝車況',
          desc: '依租車合約補足電量；取車及還車各拍完整環車影片。'
        },
        {
          time: '18:30',
          type: 'transport',
          title: '前往 SK Rent-a-Car',
          desc: '約 15 分鐘車程，避開最後一刻。'
        },
        {
          time: '18:45',
          type: 'transport',
          title: '還車 SK Rent-a-Car（20:00 前）',
          location: { name: 'SK Rent-a-Car 濟州', query: 'SK렌터카 제주', lat: 33.5041, lng: 126.5023 },
          desc: '預留 45 分鐘還車及接駁，20:00 前完成。',
          guide: {
            booking: '還車時間 <b>2026-10-02 20:00 前</b>'
          }
        },
        {
          time: '19:30',
          type: 'stay',
          title: '入住機場附近酒店',
          desc: '10/3 清晨約 05:00 酒店叫車到機場。'
        }
      ]
    },
    {
      date: '2026-10-03',
      label: 'Day 8',
      theme: '回程日',
      weatherCity: 'jeju',
      items: [
        {
          time: '04:50',
          type: 'transport',
          title: '退房・酒店協助叫車',
          desc: '酒店協助叫車，約 05:00 出發往濟州國際機場。'
        },
        {
          time: '05:20',
          type: 'transport',
          title: '抵達濟州機場',
          desc: '05:30 前抵達，預留約 2 小時辦理登機與離境。'
        },
        {
          time: '07:30',
          type: 'transport',
          title: 'UO699 → 香港',
          desc: '濟州 07:30 起飛，香港約 09:40 抵達。',
          guide: { booking: '回程機票 <b>UO699</b>' }
        }
      ]
    }
  ]
};
