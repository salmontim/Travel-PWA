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
  title: '京阪奈・秋の旅',
  subtitle: '2026/11/14 — 11/20 · 7 天 6 夜',
  startDate: '2026-11-14',          // YYYY-MM-DD

  // 記帳設定
  budget: { total: 60000, currency: 'TWD' },
  currencies: [
    { code: 'JPY', rate: 0.21 },    // rate = 1 外幣 → 多少本幣(TWD)
    { code: 'TWD', rate: 1 }
  ],

  // 每日天氣地點（Open-Meteo 經緯度，免 API key）
  // 每天行程要標 weatherCity 對應這裡的 key
  weatherCities: {
    osaka: { name: '大阪', lat: 34.6937, lon: 135.5023 },
    kyoto: { name: '京都', lat: 35.0116, lon: 135.7681 },
    nara:  { name: '奈良', lat: 34.6851, lon: 135.8048 }
  },

  // ---------- 航班 ----------
  flights: [
    {
      title: '去程 · 台北 → 大阪',
      sub: '2026-11-14 (六)',
      fields: [
        ['航班', 'MM028', true],
        ['起飛', 'TPE 桃園 T1 · 10:25'],
        ['抵達', 'KIX 關西 T1 · 14:05'],
        ['訂位代號', 'XJ7K2P', true]
      ]
    },
    {
      title: '回程 · 大阪 → 台北',
      sub: '2026-11-20 (五)',
      fields: [
        ['航班', 'MM029', true],
        ['起飛', 'KIX 關西 T1 · 15:35'],
        ['抵達', 'TPE 桃園 T1 · 17:40'],
        ['訂位代號', 'XJ7K2P', true]
      ]
    }
  ],

  // ---------- 住宿 ----------
  stays: [
    {
      title: '大阪本町微笑飯店',
      sub: '11/14 — 11/17 · 3 晚',
      location: { name: 'Smile Hotel Osaka Hommachi', query: 'スマイルホテル大阪本町' },
      fields: [
        ['地址', '大阪市中央区南本町2丁目'],
        ['電話', '+81-6-6263-1111', false, 'tel:+81662631111'],
        ['Check-in', '15:00 / Check-out 11:00'],
        ['預約代號', 'BK-88213', true]
      ]
    },
    {
      title: '京都祇園 柚子屋旅館',
      sub: '11/17 — 11/20 · 3 晚',
      location: { name: 'Yuzuya Ryokan Kyoto', query: '柚子屋旅館' },
      fields: [
        ['地址', '京都市東山区祇園町南側'],
        ['電話', '+81-75-533-6110', false, 'tel:+81755336110'],
        ['Check-in', '16:00 / Check-out 10:00'],
        ['預約代號', 'RK-10298', true]
      ]
    }
  ],

  // ---------- 緊急聯絡 ----------
  contacts: [
    { label: '日本緊急電話（警察）', value: '110', tel: 'tel:110' },
    { label: '日本緊急電話（救護/火警）', value: '119', tel: 'tel:119' },
    { label: '駐大阪辦事處', value: '+81-6-6443-8481', tel: 'tel:+81664438481' },
    { label: '旅遊平安險專線', value: '+886-2-2345-6789', tel: 'tel:+886223456789' },
    { label: '同行友人 A', value: '+886-912-345-678', tel: 'tel:+886912345678' }
  ],

  // ---------- 每日行程 ----------
  // type: spot(景點) | food(餐廳) | transport(交通) | stay(住宿) | note(備忘)
  days: [
    {
      date: '2026-11-14',
      label: 'Day 1',
      theme: '抵達大阪・道頓堀夜遊',
      weatherCity: 'osaka',
      items: [
        {
          time: '10:25',
          type: 'transport',
          title: '樂桃 MM028 → 關西機場',
          desc: '提早 2 小時到機場。抵達後搭 <strong>南海電鐵 rapi:t</strong> 直達難波，約 38 分鐘。',
          guide: { booking: '機票訂位代號 <b>XJ7K2P</b>' }
        },
        {
          time: '15:30',
          type: 'stay',
          title: '大阪本町微笑飯店 Check-in',
          location: { name: 'Smile Hotel Osaka Hommachi' },
          desc: '地鐵本町站 13 號出口步行 3 分鐘。',
          guide: { booking: '預約代號 <b>BK-88213</b>' }
        },
        {
          time: '17:30',
          type: 'spot',
          title: '道頓堀・心齋橋散策',
          location: { name: '道頓堀', query: 'Dotonbori Osaka' },
          desc: '固力果跑跑人、蟹道樂大螃蟹。運河兩側霓虹燈是大阪的象徵，黄昏時分最美。',
          guide: {
            story: '道頓堀運河開鑿於 1612 年，原本是商業水路，如今成為大阪「吃到倒下」文化的中心。',
            food: '<b>章魚燒</b>、<b>大阪燒</b>、<b>串炸</b>',
            gift: '<b>固力果 Pocky 限定口味</b>、<b>食倒太郎周邊</b>'
          }
        },
        {
          time: '19:00',
          type: 'food',
          title: '一蘭拉麵 道頓堀店',
          location: { name: '一蘭拉麵 道頓堀店', query: '一蘭 道頓堀店本館' },
          desc: '經典一人食吧台，湯頭濃度、蔥量都能客製。',
          guide: {
            menu: '<b>天然豚骨拉麵</b> + <b>半熟鹽味蛋</b>，加點「替玉」（加麵）',
            food: '先買食券再排隊，尖峰時段約等 30 分鐘'
          }
        }
      ]
    },
    {
      date: '2026-11-15',
      label: 'Day 2',
      theme: '大阪城・黑門市場・梅田空中庭園',
      weatherCity: 'osaka',
      items: [
        {
          time: '08:30',
          type: 'food',
          title: '黑門市場早餐',
          location: { name: '黑門市場', query: 'Kuromon Ichiba Market' },
          desc: '大阪的廚房，170 年歷史的市場，邊走邊吃。',
          guide: {
            food: '<b>黑門三平</b> 海鮮丼、<b>石橋食品</b> 關東煮',
            menu: '<b>烤干貝</b>、<b>現切鮪魚中落</b>、<b>豆漿甜甜圈</b>'
          }
        },
        {
          time: '10:30',
          type: 'spot',
          title: '大阪城天守閣',
          location: { name: '大阪城', query: 'Osaka Castle' },
          desc: '豐臣秀吉的居城，天守閣 8 樓展望台可眺望大阪市區。秋季銀杏大道金黃一片。',
          guide: {
            story: '現在的天守閣是 1931 年重建的第三代，內部為博物館，展示豐臣家與大阪之陣史料。',
            food: '城內 <b>MIRAIZA 大阪城</b> 有本陣特色餐廳'
          }
        },
        {
          time: '15:00',
          type: 'spot',
          title: '梅田空中庭園展望台',
          location: { name: '梅田藍天大廈', query: 'Umeda Sky Building' },
          desc: '173 公尺高、360 度露天展望台「空中庭園」，夕陽與夜景都震撼。建議日落前 1 小時上去。',
          guide: {
            story: '兩棟大樓以「空中庭園」連接，建築師原廣司代表作，曾被英國媒體選為世界 20 大建築。',
            booking: 'Klook 預購門票代號 <b>SKY-5566</b>'
          }
        },
        {
          time: '19:00',
          type: 'food',
          title: 'はがくれ うどん（梅田）',
          location: { name: 'はがくれ 梅田店', query: 'はがくれ うどん 梅田' },
          guide: {
            menu: '<b>冷たい肉うどん</b>（冷肉烏龍麵），麵條極粗有嚼勁'
          }
        }
      ]
    },
    {
      date: '2026-11-16',
      label: 'Day 3',
      theme: '奈良一日遊・東大寺與鹿',
      weatherCity: 'nara',
      items: [
        {
          time: '08:00',
          type: 'transport',
          title: '近鐵難波 → 近鐵奈良（急行約 40 分）',
          location: { name: '近鐵奈良站', query: 'Kintetsu Nara Station' },
          desc: '自駕者注意：奈良公園周邊停車場假日易爆滿，建議停「奈良縣廳前停車場」。'
        },
        {
          time: '09:30',
          type: 'spot',
          title: '東大寺・奈良公園',
          location: { name: '東大寺', query: 'Todaiji Temple' },
          desc: '世界最大木造建築「大佛殿」，供奉 15 公尺高盧舍那大佛。園內 1,200 頭鹿自由漫步。',
          guide: {
            story: '東大寺建於 752 年聖武天皇時代。大佛鼻孔柱（大佛殿右後方木柱）鑽過可得「開運」。',
            food: '奈良公園門口的 <b>鹿仙貝</b>（¥200），舉高鹿會鞠躬',
            gift: '<b>大佛布丁</b>、<b>鹿角鑰匙圈</b>'
          }
        },
        {
          time: '12:30',
          type: 'food',
          title: '志津香 釜飯（奈良公園店）',
          location: { name: '志津香 公園店', query: '志津香 釜めし 公園店' },
          desc: '創業 60 年的釜飯名店，現點現炊需等 20 分鐘。',
          guide: {
            menu: '<b>奈良七種釜飯</b>（七種食材的招牌）、<b>鰻魚釜飯</b>',
            booking: '熱門時段要抽號碼牌，建議 11:30 前登記'
          }
        },
        {
          time: '15:00',
          type: 'spot',
          title: '春日大社',
          location: { name: '春日大社', query: 'Kasuga Taisha' },
          desc: '朱紅社殿與 3,000 座石燈籠，被登錄為世界遺產。參道林蔭幽靜，鹿群穿梭其間如神使。',
          guide: {
            story: '春日大社的鹿被視為神的使者，傳說藤原氏守護神乘白鹿而來。'
          }
        }
      ]
    },
    {
      date: '2026-11-17',
      label: 'Day 4',
      theme: '移動京都・祇園和風之夜',
      weatherCity: 'kyoto',
      items: [
        {
          time: '10:00',
          type: 'transport',
          title: '大阪 → 京都（JR 新快速 30 分）',
          desc: '難波 → 梅田轉 JR 京都線。自駕可走名神高速，京都站前停車位少，建議停飯店配合停車場。'
        },
        {
          time: '12:00',
          type: 'food',
          title: '錦市場午餐散策',
          location: { name: '錦市場', query: 'Nishiki Market' },
          desc: '「京都的廚房」，400 公尺長的商店街擠滿 130 家店鋪。',
          guide: {
            food: '<b>三木雞卵</b> 玉子燒、<b>豆乳甜甜圈</b>、<b>烤鰻串</b>',
            gift: '<b>七味粉</b>（七味家本舖）、<b>漬物組合</b>'
          }
        },
        {
          time: '16:00',
          type: 'stay',
          title: '柚子屋旅館 Check-in',
          location: { name: '柚子屋旅館', query: '柚子屋旅館' },
          desc: '八坂神社旁的老鋪旅館，全館僅 8 間房。',
          guide: { booking: '預約代號 <b>RK-10298</b>，晚餐 18:30 開始' }
        },
        {
          time: '17:30',
          type: 'spot',
          title: '花見小路・祇園白川散策',
          location: { name: '祇園白川', query: 'Gion Shirakawa' },
          desc: '石板路、木造茶屋、柳樹與白川，傍晚最有機會遇見趕場的藝伎。',
          guide: {
            story: '祇園從江戶時代就是花街，「花見小路」的茶屋仍保留傳統「一見さんお断り」（謝絕生客）規矩。',
            food: '<b>祇園きなな</b> 黃豆粉冰淇淋、<b>ぎをん小森</b> 抹茶蕨餅'
          }
        }
      ]
    },
    {
      date: '2026-11-18',
      label: 'Day 5',
      theme: '清水寺・二年坂三年坂・賞楓',
      weatherCity: 'kyoto',
      items: [
        {
          time: '07:30',
          type: 'spot',
          title: '清水寺（清晨早鳥）',
          location: { name: '清水寺', query: 'Kiyomizu-dera' },
          desc: '7:30 前抵達可避開人潮。「清水舞台」懸空 13 公尺，全靠 139 根櫸木柱支撐，未用一根釘子。秋季夜楓點燈必看。',
          guide: {
            story: '「清水の舞台から飛び降りる」（從清水舞台跳下）是日文「下定決心」的俗諺。',
            booking: '夜楓特別參拜需分時段預約 <b>KYOTO-NDP</b>'
          }
        },
        {
          time: '10:00',
          type: 'spot',
          title: '二年坂・三年坂・八坂塔',
          location: { name: '三年坂', query: 'Sannenzaka' },
          desc: '京都最上鏡的石板坡道，兩旁是百年町家改建的小店。八坂塔（法觀寺）是經典取景位。',
          guide: {
            gift: '<b>よーじや</b> 吸油面紙、<b>京小物衣笠</b> 和風扭蛋、<b>抹茶 KitKat</b>',
            food: '<b>% Arabica 東山店</b> 拿鐵、<b>阿古屋茶屋</b> 茶泡飯自助'
          }
        },
        {
          time: '12:30',
          type: 'food',
          title: '菊乃井 露庵（米其林二星・午餐）',
          location: { name: '菊乃井 露庵', query: '菊乃井 露庵' },
          desc: '懷石料理入門首選，午餐「時雨便當」價格親民許多。',
          guide: {
            booking: '需提前一個月預約，代號 <b>ROAN-L12</b>',
            menu: '<b>時雨便當</b>（季節八寸 + 焚合 + 御飯）'
          }
        },
        {
          time: '15:30',
          type: 'spot',
          title: '永觀堂（禪林寺）賞楓',
          location: { name: '永觀堂', query: 'Eikando Zenrinji' },
          desc: '京都賞楓第一名所，3,000 株楓樹倒映在放生池。多寶塔展望台可遠眺京都市區。',
          guide: {
            story: '「永觀堂的回眸阿彌陀」——阿彌陀佛回頭的罕見姿態，源自永觀律師修行的傳說。'
          }
        }
      ]
    },
    {
      date: '2026-11-19',
      label: 'Day 6',
      theme: '嵐山竹林・金閣寺',
      weatherCity: 'kyoto',
      items: [
        {
          time: '08:00',
          type: 'spot',
          title: '嵐山竹林小徑',
          location: { name: '嵐山竹林', query: 'Arashiyama Bamboo Grove' },
          desc: '8 點前的竹林幾乎無人，風吹竹葉的沙沙聲被選為「日本聲音百選」。',
          guide: {
            story: '竹林小徑全長約 400 公尺，連接大河內山莊與野宮神社。野宮神社求緣分與安產靈驗。'
          }
        },
        {
          time: '10:00',
          type: 'spot',
          title: '天龍寺庭園',
          location: { name: '天龍寺', query: 'Tenryuji Temple' },
          desc: '世界遺產，曹源池庭園 700 年來保持原貌，借景嵐山的「枯山水+池泉回遊」傑作。'
        },
        {
          time: '12:00',
          type: 'food',
          title: '嵐山 よしむら（蕎麥麵）',
          location: { name: '嵐山よしむら', query: '嵐山 よしむら そば' },
          desc: '渡月橋畔二樓窗景座，邊吃手打蕎麥麵邊看桂川。',
          guide: { menu: '<b>天ざる蕎麥</b>、季節限定 <b>柚子蕎麥</b>' }
        },
        {
          time: '14:30',
          type: 'spot',
          title: '金閣寺（鹿苑寺）',
          location: { name: '金閣寺', query: 'Kinkakuji' },
          desc: '貼滿金箔的三層舍利殿倒映在鏡湖池，是京都最具代表性的畫面。午後順光最金。',
          guide: {
            story: '1950 年曾被見習僧人放火燒毀（三島由紀夫《金閣寺》以此為題），1955 年重建。',
            gift: '出口處 <b>金閣寺限定御守</b>、<b>金箔冰淇淋</b>'
          }
        },
        {
          time: '18:30',
          type: 'food',
          title: '先斗町 鳥彌三（地雞料理）',
          location: { name: '鳥彌三 先斗町', query: '鳥彌三 先斗町' },
          desc: '先斗町是鴨川旁的狹窄美食街，夏有川床（納涼床）。',
          guide: {
            menu: '<b>親子丼</b>（創業 200 年的元祖）、<b>地雞刺身拼盤</b>',
            booking: '晚餐建議預約 <b>TO-8810</b>'
          }
        }
      ]
    },
    {
      date: '2026-11-20',
      label: 'Day 7',
      theme: '返程・臨空城 Outlet',
      weatherCity: 'osaka',
      items: [
        {
          time: '09:00',
          type: 'transport',
          title: '京都 → 關西機場（Haruka 特急 75 分）',
          desc: '京都站搭 Haruka 直達關西機場。自駕者走阪神高速灣岸線，機場還車點在 Aeroplaza。'
        },
        {
          time: '10:30',
          type: 'spot',
          title: '臨空城 Premium Outlets',
          location: { name: 'りんくうプレミアムアウトレット', query: 'Rinku Premium Outlets' },
          desc: '機場前一站，250 家店鋪，最後衝刺採購。有行李寄存櫃。',
          guide: {
            gift: '<b>Royce 生巧克力</b>、<b>白色戀人</b>、<b>LeTAO 雙層起司蛋糕</b>（機場免稅店也有）'
          }
        },
        {
          time: '15:35',
          type: 'transport',
          title: '樂桃 MM029 → 台北',
          desc: '國際線建議起飛前 2 小時報到。',
          guide: { booking: '訂位代號 <b>XJ7K2P</b>' }
        }
      ]
    }
  ]
};
