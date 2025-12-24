"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ==================================================
// 1. データ定義 (すべてのデータをここで定義します)
// ==================================================

// --- クリーチャー図鑑データ ---
let creatures = [
    {
        id: 1,
        name: "ニンジャ",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "無",
        cost: "G80",
        st: 40,
        hp: 40,
        item_limit: "なし",
        ability: "先制 : 巻物強打",
        memo: "■先制 = 防御側でも先手を取って攻撃することができる\n■巻物強打 = 巻物を使用して攻撃する時に1.5倍のダメージを与える",
        description: "闇に生きる間者。巻物を駆使し、様々な呪文を操る。また、その動きは素早い。",
        usage_note: "能力が優秀なためコストが高い，使うべきところで使う必要がある．"
    },
    {
        id: 2,
        name: "オールドウィロウ",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "R",
        element: "火",
        cost: "G40+火土地2",
        st: 20,
        hp: 40,
        item_limit: "剣，巻物",
        ability: "防御型 : 火地形に配置すると、使用者以外の通過セプターをその領地に止まらせる",
        memo: "■防御型 = 侵略に使用できず、領地コマンドでクリーチャー移動できない",
        description: "邪悪な心を持つ年老いたやなぎ。近づく者を捕らえ、その体に取り込もうとする。",
        usage_note: "土地が2つ必要かつ防御型のため，このカードをメインで使わない場合は，ブックに入れないほうが良いと思う．"
    },
    {
        id: 3,
        name: "フェイト",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "水",
        cost: "G60",
        st: 30,
        hp: 40,
        item_limit: "なし",
        ability: "領地[40]使用者はカードを1枚引く : 戦闘で破壊された場合、使用者はカードを1枚引く",
        memo: "■領地能力 = 領地コマンドで使用することができスペル効果を発揮する \n■使用者の手札が6枚の時はカードを引けない",
        description: "運命を司る魔女。セプターたちの運命を全て把握しており、頼めばそれを知ることができる。",
        usage_note: "汎用性の高いクリーチャーで，最初のばらまきなどに使いやすい．"
    },
    {
        id: 4,
        name: "バルキリー ",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "火",
        cost: "G70+火土地1",
        st: 30,
        hp: 30,
        item_limit: "なし",
        ability: "先制 : 援護 : 対戦相手を破壊するとST+10(最大80まで)",
        memo: "■先制 = 防御側でも先手を取って攻撃することができる \n■援護 = 手札のクリーチャーカードをアイテムとして使用できる",
        description: "破壊神の使い。戦士の魂を神に差し出すことで力を得る。",
        usage_note: "攻撃的なセプターはこのクリーチャがおすすめ，先制援護なので使いやすい．"
    },
    {
        id: 5,
        name: "コーンフォーク",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "N",
        element: "風",
        cost: "G70",
        st: 30,
        hp: 40,
        item_limit: "なし",
        ability: "戦闘又はスペルや領地能力で破壊されると、使用者に200Gの魔力を与える",
        memo: "特記事項なし",
        description: "とうもろこし人。倒されると体中の実がはじけ飛ぶ。その実は食べると美味いらしい。",
        usage_note: "序盤のばらまきに最適！倒されてもお金が入るため，アイテムのグースと組み合わせるとGがかなり稼げる"
    },
    {
        id: 6,
        name: "マッドマン",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "地",
        cost: "G65",
        st: 20,
        hp: 40,
        item_limit: "防具",
        ability: "戦闘中、HP+配置地クリーチャーの数×5",
        memo: "特記事項なし",
        description: "泥の体を持つ怪人。地の精霊力が強くなるほど巨大化して行く。",
        usage_note: "地属性のクリーチャーを入れる時は入れると強いが，防具が使えないため，アイテムはリング系のものを入れると良い"
    },
    {
        id: 7,
        name: "パウダーイーター",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "風",
        cost: "G0",
        st: 1,
        hp: 1,
        item_limit: "巻物",
        ability: "移動時に増殖し、元の領地と移動先の両方に配置される",
        memo: "■スペルによって移動した場合、効果(増殖)は起こらない",
        description: "綿毛のような物。風に乗って現れ、気づかないうちにどんどん増えてしまう。",
        usage_note: "MHPを増やせるスペルを使ってから増やすと，強いパウダーイーターを作れる．STは１と低いため，MHPの数でSTが増加するアイテム，オーラブレイドと組み合わせると良い．"
    },
    {
        id: 8,
        name: "リトルグレイ",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "R",
        element: "無",
        cost: "G50+生贄",
        st: 10,
        hp: 20,
        item_limit: "なし",
        ability: "攻撃成功時、対戦相手をランダムに空地に飛ばす(50%)",
        memo: "■空地が無かった場合は破壊される",
        description: "天空に逃げのびた妖精族の一種。人をさらったり畑に絵を描く性質を未だ持つ。",
        usage_note: "生け贄は必要だが，50%の確率で相手を飛ばせるので，切り札としてブックに入れ込むのも手"
    },
    {
        id: 9,
        name: "アヌビアス",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "S",
        element: "水",
        cost: "G70+水土地1",
        st: 30,
        hp: 50,
        item_limit: "なし",
        ability: "戦闘中、HP=今までに破壊されたクリーチャーの数×5",
        memo: "■召喚された後に破壊されたクリーチャーに限る。カードとして破壊されたものはこれに含めない",
        description: "水中植物。死の世界とのつながりを持ち、死者の魂を栄養源にしている。",
        usage_note: "序盤は破壊されたクリーチャーが少ないため弱いが，後半になると圧倒的力を持つ．アイテムチェンジゾルブを使うとSTとHPがが逆になるため，後半STとHP共に強い汎用性の高いクリーチャーとなる．"
    },
    {
        id: 10,
        name: "カーバンクル",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "N",
        element: "地",
        cost: "G20",
        st: 20,
        hp: 20,
        item_limit: "なし",
        ability: "援護 : 巻物攻撃・効果を対戦相手にはね返す",
        memo: "■援護 = 手札のクリーチャーカードをアイテムとして使用できる",
        description: "額の光り輝く鏡は、全ての魔力を反射する。臆病でめったに姿を見せない。",
        usage_note: "ドラゴンフライを援護クリーチャーとして使用すると、合体してカーバンフライになるため，火属性と地属性のブックに入れると面白い"
    },
    {
        id: 11,
        name: "サンクダムカード",
        work: "カルドセプト セカンド エキスパンション",
        rarity: "E",
        element: "無",
        cost: "G70",
        st: 40,
        hp: 40,
        item_limit: "なし",
        ability: "先制 : 対戦相手を破壊した場合、使用者は戦闘が行われた領地と同じ属性の護符を5得る",
        memo: "■先制 = 防御側でも先手を取って攻撃することができる",
        description: "聖域の守護者。聖域へ侵入するものを処罰するためにソルティス神が創り出した。その杖に打たれたものは悔い改め、神への信心を誓うようになる。",
        usage_note: "エクストラカードならではの強さを持ち，護符まで得られる優れたクリーチャー．一度は使ってみたいカード．"
    },
];

// --- マップ攻略メモデータ ---
let maps = [
  { 
      id: 1, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '出会いの地デュナン', 
      target_g: 5000, 
      structure: '正方形', 
      element_trend: '火・水・地・風属性の土地が４つずつ均等に配置されているマップ', 
      recommended_card: 'デコイ', 
      strategy: '単色ブックではなく，複数の属性を使うと立ち回りやすい' 
  },
  { 
      id: 2, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '王都マルセスブルク', 
      target_g: 6000, 
      structure: '八の字', 
      element_trend: '火・地属性のブックが若干有利', 
      recommended_card: 'ストーンウォール', 
      strategy: '周回が早いので移動系スペルを入れる。' 
  },
  { 
      id: 3, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '神の降り立つ山アトラ', 
      target_g: 8000, 
      structure: '八の字', 
      element_trend: '水・風属性のブックが若干有利', 
      recommended_card: 'イエティ', 
      strategy: 'マップが広い割に塔が一つしかないため，魔力配分を考える必要がある' 
  },
  { 
      id: 4, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '雪原の炭坑ラビド', 
      target_g: 8000, 
      structure: 'バツ型のエリアと丸型のエリア', 
      element_trend: '無属性の土地がいくつかあるため，好きな属性で挑める', 
      recommended_card: 'コアティ', 
      strategy: '護符などの特殊地形も多くあるため，戦略を練って挑むと良い' 
  },
  { 
      id: 5, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '賢者の島ダーハン', 
      target_g: 9000, 
      structure: 'メインエリアと離れ小島', 
      element_trend: '火・水・地・風属性の土地が6つずつ均等に配置されているマップ', 
      recommended_card: 'グーバクイーン', 
      strategy: '転送マスに止まると離島に飛ばされてしまうため，ワード系スペルを入れておくと良いだろう' 
  },
  { 
      id: 6, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '預言者の神殿２', 
      target_g: 9000, 
      structure: '四ヶ所に折り返し通路がある大きな外エリアと小さな内エリアが転送円で結ばれている変則的なマップ', 
      element_trend: '土地の数はどの属性も数は同じである', 
      recommended_card: 'ホーリーラマ', 
      strategy: '逃げ道が多いため，自分の好きなブックで挑みやすい，ワード系のスペルを入れると楽かもしれない' 
  },
  { 
      id: 7, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '錬金術師の館', 
      target_g: 9000, 
      structure: '二つの独立したエリアがある', 
      element_trend: 'マップ全てが無属性のマップ', 
      recommended_card: 'テレグノーシス', 
      strategy: '全ての土地が無属性なため，色変えスペルは使わなくても良いだろう' 
  },
  { 
      id: 8, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '燃える街クアンゼ', 
      target_g: 9000, 
      structure: '南エリアと西と東のエリアに別れている，西か東どちらかを通れば良い', 
      element_trend: '火・水属性のブックが有利', 
      recommended_card: 'リコール', 
      strategy: '火・水属性の土地が圧倒的に多いため，どちらかの属性に絞ってブックを組むと良い' 
  },
  { 
      id: 9, 
      work: "カルドセプト セカンド エキスパンション",
      map_name: '聖地プロムスデル', 
      target_g: 10000, 
      structure: '外エリアと内エリアに分かれている', 
      element_trend: '火・水・地・風属性の土地が6つずつ均等に配置されているマップ', 
      recommended_card: 'ホーリーワード系', 
      strategy: '土地属性の下チャリがなくどんなクリーチャーでも力を発揮できるマップ' 
  },
];

// --- 歴代作レビューデータ -
let reviews = [
  { 
    id: 1, 
    title: 'カルドセプト', 
    hardware: 'SEGA Saturn', 
    release_year: 1997, 
    score: 70, 
    review_title: '伝説の始まり', 
    comment: 'すべての原点にして、「ボードゲーム×トレーディングカード」というジャンルを確立した記念碑的作品。加藤直之氏の重厚なイラストと、伊藤賢治氏の壮大な音楽が融合し、独特のダークファンタジー世界を構築。友人との対戦で「友情破壊ゲーム」と呼ばれるほどの熱狂を生み出し、多くのゲーマーを寝不足にさせた。この時代をに生きていたかったと思うばかり..' 
  },
  { 
    id: 2, 
    title: 'カルドセプト エキスパンション', 
    hardware: 'PlayStation', 
    release_year: 1999, 
    score: 78, 
    review_title: '遊びやすくなった普及版', 
    comment: 'サターン版をベースにしつつ、マップの追加やゲームバランスの再調整が行われた移植作。当時圧倒的なシェアを誇っていたPSで発売されたことで、より幅広い層に認知されるきっかけとなった。ロード時間の短縮やUIの改善など、細かい部分でのプレイアビリティも向上している。とても良いです！' 
  },
  { 
    id: 3, 
    title: 'カルドセプト セカンド', 
    hardware: 'Dreamcast', 
    release_year: 2001, 
    score: 80, 
    review_title: 'シリーズ最高傑作の呼び声', 
    comment: 'マップの視認性が向上し、クリーチャーのアニメーションも進化。DCのモデム機能を活用したネットワーク対戦は革命的で、全国のセプターたちが夜な夜なダイヤルアップ接続で熱戦を繰り広げた。ストーリー、音楽、システムが見事に調和しており、シリーズの方向性を決定づけた一作。' 
  },
  { 
    id: 4, 
    title: 'カルドセプト セカンド エキスパンション', 
    hardware: 'PlayStation 2', 
    release_year: 2002, 
    score: 100, 
    review_title: '完成されたバランス', 
    comment: '「セカンド」をベースにカード枚数を大幅に増加（約480枚）させ、戦略の幅を極限まで広げた決定版。強すぎたカードの下方修正や新カードの追加により、対戦バランスが「神調整」と呼ばれる領域に達した。発売から長期間経過しても、多くのファンがこのバランスを至高として遊び続けた名作。飛び抜けて強いカードが無くなったため戦略とブックコンセプトで勝敗が変わってくるという..クリーチャー能力に依存しすぎないのがとても良い！一番最高な作品！！' 
  },
  { 
    id: 5, 
    title: 'カルドセプト サーガ', 
    hardware: 'Xbox 360', 
    release_year: 2006, 
    score: 73, 
    review_title: '美麗なグラフィックと惜しいバグ', 
    comment: '次世代機によるハイデフ化で、クリーチャーやマップの美しさはシリーズ随一。キャラクターデザインも一新され、よりリッチな物語体験を提供した。しかし、発売初期の進行不能バグやダイス運の偏り、テンポの悪さが評価を二分することに。素材が最高だっただけに、非常に惜しまれる作品。音楽などもとてもよかったため惜しい...' 
  },
  { 
    id: 6, 
    title: 'カルドセプト DS', 
    hardware: 'Nintendo DS', 
    release_year: 2008, 
    score: 79, 
    review_title: '携帯機との奇跡的な相性', 
    comment: '「いつでもどこでもカルドセプト」を実現した携帯機初参入タイトル。2画面を活かして常にマップと手札を確認できるUIが秀逸で、試合テンポも高速化された。Wi-Fiコネクションによる対戦も手軽で、複雑なゲーム性を維持したまま、対戦の敷居を劇的に下げることに成功している。' 
  },
  { 
    id: 7, 
    title: 'カルドセプト (3DS)', 
    hardware: 'Nintendo 3DS', 
    release_year: 2012, 
    score: 81, 
    review_title: '王道の帰還', 
    comment: '初代のストーリーとマップをベースにしつつ、システム面は完成度の高い「セカンド」準拠でリファインされたハイブリッド作。初心者でも安心して遊べる「協力プレイ」モードの実装や、丁寧なチュートリアルにより、新規プレイヤーへの配慮が行き届いている。まさに王道の復活と言える。みんなでやるには熱い作品..' 
  },
  { 
    id: 8, 
    title: 'カルドセプト リボルト', 
    hardware: 'Nintendo 3DS', 
    release_year: 2016, 
    score: 90, 
    review_title: 'スピーディーな進化作', 
    comment: 'シリーズの伝統を打ち破り、システムを抜本的に改革。「領地コマンド」による能動的なアクションや、ダウン状態などの新ルール導入により、試合展開が劇的にスピーディーかつ攻撃的になった。古参ファンからは賛否両論あったが、より現代的でアグレッシブな戦略性を生み出した意欲作。かなりルールが変わったため昔からプレイしているセプターはかなり戸惑いがあった..これはこれで良いゲームですが昔の感じが名残惜しくなります..' 
  }
]

// ==================================================
// 2. ルーティング
// ==================================================

// トップページ
app.get("/", (req, res) => {
    res.render("top");
});


// -------------------------
//  クリーチャー図鑑
// -------------------------

// 一覧表示
app.get("/creatures", (req, res) => {
    const sortedData = [...creatures].sort((a, b) => {
        return a.name.localeCompare(b.name, "ja");
    });
    res.render("creatures/list", { data: sortedData });
});

// 詳細表示
app.get("/creatures/detail/:id", (req, res) => {
    const id = req.params.id;
    const target = creatures.find(item => item.id == id);
    res.render("creatures/detail", { data: target });
});

// 新規登録画面
app.get("/creatures/create", (req, res) => {
    res.render("creatures/create");
});

// 新規登録処理
app.post("/creatures/create", (req, res) => {
    const newId = creatures.length > 0 ? creatures[creatures.length - 1].id + 1 : 1;
    const newData = {
        id: newId,
        name: req.body.name,
        rarity: req.body.rarity,
        element: req.body.element,
        cost: req.body.cost,
        st: parseInt(req.body.st),
        hp: parseInt(req.body.hp),
        item_limit: req.body.item_limit,
        ability: req.body.ability,
        memo: req.body.memo,
        description: req.body.description,
        usage_note: req.body.usage_note
    };
    creatures.push(newData);
    res.redirect("/creatures");
});

// 編集画面
app.get("/creatures/edit/:id", (req, res) => {
    const id = req.params.id;
    const target = creatures.find(item => item.id == id);
    res.render("creatures/edit", { data: target });
});

// 更新処理
app.post("/creatures/update/:id", (req, res) => {
    const id = req.params.id;
    const targetIndex = creatures.findIndex(item => item.id == id);
    if (targetIndex !== -1) {
        creatures[targetIndex].name = req.body.name;
        creatures[targetIndex].rarity = req.body.rarity;
        creatures[targetIndex].element = req.body.element;
        creatures[targetIndex].cost = req.body.cost;
        creatures[targetIndex].st = parseInt(req.body.st);
        creatures[targetIndex].hp = parseInt(req.body.hp);
        creatures[targetIndex].item_limit = req.body.item_limit;
        creatures[targetIndex].ability = req.body.ability;
        creatures[targetIndex].memo = req.body.memo;
        creatures[targetIndex].description = req.body.description;
        creatures[targetIndex].usage_note = req.body.usage_note;
    }
    res.redirect("/creatures");
});

// 削除処理
app.post("/creatures/delete/:id", (req, res) => {
    const id = req.params.id;
    creatures = creatures.filter(item => item.id != id);
    res.redirect("/creatures");
});


// -------------------------
//  マップ攻略メモ
// -------------------------

// 一覧表示
app.get('/maps', (req, res) => {
  const sortedMaps = [...maps].sort((a, b) => a.map_name.localeCompare(b.map_name));
  res.render('maps/list', { maps: sortedMaps });
});

// 詳細表示
app.get('/maps/detail/:id', (req, res) => {
  const map = maps.find(m => m.id === parseInt(req.params.id));
  res.render('maps/detail', { map: map });
});

// 新規登録画面
app.get('/maps/create', (req, res) => {
  res.render('maps/create');
});

// 新規登録処理
app.post('/maps/create', (req, res) => {
  const newId = maps.length > 0 ? Math.max(...maps.map(m => m.id)) + 1 : 1;
  const newMap = {
    id: newId,
    map_name: req.body.map_name,
    target_g: req.body.target_g,
    structure: req.body.structure,
    element_trend: req.body.element_trend,
    recommended_card: req.body.recommended_card,
    strategy: req.body.strategy
  };
  maps.push(newMap);
  res.redirect('/maps');
});

// 編集画面
app.get('/maps/edit/:id', (req, res) => {
  const map = maps.find(m => m.id === parseInt(req.params.id));
  res.render('maps/edit', { map: map });
});

// 更新処理
app.post('/maps/update/:id', (req, res) => {
  const map = maps.find(m => m.id === parseInt(req.params.id));
  if (map) {
    map.map_name = req.body.map_name;
    map.target_g = req.body.target_g;
    map.structure = req.body.structure;
    map.element_trend = req.body.element_trend;
    map.recommended_card = req.body.recommended_card;
    map.strategy = req.body.strategy;
  }
  res.redirect('/maps');
});

// 削除処理
app.post('/maps/delete/:id', (req, res) => {
  maps = maps.filter(m => m.id !== parseInt(req.params.id));
  res.redirect('/maps');
});


// -------------------------
//  歴代作レビュー
// -------------------------

// 一覧表示
app.get('/reviews', (req, res) => {
  const sortedReviews = [...reviews].sort((a, b) => a.release_year - b.release_year);
  res.render('reviews/list', { reviews: sortedReviews });
});

// 詳細表示
app.get('/reviews/detail/:id', (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  res.render('reviews/detail', { review: review });
});

// 新規登録画面
app.get('/reviews/create', (req, res) => {
  res.render('reviews/create');
});

// 新規登録処理
app.post('/reviews/create', (req, res) => {
  const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
  const newReview = {
    id: newId,
    title: req.body.title,
    hardware: req.body.hardware,
    release_year: parseInt(req.body.release_year),
    score: parseInt(req.body.score),
    review_title: req.body.review_title,
    comment: req.body.comment
  };
  reviews.push(newReview);
  res.redirect('/reviews');
});

// 編集画面
app.get('/reviews/edit/:id', (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  res.render('reviews/edit', { review: review });
});

// 更新処理
app.post('/reviews/update/:id', (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (review) {
    review.title = req.body.title;
    review.hardware = req.body.hardware;
    review.release_year = parseInt(req.body.release_year);
    review.score = parseInt(req.body.score);
    review.review_title = req.body.review_title;
    review.comment = req.body.comment;
  }
  res.redirect('/reviews');
});

// 削除処理
app.post('/reviews/delete/:id', (req, res) => {
  reviews = reviews.filter(r => r.id !== parseInt(req.params.id));
  res.redirect('/reviews');
});


// -------------------------
//  サーバー起動
// -------------------------
app.listen(8080, () => console.log("Example app listening on port 8080!"));