/* ============================================================
   旅程資料 — 改成你自己的行程即可（結構勿動）
   ------------------------------------------------------------
   欄位說明：
   - location.name : 地點名（會自動產生 Google Maps 導航按鈕）
   - location.query: （可省略）導航搜尋用字，預設用 name
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
      title: '濟州市區住宿（未定）',
      sub: '9/26 起 · 尚待訂房',
      fields: [
        ['備註', 'Day 1 抵達後先寄放行李或提早 check-in'],
        ['每晚預算', 'KRW 60,000–160,000 · 約 HKD 350–900']
      ]
    },
    {
      title: '機場周邊住宿（未定）',
      sub: '10/2 還車後入住 · 1 晚',
      fields: [
        ['備註', '選近機場飯店，10/3 清晨 05:00 出發'],
        ['Check-out', '10/3 約 04:30–05:00']
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
      theme: '抵達濟州・貝果早餐・市區夜遊',
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
          time: '06:45',
          type: 'transport',
          title: 'SK Rent-a-Car 接駁',
          location: { name: '濟州機場 Rent-a-Car House', query: '제주공항 렌터카하우스' },
          desc: '機場 <strong>Gate 5</strong> 過馬路 → Rent-a-Car House → <strong>Zone 1, Platform 2</strong> 搭 SK 接駁車。'
        },
        {
          time: '07:30',
          type: 'transport',
          title: '取車：Hyundai Ioniq 5 Long Range',
          desc: '已含 <strong>Full CDW 全保</strong>。SK 濟州分店常見營業 08:00–22:00，07:30 取車已確認可行。',
          guide: {
            booking: '租車 <b>SK Rent-a-Car</b> · Full CDW · <b>KRW 743,940</b>',
            story: '電動車建議每天維持中高電量，不要拖到剩很少才找充電樁。'
          }
        },
        {
          time: '09:00',
          type: 'food',
          title: 'London Bagel Museum Jeju 早餐',
          location: { name: 'London Bagel Museum Jeju', query: '런던베이글뮤지엄 제주' },
          desc: '濟州市舊左邑東福路 85 第2棟1樓，08:00–18:00。從機場開車約 30–40 分鐘。',
          guide: {
            booking: '可用 <b>Catch Table</b> App 候位',
            food: '<b>招牌貝果</b>＋<b>奶油乳酪</b>'
          }
        },
        {
          time: '10:15',
          type: 'stay',
          title: '回濟州市區飯店寄放行李',
          desc: '先到飯店寄放行李或提早 check-in，再輕裝逛市區。'
        },
        {
          time: '12:00',
          type: 'food',
          title: '東門市場午餐',
          location: { name: '東門市場', query: '동문재래시장' },
          desc: '濟州最大的傳統市場，午餐選擇多。',
          guide: {
            food: '<b>豬肉湯麵</b>、<b>海鮮湯飯</b>、<b>黑豬肉串</b>'
          }
        },
        {
          time: '14:00',
          type: 'spot',
          title: '龍頭岩（或梨湖小馬燈塔）',
          location: { name: '龍頭岩', query: '용두암' },
          desc: '全天開放、免費。市區海岸最輕鬆的散步點；也可改去梨湖海邊小馬燈塔，二選一。',
          guide: {
            story: '龍頭岩是濟州島地標之一，火山岩被海浪長期沖刷形似龍頭，傳說有龍在此被射落化為岩石。'
          }
        },
        {
          time: '18:00',
          type: 'food',
          title: '東門市場晚餐與夜市',
          location: { name: '東門市場', query: '동문재래시장' },
          desc: '免轉場，晚餐與夜市一起解決，順便採買伴手禮。'
        }
      ]
    },
    {
      date: '2026-09-27',
      label: 'Day 2',
      theme: '城山日出峰・牛島・涉地可支',
      weatherCity: 'seongsan',
      items: [
        {
          time: '09:00',
          type: 'transport',
          title: '濟州市區 → 城山',
          desc: '開車約 1 小時，往濟州東端。'
        },
        {
          time: '10:00',
          type: 'spot',
          title: '城山日出峰',
          location: { name: '城山日出峰', query: '성산일출봉' },
          desc: '9–10 月常見 05:00–19:00 開放，最晚售票為閉館前 1 小時；成人 5,000 韓元。步道約 30 分鐘可登頂。',
          guide: {
            story: '世界自然遺產，10 萬年前海底火山噴發形成的巨大穹丘，頂部是凹陷火山口，濟州東端的地標。'
          }
        },
        {
          time: '12:00',
          type: 'transport',
          title: '前往城山港',
          location: { name: '城山港', query: '성산항' }
        },
        {
          time: '13:00',
          type: 'spot',
          title: '牛島環島',
          location: { name: '牛島', query: '우도' },
          desc: '搭渡輪上島，先在碼頭確認最晚回程船班。島上可租電動車／腳踏車簡單環島。',
          guide: {
            food: '<b>海鮮麵</b>、<b>花生冰淇淋</b>',
            story: '牛島是濟州最大的附屬島嶼，以花生、海女與黑色玄武岩海岸聞名，又稱「小濟州」。'
          }
        },
        {
          time: '16:30',
          type: 'spot',
          title: '涉地可支',
          location: { name: '涉地可支', query: '섭지코지' },
          desc: '免費、戶外全天可散步。黃昏海岸步道特別適合拍照。',
          guide: {
            story: '濟州東岸的火山岩海角，因韓劇《All In》在此取景而聲名大噪。'
          }
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：黑豬肉燒烤或海鮮鍋',
          desc: '城山一帶或回市區吃，二選一。',
          guide: {
            food: '<b>黑豬肉燒烤</b>、<b>海鮮鍋</b>'
          }
        }
      ]
    },
    {
      date: '2026-09-28',
      label: 'Day 3',
      theme: '月汀里・鹹德海水浴場',
      weatherCity: 'east',
      items: [
        {
          time: '09:00',
          type: 'spot',
          title: '月汀里海邊與咖啡',
          location: { name: '月汀里海水浴場', query: '월정리해수욕장' },
          desc: '免費、全天開放。白色風車與漸層海水，濟州最具代表性的海岸咖啡街，放慢節奏喝杯咖啡。',
          guide: {
            food: '<b>海邊咖啡廳</b>'
          }
        },
        {
          time: '11:30',
          type: 'food',
          title: '午餐：海鮮麵或鮑魚粥',
          desc: '東岸海女村一帶的海鮮料理。',
          guide: {
            food: '<b>海鮮麵</b>、<b>鮑魚粥</b>'
          }
        },
        {
          time: '14:00',
          type: 'note',
          title: '彈性時段：補拍或休息',
          desc: '上午玩太趕的話，這段時間剛好補拍或回飯店小睡。'
        },
        {
          time: '16:00',
          type: 'spot',
          title: '鹹德海水浴場',
          location: { name: '鹹德海水浴場', query: '함덕해수욕장' },
          desc: '免費、全天開放。濟州最受歡迎的海水浴場之一，白沙灘與珊瑚砂，黃昏最舒服。'
        },
        {
          time: '18:30',
          type: 'food',
          title: '晚餐：白帶魚定食或海鮮鍋',
          guide: {
            food: '<b>白帶魚定食</b>、<b>海鮮鍋</b>'
          }
        }
      ]
    },
    {
      date: '2026-09-29',
      label: 'Day 4',
      theme: '涯月海岸・Haejigae Cafe・翰林／挾才',
      weatherCity: 'aewol',
      items: [
        {
          time: '09:00',
          type: 'spot',
          title: '涯月海岸公路慢走',
          location: { name: '涯月海岸公路', query: '애월해안도로' },
          desc: '免費、全天開放。黑色玄武岩與湛藍海水的海岸公路，沿途慢慢走、慢慢拍。'
        },
        {
          time: '10:30',
          type: 'food',
          title: 'Haejigae Cafe 咖啡休息',
          location: { name: 'Haejigae Cafe', query: '해지개 카페' },
          desc: '濟州市涯月邑涯月北西路 52，09:00–21:00，最後點餐約 20:20。常見低消一人一杯。',
          guide: {
            story: '海景第一排的韓屋風格咖啡廳，涯月海岸的熱門打卡點。',
            menu: '<b>咖啡</b>＋<b>麵包</b>'
          }
        },
        {
          time: '12:30',
          type: 'food',
          title: '午餐：黑豬肉飯或湯麵',
          guide: {
            food: '<b>黑豬肉飯</b>、<b>湯麵</b>'
          }
        },
        {
          time: '14:00',
          type: 'spot',
          title: '翰林公園或挾才海水浴場（二選一）',
          location: { name: '挾才海水浴場', query: '협재해수욕장' },
          desc: '挾才海水浴場免費、全天開放，想省門票就選它；翰林公園需門票。'
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：烤魚或家常定食',
          guide: {
            food: '<b>烤魚</b>、<b>家常定食</b>'
          }
        }
      ]
    },
    {
      date: '2026-09-30',
      label: 'Day 5',
      theme: '南線・茶園與海岸步道',
      weatherCity: 'south',
      items: [
        {
          time: '09:00',
          type: 'spot',
          title: '雪綠茶博物館（或山茶花之丘）',
          location: { name: '雪綠茶博物館', query: '오설록 티뮤지엄' },
          desc: '二選一：雪綠茶博物館多數主館免費、輕鬆拍照；山茶花之丘約 8,000–10,000 韓元，非花季可考慮改茶博物館。',
          guide: {
            story: '雪綠茶博物館位於濟州綠茶園中央，除了茶園景觀，館內還有綠茶產品與咖啡廳。',
            gift: '<b>綠茶伴手禮</b>'
          }
        },
        {
          time: '12:00',
          type: 'food',
          title: '午餐：鮑魚料理或黑豬肉套餐',
          guide: {
            food: '<b>鮑魚料理</b>、<b>黑豬肉套餐</b>'
          }
        },
        {
          time: '14:00',
          type: 'spot',
          title: '外岩海岸步道',
          location: { name: '外岩海岸步道', query: '외암 해안산책로' },
          desc: '免費、全天開放。安靜、人少的海岸步道，慢慢走很舒服。'
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：海鮮鍋或黑豬肉',
          guide: {
            food: '<b>海鮮鍋</b>、<b>黑豬肉</b>'
          }
        }
      ]
    },
    {
      date: '2026-10-01',
      label: 'Day 6',
      theme: '西歸浦瀑布・市場慢行',
      weatherCity: 'seogwipo',
      items: [
        {
          time: '09:00',
          type: 'spot',
          title: '天地淵瀑布（或正房瀑布）',
          location: { name: '天地淵瀑布', query: '천지연폭포' },
          desc: '擇一即可。天地淵瀑布有壯觀懸崖瀑布；正房瀑布是亞洲少數直接落入海的瀑布。門票另計。',
          guide: {
            story: '天地淵瀑布意為「天之淵」，高約 22 公尺，位於西歸浦市區附近的河谷。'
          }
        },
        {
          time: '12:00',
          type: 'food',
          title: '西歸浦每日偶來市場午餐',
          location: { name: '西歸浦每日偶來市場', query: '서귀포 매일올레시장' },
          desc: '在地市場小吃與新鮮食材。',
          guide: {
            food: '<b>市場小吃</b>、<b>黑豬肉湯飯</b>'
          }
        },
        {
          time: '14:00',
          type: 'note',
          title: '市區散步・咖啡廳・伴手禮',
          desc: '西歸浦市區慢慢逛，累了找家咖啡廳坐。'
        },
        {
          time: '18:30',
          type: 'food',
          title: '晚餐：海鮮湯或黑豬肉',
          guide: {
            food: '<b>海鮮湯</b>、<b>黑豬肉</b>'
          }
        }
      ]
    },
    {
      date: '2026-10-02',
      label: 'Day 7',
      theme: '回市區・Waboda Bakery・20:00 還車',
      weatherCity: 'jeju',
      items: [
        {
          time: '09:00',
          type: 'transport',
          title: '西歸浦 → 濟州市區',
          desc: '開車約 1 小時回濟州市區。'
        },
        {
          time: '10:00',
          type: 'food',
          title: 'Waboda Bakery 早午餐',
          location: { name: 'Waboda Bakery', query: '와보다 베이커리' },
          desc: '出發前請以 Naver Map 最新頁面為準；若查無穩定營業資訊，可改 Abebe Bakery 或 Jejudang Bakery Café。',
          guide: {
            booking: '需出發前核對營業狀態'
          }
        },
        {
          time: '12:00',
          type: 'food',
          title: '東門市場或市區簡單午餐',
          location: { name: '東門市場', query: '동문재래시장' }
        },
        {
          time: '13:30',
          type: 'note',
          title: '最後採購與市區散步',
          guide: {
            gift: '<b>柑橘巧克力</b>、<b>石頭爺爺周邊</b>'
          }
        },
        {
          time: '16:00',
          type: 'note',
          title: '回飯店整行李・幫電動車補電',
          desc: '還車前預留至少 1 次補電時間，避免最後趕還車才找充電位。'
        },
        {
          time: '20:00',
          type: 'transport',
          title: '還車 SK Rent-a-Car → 入住機場周邊飯店',
          location: { name: 'SK Rent-a-Car 濟州', query: 'SK렌터카 제주' },
          desc: '20:00 還車後入住機場周邊飯店，10/3 清晨只需叫車或用飯店接駁到機場。',
          guide: {
            booking: '還車時間 <b>2026-10-02 20:00</b>'
          }
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
          time: '05:00',
          type: 'transport',
          title: '飯店 → 濟州機場',
          desc: '05:30 前抵達機場，保留至少 2 小時辦理登機與離境。'
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
