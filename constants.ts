import { DaySchedule, ChecklistItem, LocationDetail, UsefulLink, EmergencyContact } from './types';

// 極致安全的環境變數讀取
const getEnvUrl = () => {
  try {
    // 檢查 import.meta 是否存在，避免非 Vite 環境噴錯
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env.VITE_APP_SCRIPT_URL;
    }
  } catch (e) {
    // 忽略錯誤
  }
  return null;
};

export const GOOGLE_SCRIPT_URL = getEnvUrl() || 'https://script.google.com/macros/s/AKfycby5UHb7MlZJC61uBNA_WKK8FG5KowmyLzyBBaUTb0GtHYj6ZrPWdhU9RieXbuJMKTxC/exec';
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1hT-ZhrWeRmMdcjt5vOa32xAWqQ7HW_UjADERuDFmGdM/edit?usp=sharing';

export const PRE_TRIP_NOTES = [
  "北海道冬季溫差大，室外約 -10~5°C，室內暖氣極強",
  "建議採「洋蔥式穿法」，外套需防風潑水",
  "必備雪地止滑鞋墊 or 穿著抓地力佳的雪靴",
  "冬季氣候乾燥，隨身攜帶護脣膏、乳液與保濕用品",
  "護照、日圓現金、信用卡務必隨身攜帶"
];

export const TODO_LIST: ChecklistItem[] = [
  { id: 'todo_1', text: 'eSIM 或 漫遊 (5日)' },
  { id: 'todo_2', text: 'Visit Japan Web 入境登錄' },
  { id: 'todo_3', text: '旅遊保險 (海外突發疾病建議)' },
  { id: 'todo_4', text: '換好足夠日圓現金 (部分景點僅收現金)' },
  { id: 'todo_5', text: '準備好台灣駕照與譯本 (若有自駕需求)' },
];

export const PACKING_CARRY_ON: ChecklistItem[] = [
  { id: 'co_1', text: '護照正本、機票行程單' },
  { id: 'co_2', text: '充電器、行動電源、線材' },
  { id: 'co_3', text: '常用藥品 (止瀉、止痛、感冒藥)' },
  { id: 'co_4', text: '錢包 (外幣、台幣、信用卡)' },
  { id: 'co_5', text: '保溫瓶 (雪地喝熱水必備)' },
  { id: 'co_7', text: '暖暖包 (放外套口袋)' },
];

export const PACKING_CHECKED: ChecklistItem[] = [
  { id: 'ch_1', text: '厚羽絨衣、防風防水外套' },
  { id: 'ch_2', text: '發熱衣褲 (兩層建議)' },
  { id: 'ch_3', text: '毛帽、圍巾、防水手套' },
  { id: 'ch_5', text: '雪地靴 or 抓地鞋' },
  { id: 'ch_6', text: '盥洗用品、保養品、保濕乳液' },
  { id: 'ch_8', text: '太陽眼鏡 (防雪盲)' },
];

export const USEFUL_LINKS: UsefulLink[] = [
  { title: 'Visit Japan Web (入境手續)', url: 'https://vjw-lp.digital.go.jp/zh-hant/' },
  { title: '北海道天氣預報', url: 'https://tenki.jp/forecast/1/2/' },
  { title: '星野 TOMAMU 設施指南', url: 'https://www.snowtomamu.jp/winter/zh/' },
  { title: '新千歲機場地圖', url: 'https://www.new-chitose-airport.jp/tw/tmap/' },
  { title: '札幌白色燈樹節官網', url: 'https://white-illumination.jp/' },
  { title: '小樽雪物語資訊', url: 'https://otaru.gr.jp/snowstory/' },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { title: '警察', number: '110' },
  { title: '救護/火警', number: '119' },
  { title: '訪日外國人急難熱線 (JNTO)', number: '050-3816-2787', note: '24小時多語種對應' },
];

export const JAPANESE_PHRASES = [
  {
    category: '地名',
    vocab: [
      { jp: '札幌 (さっぽろ)', cn: 'Sapporo' },
      { jp: '小樽 (おたる)', cn: 'Otaru' },
      { jp: '層雲峡 (そううんきょう)', cn: 'Sounkyo' },
      { jp: '網走 (あばしり)', cn: 'Abashiri' },
      { jp: '阿寒湖 (あかんこ)', cn: 'Lake Akan' },
      { jp: '釧路 (くしろ)', cn: 'Kushiro' },
      { jp: '千歲 (ちとせ)', cn: 'Chitose' },
      { jp: '北海道神宮 (ほっかいどうじんぐう)', cn: 'Hokkaido Shrine' },
      { jp: '大通公園 (おおどおりこうえん)', cn: 'Odori Park' },
      { jp: '摩周湖 (ましゅうこ)', cn: 'Lake Mashu' },
      { jp: '星野リゾート (ほしのりぞーと)', cn: 'Hoshino Resorts' },
      { jp: '白金青い池 (しろがねあおいいけ)', cn: 'Shirogane Blue Pond' },
    ],
    sentences: []
  },
  {
    category: '活動與設施',
    vocab: [
      { jp: '露天風呂 (ろてんぶろ)', cn: '露天溫泉' },
      { jp: '雪まつり (ゆきまつり)', cn: '雪祭' },
      { jp: '流冰 (りゅうひょう)', cn: '流冰' },
      { jp: 'カニ (かに)', cn: '螃蟹' },
      { jp: 'ジンギスカン', cn: '成吉思汗烤羊肉' },
    ],
    sentences: [
      { jp: '温泉（おんせん）はどこですか？', cn: '溫泉在哪裡？' },
      { jp: '一番（いちばん）人気（にんき）のメニューはどれですか？', cn: '最受歡迎的菜單是哪一個？' },
    ]
  }
];

export const LOCATION_DETAILS: Record<string, LocationDetail> = {
  'hotel_tsubaki': {
    id: 'hotel_tsubaki',
    title: '札幌椿高級飯店 (Premier Hotel Tsubaki Sapporo)',
    description: '寬敞舒適的歐式風格客房，鄰近豐平川。晚餐提供著名的螃蟹、和牛與海鮮吃到飽，是首晚放鬆的最佳選擇。',
    address: '北海道札幌市豊平区豊平4条1丁目1-1',
    carNaviPhone: '011-821-1111',
    mapUrl: 'https://maps.app.goo.gl/UpZz8V1M9EH6N3VU8',
    websiteUrl: 'https://premier.hotel-tsubaki.jp/',
    reservation: {
      id: 'PH-1217-SAP',
      sections: [
        {
          title: '入住資訊',
          items: [
            { label: 'Check-in', value: '12/17 15:00' },
            { label: '房型', value: '雙人房 (含早餐)' },
            { label: '備註', value: '晚餐預約 20:00 於飯店餐廳', isFullWidth: true }
          ]
        }
      ]
    }
  },
  'hokkaido_jingu': {
    id: 'hokkaido_jingu',
    title: '北海道神宮',
    description: '北海道最大的神社，主祀開拓三神。冬季雪景下的神宮更顯莊嚴靜謐，是祈求旅途平安的必經之地。',
    address: '北海道札幌市中央区宮ヶ丘474',
    openingHours: '07:00 - 16:00 (冬季)',
    carNaviPhone: '011-621-1515',
    mapUrl: 'https://maps.app.goo.gl/uXpXhG5o6V7m2T8A7'
  },
  'odori_park': {
    id: 'odori_park',
    title: '大通公園 / 白色燈樹節',
    description: '札幌市中心的大型公園。12月期間會有著名的白色燈樹節 (White Illumination)，數萬顆燈泡裝飾在雪地上，極致浪漫。',
    openingHours: '燈飾點亮時間：16:30 - 22:00',
    mapUrl: 'https://maps.app.goo.gl/9uG5C7Z6V1m1Q3B8A'
  },
  'otaru_canal': {
    id: 'otaru_canal',
    title: '小樽運河與歷史建築',
    description: '保留了大正時代歷史感的小樽運河。兩旁磚石倉庫群在夜間點亮煤氣燈後，彷彿置身於懷舊電影場景中時。',
    address: '北海道小樽市港町',
    carNaviPhone: '0134-32-4111',
    mapUrl: 'https://maps.app.goo.gl/hG6pLzM49y5dGjGWA'
  },
  'hotel_taisetsu': {
    id: 'hotel_taisetsu',
    title: '層雲峽大雪飯店 (Hotel Taisetsu)',
    description: '位於層雲峽溫泉區最高處，擁有三處不同風格的大浴場。可以一邊泡湯一邊俯瞰銀白色的峽谷美景。',
    address: '北海道上川郡上川町層雲峡温泉',
    carNaviPhone: '01658-5-3211',
    mapUrl: 'https://maps.app.goo.gl/x1PnBXGBP7BYgPFK6',
    websiteUrl: 'http://www.hotel-taisetsu.com/',
    reservation: {
      id: 'TAI-1218-SOUN',
      sections: [
        {
          title: '住宿明細',
          items: [
            { label: 'Check-in', value: '12/18 15:00' },
            { label: '餐食', value: '一泊二食 (和洋自助)' },
            { label: '溫泉', value: '天風之湯、大雪乃湯', isFullWidth: true }
          ]
        }
      ]
    }
  },
  'ginga_waterfall': {
    id: 'ginga_waterfall',
    title: '銀河、流星瀑布',
    description: '層雲峽著名的兩大瀑布。冬季時分瀑布會結成壯觀的藍色冰瀑，是大自然的冰雪藝術品。',
    address: '北海道上川郡上川町層雲峡',
    carNaviPhone: '01658-2-1811',
    mapUrl: 'https://maps.app.goo.gl/EayfL7L4Yg5V5u9K9'
  },
  'kitami_fox_farm': {
    id: 'kitami_fox_farm',
    title: '北見狐狸村 (北きつね牧場)',
    description: '這裡有數十隻野生狐狸放養在廣闊的區域內。您可以近距離觀察狐狸在雪地奔跑嬉戲的可愛模樣。',
    address: '北海道北見市留辺蘂町花丘52-1',
    openingHours: '09:00 - 16:00',
    carNaviPhone: '0157-45-2249',
    mapUrl: 'https://maps.app.goo.gl/f2s7S7M6G5y9R8P7A'
  },
  'abashiri_prison': {
    id: 'abashiri_prison',
    title: '網走監獄博物館',
    description: '原為日本最嚴酷的監獄。現在則展示了明治時期的監獄建築、獄警生活以及開拓北海道的艱辛歷史。',
    address: '北海道網走市字呼人1-1',
    openingHours: '09:00 - 17:00',
    carNaviPhone: '0152-44-5463',
    mapUrl: 'https://maps.app.goo.gl/p2R7S7M6G5y9R8P7A'
  },
  'lake_mashu': {
    id: 'lake_mashu',
    title: '摩周湖 (霧之摩周)',
    description: '全世界透明度最高的湖泊之一。冬季湛藍的湖水與四周積雪的火山口壁遊戲中時。',
    address: '北海道川上郡弟子屈町摩周',
    mapUrl: 'https://maps.app.goo.gl/m2R7S7M6G5y9R8P7A'
  },
  'hotel_tsuruga_wings': {
    id: 'hotel_tsuruga_wings',
    title: '阿寒鶴雅溫泉飯店 (WINGS館)',
    description: '結合現代感與阿寒湖自然元素的飯店。大廳展示了壯觀的木雕，且能盡情享受阿寒湖畔的奢華溫泉。',
    address: '北海道釧路市阿寒町阿寒湖温泉4丁目6-10',
    carNaviPhone: '0154-67-2531',
    mapUrl: 'https://maps.app.goo.gl/z2dwnh4p3776Pdom6',
    websiteUrl: 'https://www.tsurugawings.com/',
    reservation: {
      id: 'WINGS-1219-AKAN',
      sections: [
        {
          title: '預約詳情',
          items: [
            { label: 'Check-in', value: '12/19 15:00' },
            { label: '房型', value: '和洋室 湖側見', isFullWidth: true }
          ]
        }
      ]
    }
  },
  'hoshino_tomamu': {
    id: 'hoshino_tomamu',
    title: '星野 TOMAMU 渡假村',
    description: '北海道頂級渡假村。亮點包含安藤忠雄「水之教堂」、微笑海灘、以及冬季限定、全由冰塊建成的「愛絲冰城」。',
    address: '北海道勇払郡占冠村中トマム',
    carNaviPhone: '0167-58-1111',
    mapUrl: 'https://maps.app.goo.gl/5f5mjqX2JC6CfYvx5',
    websiteUrl: 'https://www.snowtomamu.jp/',
    reservation: {
      id: 'TOM-1220-STAR',
      sections: [
        {
          title: '渡假村資訊',
          items: [
            { label: 'Tower', value: 'The Tower 館' },
            { label: '早餐', value: 'Nininupuri 森林餐廳', isFullWidth: true }
          ]
        }
      ]
    }
  },
  'kushiro_marsh': {
    id: 'kushiro_marsh',
    title: '釧路濕原展望台',
    description: '日本最大的濕地，是丹頂鶴的故鄉。冬季可以見到成群的丹頂鶴在銀白色的原野中優雅地漫步。',
    address: '北海道釧路市北斗6-11',
    openingHours: '09:00 - 16:00',
    carNaviPhone: '0154-56-2424',
    mapUrl: 'https://maps.app.goo.gl/k2R7S7M6G5y9R8P7A'
  },
  'mitsui_outlet': {
    id: 'mitsui_outlet',
    title: '三井 Outlet 購物廣場 (北廣島)',
    description: '北海道最大的室內 Outlet。匯集了世界各大品牌與多樣化的美食廣場，是回國前採買的最佳去處。',
    address: '北海道北広島市大曲幸町3丁目7-6',
    openingHours: '10:00 - 20:00',
    carNaviPhone: '011-377-3200',
    mapUrl: 'https://maps.app.goo.gl/m2S7S7M6G5y9R8P7A'
  }
};

export const ITINERARY: DaySchedule[] = [
  {
    date: '12/17',
    weekday: '星期三',
    title: '桃園 → 札幌：城市散策',
    accommodation: '札幌椿高級飯店',
    accommodationMapUrl: 'https://maps.app.goo.gl/UpZz8V1M9EH6N3VU8',
    mapUrl: 'https://www.google.com/maps/dir/New+Chitose+Airport/Hokkaido+Jingu/Odori+Park/Premier+Hotel+Tsubaki+Sapporo',
    events: [
      { time: '09:20', description: '桃園機場 (JX850) 出發', note: '航班資訊僅供參考' },
      { time: '14:05', description: '抵達新千歲機場', note: '辦理入境與前往札幌' },
      { time: '15:30', description: '北海道神宮參拜', isHighlight: true, locationId: 'hokkaido_jingu' },
      { time: '16:30', description: '札幌市區觀光', note: '時計台、舊道廳、大通公園', locationId: 'odori_park' },
      { time: '18:30', description: '欣賞札幌白色燈樹節燈飾', isHighlight: true, locationId: 'odori_park' },
      { time: '20:00', description: '飯店晚餐：螃蟹和牛海鮮吃到飽', locationId: 'hotel_tsubaki' },
    ]
  },
  {
    date: '12/18',
    weekday: '星期四',
    title: '小樽浪漫散策 → 層雲峽',
    accommodation: '層雲峽大雪飯店',
    accommodationMapUrl: 'https://maps.app.goo.gl/x1PnBXGBP7BYgPFK6',
    mapUrl: 'https://www.google.com/maps/dir/Premier+Hotel+Tsubaki+Sapporo/Otaru+Canal/Hotel+Taisetsu',
    events: [
      { time: '09:00', description: '上午免稅店購物' },
      { time: '10:30', description: '小樽一日遊', note: '運河、蒸氣鐘、音樂盒堂', locationId: 'otaru_canal', isHighlight: true },
      { time: '13:00', description: '銀之鐘咖啡 (下午茶)', note: '含起司蛋糕＋HELLO KITTY 杯' },
      { time: '16:00', description: '小樽雪物語與聖誕燈飾', isHighlight: true, locationId: 'otaru_canal' },
      { time: '17:30', description: '前往層雲峽溫泉區' },
      { time: '19:30', description: '入住飯店享用自助晚餐', locationId: 'hotel_taisetsu' },
    ]
  },
  {
    date: '12/19',
    weekday: '星期五',
    title: '銀河瀑布 → 網走 → 阿寒湖',
    accommodation: '阿寒鶴雅溫泉飯店 (WINGS館)',
    accommodationMapUrl: 'https://maps.app.goo.gl/z2dwnh4p3776Pdom6',
    mapUrl: 'https://www.google.com/maps/dir/Hotel+Taisetsu/Ginga+Waterfall/Kitami+Fox+Farm/Abashiri+Prison/Lake+Mashu/Lake+Akan+Tsuruga+Wings',
    events: [
      { time: '08:30', description: '銀河、流星瀑布景觀', locationId: 'ginga_waterfall' },
      { time: '10:00', description: '北見狐狸村', note: '與野生狐狸互動', locationId: 'kitami_fox_farm' },
      { time: '11:30', description: '網走監獄、鄂霍次克流冰館', locationId: 'abashiri_prison' },
      { time: '14:30', description: '摩周湖眺望', isHighlight: true, locationId: 'lake_mashu' },
      { time: '16:00', description: '阿寒湖三合一雪上活動', note: '香蕉船、越野車、雪上摩托車', isHighlight: true },
      { time: '18:00', description: '阿寒湖溫泉街散策與愛努村', locationId: 'hotel_tsuruga_wings' },
    ]
  },
  {
    date: '12/20',
    weekday: '星期六',
    title: '釧路濕原 → 星野 TOMAMU',
    accommodation: '星野 TOMAMU 渡假村',
    accommodationMapUrl: 'https://maps.app.goo.gl/5f5mjqX2JC6CfYvx5',
    mapUrl: 'https://www.google.com/maps/dir/Lake+Akan+Tsuruga+Wings/Kushiro+Marsh+Observatory/Hoshino+Resorts+TOMAMU',
    events: [
      { time: '09:00', description: '釧路濕原與展望台', locationId: 'kushiro_marsh' },
      { time: '10:30', description: '丹頂鶴自然公園' },
      { time: '14:30', description: '抵達星野 TOMAMU 渡假村', isHighlight: true, locationId: 'hoshino_tomamu' },
      { time: '15:30', description: '微笑海灘、木林之湯泡湯' },
      { time: '17:30', description: '水之教堂參觀', isHighlight: true },
      { time: '19:30', description: '森林自助餐廳 Nininupuri 晚餐' },
      { time: '21:00', description: '漫步愛絲冰城 ICE VILLAGE', isHighlight: true },
    ]
  },
  {
    date: '12/21',
    weekday: '星期日',
    title: '霧冰平台 → 歸國',
    mapUrl: 'https://www.google.com/maps/dir/Hoshino+Resorts+TOMAMU/Mitsui+Outlet+Park+Sapporo+Kitahiroshima/New+Chitose+Airport',
    events: [
      { time: '08:30', description: '霧冰纜車上山', note: '欣賞日高山脈霧冰景觀', isHighlight: true },
      { time: '11:00', description: '三井 Outlet 購物廣場', isHighlight: true, locationId: 'mitsui_outlet' },
      { time: '13:30', description: '前往新千歲機場' },
      { time: '15:20', description: '新千歲 (JX851) 出發', note: '航班資訊僅供參考' },
      { time: '19:05', description: '返抵桃園機場', isHighlight: true },
    ]
  }
];