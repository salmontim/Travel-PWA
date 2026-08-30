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
  title: '濟州島・自駕之旅 v2',
  subtitle: '2026/9/26 — 10/3 · 8 天 7 夜 · 順時針環島',
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
      title: '濟州市酒店（9/26・1 晚）',
      sub: '首選 Hotel Leo',
      location: { name: 'Hotel Leo Jeju', query: '호텔 레오 제주' },
      fields: [
        ['區域', '濟州市新濟州／塔洞一帶'],
        ['備選', 'Elin Hotel（蓮洞）、Bed Radio Dongmoon（青旅）'],
        ['自駕', '均有停車；位置方便抵達日'],
        ['備註', 'Day 1 抵達後先寄存行李或提早 check-in']
      ]
    },
    {
      title: '城山酒店（9/27–9/28・2 晚）',
      sub: '首選 Co-op City Hotel Seongsan',
      location: { name: 'Co-op City Hotel Seongsan', query: '코업시티호텔 성산' },
      fields: [
        ['區域', '城山邑（성산읍）'],
        ['備選', '더베스트 제주 성산 호텔、Sunrise Hotel Seongsan'],
        ['自駕', '近日出峰＋城山港；泊車及充電出發前核實'],
        ['備註', 'Day 2 到埗；Day 3 睇日出＋去牛島都唔使早起長途']
      ]
    },
    {
      title: '西歸浦酒店（9/29–9/30・2 晚）',
      sub: '首選 Shinshin Hotel Seogwipo',
      location: { name: 'Shinshin Hotel Seogwipo', query: '신신호텔 서귀포' },
      fields: [
        ['區域', '西歸浦市（近每日偶來市場）'],
        ['備選', 'Nine Boutique、Poong Gyung Hotel'],
        ['自駕', '均有停車；較方便市場及市內景點'],
        ['備註', '9/29 傍晚由城山南下入住；9/30 西歸浦市內日；10/1 退房行李上車']
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
      theme: '抵達濟州・梨湖・黑豬肉・龍頭岩・東門市場',
      weatherCity: 'jeju',
      items: [
        {
          time: '06:30',
          type: 'transport',
          title: '抵達濟州機場 CJU',
          desc: 'UO698 凌晨 02:30 從香港起飛、06:30 抵達，入境後直接往 Rent-a-Car House 移動。',
          guide: { booking: '去程機票 <b>UO698</b>' }
        },
        {
          time: '07:30',
          type: 'transport',
          title: '取車：Hyundai Ioniq 5 Long Range',
          location: { name: '濟州機場 Rent-a-Car House', query: '제주공항 렌터카하우스', lat: 33.5053, lng: 126.4927 },
          desc: '機場 Gate 5 過馬路 → Rent-a-Car House → 搭 SK 接駁車。已含 Full CDW 全保，預留 45–60 分鐘取車及拍攝車況。',
          guide: {
            booking: '租車 <b>SK Rent-a-Car</b> · Full CDW',
            story: '取車及還車各拍一段完整環車影片，記錄輪圈、擋風玻璃、內裝及電量。'
          }
        },
        {
          time: '08:30',
          type: 'transport',
          title: '機場早餐（行李留車內）→ 梨湖',
          desc: '行李留車內、不外露；簡單早餐後開往梨湖馬燈塔（約 10–15 分鐘），避免疲勞空腹駕駛。'
        },
        {
          time: '09:15',
          type: 'spot',
          title: '梨湖木筏海邊馬燈塔',
          location: { name: '梨湖木筏海邊', query: '이호테우해변', lat: 33.4977, lng: 126.4528 },
          desc: '免費、全天開放。海邊紅白小馬燈塔是濟州打卡地標，停留約 45 分鐘。'
        },
        {
          time: '10:15',
          type: 'note',
          title: '新濟州咖啡小憩',
          desc: '順路往午餐方向，在新濟州（Yeon-dong）一帶咖啡小憩。'
        },
        {
          time: '11:15',
          type: 'transport',
          title: '前往黑豬肉店・現場登記候位',
          desc: '提早到場取號，名店排隊時間長，建議 12:00 前到。'
        },
        {
          time: '12:30',
          type: 'food',
          title: '黑豬肉午餐：熟成到',
          location: { name: '熟成到', query: '숙성도', lat: 33.5020, lng: 126.5270 },
          desc: '濟州名店，專人代烤黑豬肉、肉味濃；備選 돈사돈（400g 約 44,000 韓元、免費大停車場）。',
          guide: {
            booking: '排隊時間長，建議 12:00 前到',
            menu: '<b>黑豬肉</b>（熟成到專人代烤）｜備選 돈사돈 400g 約 44,000 韓元'
          }
        },
        {
          time: '14:15',
          type: 'spot',
          title: '龍頭岩',
          location: { name: '龍頭岩', query: '용두암', lat: 33.5160, lng: 126.5120 },
          desc: '免費、全天開放；有停車場（費率現場確認）。下午光線較適合拍照。',
          guide: {
            story: '龍頭岩是濟州島地標之一，火山岩被海浪長期沖刷形似龍頭。'
          }
        },
        {
          time: '15:15',
          type: 'stay',
          title: '酒店入住・休息',
          desc: '入住或寄存後休息，把通宵航班疲勞留在酒店，傍晚再步行往東門市場一帶。'
        },
        {
          time: '17:00',
          type: 'food',
          title: '東門市場／中央地下街＋甜點',
          location: { name: '東門市場', query: '동문재래시장', lat: 33.5122, lng: 126.5276 },
          desc: '市場約 07:00–21:00；甜點店巡禮：umu 海藻布丁、Mochiron 達克瓦茲。',
          guide: {
            food: '<b>umu 布丁</b>、<b>Mochiron 達克瓦茲</b>',
            gift: '<b>柑橘巧克力</b>、<b>石頭爺爺周邊</b>'
          }
        },
        {
          time: '18:30',
          type: 'food',
          title: '東門夜市晚餐',
          desc: '5–10 月夜市 19:00–24:00 位於 8 號門；炸壽司、老奶奶年糕。免費入場。'
        },
        {
          time: '20:00',
          type: 'note',
          title: '亂打秀 Nanta（選項）',
          desc: '濟州市互動式打擊樂劇，英語導向、不需韓文底；建議 Klook 預訂。'
        }
      ]
    },
    {
      date: '2026-09-27',
      label: 'Day 2',
      theme: '東岸南下：London Bagel・月汀里・入住城山',
      weatherCity: 'east',
      items: [
        {
          time: '08:30',
          type: 'transport',
          title: '退房 → London Bagel（舊左邑）',
          desc: '行李留車內不外露，車程約 40 分鐘。'
        },
        {
          time: '09:15',
          type: 'food',
          title: 'London Bagel Museum Jeju',
          location: { name: 'London Bagel Museum Jeju', query: '런던베이글뮤지엄 제주점', lat: 33.5536, lng: 126.7156 },
          desc: '舊左邑東福路 85（近月汀里，不在涯月），08:00–18:00；蘑菇濃湯比貝果更必點；勿停對面私人停車場（超貴）。',
          guide: {
            food: '<b>蘑菇濃湯</b>必點＋招牌貝果',
            booking: '可用 Catch Table App 候位'
          }
        },
        {
          time: '10:45',
          type: 'food',
          title: 'Cafe Mou Moon（月汀里海景咖啡）',
          location: { name: 'Cafe Mou Moon', query: '카페 모문', lat: 33.5560, lng: 126.7962 },
          desc: '月汀里海景咖啡，麵包好吃、座位多，適合放空看海。'
        },
        {
          time: '11:45',
          type: 'spot',
          title: '月汀里海水浴場',
          location: { name: '月汀里海水浴場', query: '월정리해변', lat: 33.5560, lng: 126.7962 },
          desc: '免費、全天開放。白色風車與漸層海水，本程主推海岸之一。',
          guide: {
            story: '岩石延伸入海、石縫小螃蟹；彩色椅子／畫框裝置，婚紗熱點。'
          }
        },
        {
          time: '13:00',
          type: 'food',
          title: '月汀里／舊左午餐',
          desc: '제주그리미（家庭料理、在地食材）或海鮮。'
        },
        {
          time: '14:00',
          type: 'transport',
          title: '前往城山（約 40 分鐘）',
          desc: '全程向東、零折返，順路東行。'
        },
        {
          time: '14:45',
          type: 'stay',
          title: '城山酒店入住・休息',
          location: { name: '城山酒店', query: '코업시티호텔 성산', lat: 33.4640, lng: 126.9350 },
          desc: '入住城山（성산읍），唔再南下西歸浦。'
        },
        {
          time: '15:30',
          type: 'note',
          title: '城山邑散步／海女博物館（選項）',
          desc: '自由彈性；保留體力俾明日日出峰＋牛島。'
        },
        {
          time: '17:30',
          type: 'food',
          title: '晚餐：吾照海女之家',
          location: { name: '吾照海女之家', query: '오조해녀의집', lat: 33.4586, lng: 126.9406 },
          desc: '烤鮑魚偏清蒸、非常新鮮帶淡鹹味，另有綜合拼盤＋鮑魚粥；連結 1 作者私心最愛。',
          guide: {
            menu: '<b>烤鮑魚</b>＋綜合拼盤＋鮑魚粥'
          }
        }
      ]
    },
    {
      date: '2026-09-28',
      label: 'Day 3',
      theme: '城山日出峰（日出）・牛島一日',
      weatherCity: 'seongsan',
      items: [
        {
          time: '05:40',
          type: 'spot',
          title: '城山日出峰・睇日出',
          location: { name: '城山日出峰', query: '성산일출봉', lat: 33.4581, lng: 126.9425 },
          desc: '9–10 月 05:00–19:00，售票至 18:00；每月首個星期一休（9/28 為第 4 個星期一，正常開放）；成人 5,000；免費停車。步道約 30 分鐘登頂。',
          guide: {
            booking: '成人 <b>5,000 韓元</b>，免費停車',
            story: '世界自然遺產，10 萬年前海底火山噴發形成的巨大穹丘，濟州東端地標；14:00 左側步道有海女表演。'
          }
        },
        {
          time: '07:30',
          type: 'note',
          title: '回酒店早餐・補眠',
          desc: '日出後回城山酒店早餐／補眠，為牛島留力。'
        },
        {
          time: '08:15',
          type: 'transport',
          title: '城山港停車・填申請書・買票',
          location: { name: '城山港', query: '성산항', lat: 33.4703, lng: 126.9301 },
          desc: '一般租車不可上牛島，車留城山港（當日上限 5,000 韓元）。攜帶護照正本，提早 45 分鐘到港。',
          guide: {
            booking: '城山港電話 <b>064-782-5671</b>（確認船費及文件）'
          }
        },
        {
          time: '09:00',
          type: 'transport',
          title: '渡輪往牛島（下牛木洞港）',
          desc: '船程約 30 分鐘；9 月船班約每 30 分鐘一班（牛島末班 18:00）。'
        },
        {
          time: '09:30',
          type: 'spot',
          title: '牛島・環島（電動機車／單車）',
          location: { name: '牛島', query: '우도', lat: 33.5073, lng: 126.9550 },
          desc: '逆時針環島：西濱白沙海水浴場 → 東岸鯨窟 → 下古水洞海水浴場；可租電動機車（需國際駕照 A 類）或單車。',
          guide: {
            food: '<b>On-Off 炸豬排</b>、<b>BLANC ROCHER 花生冰淇淋</b>',
            story: '牛島是濟州最大附屬島嶼，以花生、海女與黑色玄武岩海岸聞名，又稱「小濟州」。如停航改城山日出峰＋涉地可支慢遊。'
          }
        },
        {
          time: '15:00',
          type: 'transport',
          title: '回城山港取車',
          desc: '勿搭末班船；取車後回城山酒店。'
        },
        {
          time: '15:30',
          type: 'stay',
          title: '城山酒店休息',
          desc: '下午留城山休息，保留體力，不安排晚間景點。'
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：城山春粥・刀切麵',
          location: { name: '城山春粥·刀切麵', query: '성산봄죽 칼국수', lat: 33.4600, lng: 126.9320 },
          desc: '韓劇 Run On 取景地；辣炒黑豬肉拌麵很辣但超好吃（中辣水準）。',
          guide: {
            menu: '<b>辣炒黑豬肉拌麵</b>（中辣）'
          }
        }
      ]
    },
    {
      date: '2026-09-29',
      label: 'Day 4',
      theme: '涉地可支（騎馬）・轉場西歸浦・南部瀑布',
      weatherCity: 'seongsan',
      items: [
        {
          time: '08:00',
          type: 'transport',
          title: '退房・行李上車 → 涉地可支',
          desc: '車程約 10 分鐘。'
        },
        {
          time: '08:30',
          type: 'spot',
          title: '涉地可支（含騎馬體驗）',
          location: { name: '涉地可支', query: '섭지코지', lat: 33.4366, lng: 126.9221 },
          desc: '免費入場；停車全日上限 3,000。火山岩海角＋騎馬體驗（出發前電話確認當日有馬）；如無馬改 Day 5 中文區。',
          guide: {
            story: '濟州東岸火山岩海角，因韓劇《All In》取景而聲名大噪；有安藤忠雄設計建築。'
          }
        },
        {
          time: '10:00',
          type: 'transport',
          title: '南下西歸浦（約 70–75 分鐘）',
          location: { name: '西歸浦市', query: '서귀포', lat: 33.2544, lng: 126.5600 },
          desc: '順路南行，傍晚前入住西歸浦。'
        },
        {
          time: '11:15',
          type: 'stay',
          title: '酒店寄存／入住',
          desc: '西歸浦酒店第一晚（9/29）。'
        },
        {
          time: '12:00',
          type: 'spot',
          title: '正房瀑布',
          location: { name: '正房瀑布', query: '정방폭포', lat: 33.2449, lng: 126.5715 },
          desc: '09:00–17:50，最後入場 17:30，全年無休；成人 2,000。亞洲少數直接落入海的瀑布；海邊石階濕滑。',
          guide: {
            booking: '成人 <b>2,000 韓元</b>'
          }
        },
        {
          time: '13:30',
          type: 'food',
          title: '每日偶來市場午餐',
          location: { name: '西歸浦每日偶來市場', query: '서귀포매일올레시장', lat: 33.2487, lng: 126.5641 },
          desc: '炸壽司（黑豬肉魷魚）＋老奶奶年糕必食；周邊公營停車場。',
          guide: {
            food: '<b>炸壽司</b>、<b>老奶奶年糕</b>'
          }
        },
        {
          time: '15:00',
          type: 'spot',
          title: '外돌개 或咖啡',
          location: { name: '外돌개', query: '외돌개', lat: 33.2415, lng: 126.5482 },
          desc: '全天開放、免費入場及停車；下午較適合海岸攝影。'
        },
        {
          time: '16:30',
          type: 'stay',
          title: '酒店休息',
          desc: '稍作休息後晚餐。'
        },
        {
          time: '18:00',
          type: 'food',
          title: '晚餐：海鮮湯',
          location: { name: '三星血海鮮湯 西歸浦店', query: '삼성혈 해물탕 서귀포점', lat: 33.2550, lng: 126.5660 },
          desc: '10:30–15:00、16:00–22:30；電話 064-739-7200 確認。'
        },
        {
          time: '19:30',
          type: 'spot',
          title: '天地淵瀑布夜景',
          location: { name: '天地淵瀑布', query: '천지연폭포', lat: 33.2469, lng: 126.5545 },
          desc: '09:00–22:00，最後入場 21:20；成人 2,000；免費停車；夜間點燈。',
          guide: {
            booking: '成人 <b>2,000 韓元</b>，免費停車'
          }
        }
      ]
    },
    {
      date: '2026-09-30',
      label: 'Day 5',
      theme: '西南花海・綠茶・騎馬',
      weatherCity: 'south',
      items: [
        {
          time: '08:30',
          type: 'transport',
          title: '前往 Camellia Hill（約 30–35 分鐘）',
          desc: '西歸浦出發，往西南環線。'
        },
        {
          time: '09:05',
          type: 'spot',
          title: 'Camellia Hill（山茶花之丘）',
          location: { name: 'Camellia Hill', query: '카멜리아힐', lat: 33.2896, lng: 126.3699 },
          desc: '3–10 月 08:30–18:30，最後入場 17:30；成人 12,000；有停車場。10 月主題粉黛亂子草＋蒲葦。',
          guide: {
            booking: '成人 <b>12,000 韓元</b>'
          }
        },
        {
          time: '11:05',
          type: 'spot',
          title: 'Osulloc 綠茶博物館',
          location: { name: 'Osulloc 雪綠茶博物館', query: '오설록 티뮤지엄', lat: 33.3059, lng: 126.2894 },
          desc: '09:00–18:00，全年無休；抹茶冰淇淋＋拿鐵；Innisfree 可一齊掃貨。',
          guide: {
            food: '<b>抹茶冰淇淋</b>、<b>抹茶拿鐵</b>',
            gift: '<b>綠茶伴手禮</b>'
          }
        },
        {
          time: '12:30',
          type: 'food',
          title: '午餐：번네식당（烤白帶魚）',
          location: { name: '번네식당', query: '번네식당', lat: 33.3100, lng: 126.2800 },
          desc: '烤白帶魚專賣，超多韓國人推薦。'
        },
        {
          time: '14:00',
          type: 'note',
          title: '大浦柱狀節理帶（選項，可 skip）',
          desc: '到此一遊型景點；連結 1 作者認為比正房更必去，但屬純觀光，可 skip。'
        },
        {
          time: '15:15',
          type: 'note',
          title: 'Jeju Horse Riding Park 騎馬（互動）',
          desc: '中文區森林騎馬；若 Day 4 涉地可支已騎過可 skip；出發前訂位。'
        },
        {
          time: '17:00',
          type: 'transport',
          title: '返回西歸浦（約 35–40 分鐘）',
          desc: '西歸浦酒店第二晚。'
        },
        {
          time: '18:30',
          type: 'food',
          title: '自由晚餐',
          desc: '西歸浦市內自由晚餐。'
        }
      ]
    },
    {
      date: '2026-10-01',
      label: 'Day 6',
      theme: '西部涯月・9.81 賽車・黑面羊農場',
      weatherCity: 'aewol',
      items: [
        {
          time: '08:00',
          type: 'transport',
          title: '退房・行李上車 → 涯月漢潭',
          desc: '西歸浦至涯月約 55–60 分鐘。'
        },
        {
          time: '09:15',
          type: 'spot',
          title: '涯月漢潭海岸步道',
          location: { name: '涯月漢潭海岸步道', query: '애월 한담해안산책로', lat: 33.4591, lng: 126.3104 },
          desc: '免費、全天開放。本程主推海岸之一；附近多伴手禮／選物店（含濟州 Miffy 專賣店）。',
          guide: {
            story: '漢潭海岸步道全長約 1.2 公里，沿黑色玄武岩海岸而建，可遠眺飛揚島。'
          }
        },
        {
          time: '10:45',
          type: 'food',
          title: 'Haejigae Cafe（海景咖啡）',
          location: { name: 'Haejigae Cafe', query: '해지개 카페', lat: 33.4642, lng: 126.3090 },
          desc: '海景咖啡，先找位再點餐；有戶外位＋三層內用位，下午曬；備選春日咖啡 봄날（海景第一排）。'
        },
        {
          time: '11:45',
          type: 'food',
          title: '涯月甜點＋選物',
          desc: 'siso kaymak（土耳其奶油包，現場食）、집의기록상점（蛋塔）；Miffy 專賣店亦在此。'
        },
        {
          time: '12:45',
          type: 'transport',
          title: '前往 9.81 公園（約 20–25 分鐘）',
          desc: '西部單向，順路。'
        },
        {
          time: '13:15',
          type: 'note',
          title: '9.81 重力賽車公園（互動）',
          location: { name: '9.81 公園', query: '9.81파크', lat: 33.4000, lng: 126.2400 },
          desc: '大型重力賽車，快感極限；建議 Klook／KKday 預約，停留約 2.5 小時。',
          guide: {
            booking: '建議 <b>Klook/KKday 預約</b>'
          }
        },
        {
          time: '15:45',
          type: 'note',
          title: 'SaeByeol Friends Zoo（黑面羊農場）',
          location: { name: 'SaeByeol Friends Zoo', query: '새별프렌즈동물원', lat: 33.3900, lng: 126.3000 },
          desc: '超可愛黑面羊（黑頭羊），室內空間、可餵食，動物種類多；位於새빌 Saebil 粉黛子草咖啡廳旁。',
          guide: {
            food: '<b>餵食體驗</b>黑面羊'
          }
        },
        {
          time: '17:30',
          type: 'transport',
          title: '北返機場酒店（約 50–60 分鐘）',
          desc: '入住機場附近酒店（Hotel JM／Sweet／Major）。'
        },
        {
          time: '18:30',
          type: 'stay',
          title: '入住機場附近酒店',
          desc: '機場酒店第一晚（10/1、10/2 共 2 晚）。'
        }
      ]
    },
    {
      date: '2026-10-02',
      label: 'Day 7',
      theme: '北部還車日：東門市場採買・還車',
      weatherCity: 'jeju',
      items: [
        {
          time: '09:00',
          type: 'note',
          title: '酒店早餐・整理行李',
          desc: '還車日由機場出發，無需南下，朝頭好鬆動；行李可先寄存酒店。'
        },
        {
          time: '09:30',
          type: 'transport',
          title: '前往東門市場',
          desc: '約 20 分鐘車程。'
        },
        {
          time: '10:15',
          type: 'food',
          title: '東門市場＋中央地下街 採買',
          location: { name: '東門市場', query: '동문재래시장', lat: 33.5122, lng: 126.5276 },
          desc: '最後採買（約 2.5 小時），公營停車場收費。',
          guide: {
            gift: '<b>柑橘巧克力</b>、<b>石頭爺爺周邊</b>、<b>Olive Young 保養品</b>'
          }
        },
        {
          time: '12:45',
          type: 'food',
          title: '午餐：熟成到 或 橡子廚房',
          location: { name: '熟成到', query: '숙성도', lat: 33.5020, lng: 126.5270 },
          desc: '熟成到黑豬肉（Day 1 或 Day 7 二選一）或橡子廚房（柑橘蕎麥麵）；旁有馬卡龍 Gomimi。',
          guide: {
            food: '<b>熟成到黑豬肉</b>｜備選 橡子廚房柑橘蕎麥麵'
          }
        },
        {
          time: '14:15',
          type: 'food',
          title: '甜點店巡禮',
          desc: 'umu 布丁、Mochiron 達克瓦茲、Gomimi 馬卡龍，打包手信。'
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
          title: '補電・整理・拍車況',
          desc: '依租車合約補足電量；取車及還車各拍完整環車影片。'
        },
        {
          time: '18:30',
          type: 'transport',
          title: '前往 SK Rent-a-Car・還車',
          location: { name: 'SK Rent-a-Car 濟州', query: 'SK렌터카 제주', lat: 33.5041, lng: 126.5023 },
          desc: '19:15 到店，20:00 前完成還車及接駁。',
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

/* ============================================================
   後備方案資料庫 — 記錄所有備用景點／餐廳／活動／住宿
   （★＝已排入主行程；☆＝備用，可隨時調動替換）
   ============================================================ */
const BACKUP = {
  // 濟州各海岸評比（連結 3，2019/09 實地）
  beaches: [
    { rank: '①', name: '涯月漢潭散步路', ko: '애월한담산책로', note: '咖啡廳各具特色、多數臨海（春日＝海景第一排），較商業化但值得二訪' },
    { rank: '②', name: '細花海邊', ko: '세화해변', note: '未開發、寧靜；堤防打卡點；可沿海走到海女博物館' },
    { rank: '③', name: '月汀里海水浴場', ko: '월정리해수욕장', note: '岩石延伸入海、彩色椅子畫框裝置；婚紗熱點' },
    { rank: '③', name: '咸德海水浴場', ko: '함덕해수욕장', note: '漸層海＋愛心沙灘；咸德犀牛峰（秋芒草、有馬）' },
    { rank: '⑤', name: '挟才海邊', ko: '협재해변', note: '正對飛揚島、混貝殼砂；餐廳不在海灘旁，需遠眺' },
    { rank: '⑤', name: '梨湖木筏海邊', ko: '이호테우해변', note: '紅白小馬燈塔（夜景美）；除小馬外特色較少' }
  ],

  // 備用景點（按方位）
  spots: [
    {
      region: '北部／濟州市',
      items: [
        { name: '濟州民俗五日市場', note: '逢 2、7 日開的傳統市集' },
        { name: '道頭洞彩虹海岸道路', note: '' },
        { name: 'kakao friends 濟州總部', note: '' },
        { name: '牧官衙', note: '' },
        { name: '塔洞海旁', note: '' },
        { name: '濟州 4·3 和平紀念館', note: '歷史沈重' },
        { name: 'The Islander 紀念品店', note: '' }
      ]
    },
    {
      region: '東岸／城山',
      items: [
        { name: '咸德海灘', note: '降為快閃' },
        { name: '細花海邊', note: '未開發、寧靜' },
        { name: '萬丈窟', note: '成人 4,000；首個星期三休；雨天備案' },
        { name: '山君不離', note: '芒草海' },
        { name: '와흘메밀마을협의회', note: '蕎麥花季' },
        { name: '海女博物館', note: '' }
      ]
    },
    {
      region: '南岸／西歸浦',
      items: [
        { name: '天帝淵瀑布', note: '出發前確認' },
        { name: '大浦柱狀節理帶', note: '連結 1 作者認為比正房更必去' },
        { name: '偶來七號小路', note: '健行' },
        { name: 'Hill of Storms 懸崖海邊', note: '' },
        { name: '漢拏山靈室登山路', note: '健行' },
        { name: 'Blue Bottle Jeju 藍瓶', note: '' },
        { name: 'analogue 柑橘農場', note: '採橘子咖啡' }
      ]
    },
    {
      region: '西南／西部',
      items: [
        { name: '翰林公園', note: '成人 15,000' },
        { name: '協才海灘', note: '降為快閃' },
        { name: '金陵海灘 Geumneung Beach', note: '' },
        { name: '山房山／龍頭海岸', note: '成人 2,000；潮汐決定' },
        { name: '새빌 Saebil 粉黛子草咖啡廳', note: '' },
        { name: '春日咖啡館 BOMNAL', note: '' },
        { name: 'Sunset Cliff', note: '峇里風 Cafe&Bar' }
      ]
    }
  ],

  // 備用餐廳／咖啡／甜點
  food: [
    { name: '돈사돈 본점 Donsadon', type: '黑豬肉', area: '濟州市', note: '400g 約 44,000；免費大停車場' },
    { name: '黑豚家', type: '黑豬肉', area: '黑豬肉一條街', note: '' },
    { name: 'Dolhareubang Ttukbaegi', type: '午市', area: '城山', note: '只供午市' },
    { name: 'Haeilri Cafe', type: '咖啡', area: '城山', note: '' },
    { name: '어조횟집', type: '生魚片', area: '城山', note: '' },
    { name: 'Poong Won 풍원', type: '漢拏山炒飯', area: '牛島', note: '' },
    { name: '방긋스낵 微笑小吃店', type: '海鮮年糕鍋', area: '月汀里', note: '' },
    { name: 'STAY SALTY', type: '海景咖啡', area: '月汀里', note: '' },
    { name: '去北村的話 북촌에 가면', type: '粉紅草咖啡', area: '北村', note: '' },
    { name: '참솔식당', type: '韓式', area: '漢拏山附近', note: '' },
    { name: '삼성혈 해물탕', type: '海鮮湯', area: '濟州／西歸浦', note: '電話 064-739-7200' },
    { name: 'Cafe Tangerine Flower Attic', type: '柑橘咖啡', area: '西歸浦', note: '' },
    { name: '橘花閣樓', type: '橘子主題咖啡', area: '中文', note: '' },
    { name: 'volskafé', type: '咖啡', area: '中文', note: '' },
    { name: '春日咖啡 봄날', type: '海景咖啡', area: '涯月', note: '海景第一排' },
    { name: '紅色濟州 붉은제주', type: '海鮮盤', area: '涯月', note: '' },
    { name: 'Sunset Cliff', type: 'Cafe&Bar', area: '涯月', note: '' },
    { name: '你好挟才先生 안녕협재씨', type: '海鮮拌飯', area: '挟才', note: '' },
    { name: '金滿福鮑魚紫菜飯捲', type: '飯捲', area: '—', note: '' },
    { name: '桔品黑豬肉', type: '黑豬肉吃到飽', area: '濟州市', note: '平價' },
    { name: '醬蟹 이게밥도둑', type: '醬蟹', area: '濟州市', note: '' },
    { name: 'Bhc Chicken', type: '炸雞', area: '濟州市', note: '' },
    { name: 'Abebe Bakery', type: '甜甜圈', area: '東門市場', note: '12 號門旁' },
    { name: 'Jeju Gwanghae 제주광해', type: '帶魚燉煮', area: '涯月', note: '10:00–20:00' },
    { name: 'Chunsimine 춘심이네', type: '烤帶魚', area: '西南', note: '' },
    { name: 'Jejudang 제주당', type: '蔬菜麵包', area: '西南', note: '' },
    { name: 'Waboda Bakery 와보다', type: '麵包', area: '機場附近', note: '營業時間未核實' },
    { name: '장가네 일품순두부 한림점', type: '嫩豆腐鍋', area: '翰林', note: '' },
    { name: 'Jeju Sicha', type: '下午茶', area: '—', note: '' },
    { name: '온평바다한그릇', type: '海產', area: '城山／東岸', note: '' },
    { name: '유동커피', type: '咖啡', area: '西歸浦', note: '' },
    { name: '細花小姐文具店', type: '選物文具', area: '細花', note: '明信片框只此一家' },
    { name: '咖啡漢拏山 카페한라산', type: '老屋咖啡', area: '細花', note: '' },
    { name: '唯美蠟燭 위미캔들', type: '紀念品', area: '—', note: '全濟州最美紀念品' }
  ],

  // 備用互動活動（陸上為主）
  activities: [
    { name: '漢拏山健行', area: '中部', note: '靈室路線' },
    { name: '偶來小路健行', area: '西歸浦', note: '偶來七號' },
    { name: '海女表演', area: '城山日出峰', note: '每日 14:00；免費' }
  ],

  // 備用住宿（實住點評＋候選）
  stays: [
    { name: 'Elin Hotel', area: '蓮洞', note: '房小、停車位難停，環境舒服' },
    { name: 'Bed Radio Dongmoon', area: '濟州市', note: '市區平價青旅' },
    { name: '더베스트 제주 성산', area: '城山', note: '含早餐' },
    { name: 'Sunrise Hotel Seongsan', area: '城山', note: '親民' },
    { name: 'Breeze Bay Hotel', area: '城山', note: '❌ 不推（像辦公室）' },
    { name: 'Nine Boutique', area: '西歸浦', note: '' },
    { name: 'Poong Gyung Hotel', area: '西歸浦', note: '' },
    { name: 'W Ocean Pension', area: '中文', note: '有廚房民宿，房床大' },
    { name: 'Sweet Hotel', area: '機場附近', note: '' },
    { name: 'Major Hotel', area: '機場附近', note: '' },
    { name: 'Jeju Sky Resort', area: '翰林', note: '房小、環境舒服' }
  ],

  // 天氣／突發備案
  weatherPlans: [
    { scenario: '牛島停航', plan: '取消登島，保留城山日出峰、涉地可支＋長午餐，可提早南下西歸浦；有 4–5 天緩衝可改期' },
    { scenario: '萬丈窟（雨天備案）', plan: '東岸下雨時取代海岸步道／月汀里，屬室內最佳選' },
    { scenario: '大雨／強風', plan: '取消海岸步道與外돌개，優先 Osulloc、咖啡店、市場、黑面羊農場（室內）及酒店休息' },
    { scenario: '涉地可支騎馬暫停', plan: '改 Day 5 中文區 Jeju Horse Riding Park' },
    { scenario: '9.81／黑面羊調整', plan: '兩者均喺北部西部，可彈性移到 Day 7 早上' },
    { scenario: '疲勞管理', plan: 'Day 1 下午固定休息；Day 3 下午留城山休息；延誤 60 分鐘以上先刪咖啡／次要景點' }
  ]
};
