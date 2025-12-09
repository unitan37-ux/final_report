"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ==================================================
// 1. データ定義
// ==================================================

// クリーチャー図鑑データ
let creatures = [
    {
        id: 1,
        name: "ニンジャ",
        rarity: "N",
        element: "無",
        cost: "80G",
        st: 40,
        hp: 40,
        item_limit: "なし",
        ability: "先制 : 巻物強打",
        memo: "■先制 = 防御側でも先手を取って攻撃することができる\n■巻物強打 = 巻物を使用して攻撃する時に1.5倍のダメージを与える",
        description: "闇に生きる間者。巻物を駆使し、様々な呪文を操る。また、その動きは素早い。",
        // ★追加：使用メモ
        usage_note: "能力が優秀なためコストが高い，使うべきところで使う必要がある．"
    },
    {
        id: 2,
        name: "オールドウィロウ",
        rarity: "R",
        element: "地",
        cost: "60G+地1",
        st: 20,
        hp: 40,
        item_limit: "なし",
        ability: "通りかかった敵領地にとどめる",
        memo: "最強の足止めクリーチャー。",
        description: "古き柳の精霊。通りがかる旅人を捕らえ、その歩みを止める。",
        // ★追加：使用メモ
        usage_note: "土地が１つ必要で，防御型のため，序盤の土地取りや防具などをブックに入れておく必要がある．"
    }
];

let maps = [];
let reviews = [];

// ==================================================
// 2. ルーティング
// ==================================================

// トップページ
app.get("/", (req, res) => {
    res.render("top");
});

// --- クリーチャー図鑑 ---

// 一覧表示
// 一覧表示
app.get("/creatures", (req, res) => {
    // データをコピーして、名前(name)であいうえお順に並び替える
    const sortedData = [...creatures].sort((a, b) => {
        return a.name.localeCompare(b.name, "ja");
    });
    
    // 並び替えたデータを表示に使う
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

// 新規登録処理 (POST)
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
        usage_note: req.body.usage_note // ★ここを追加
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

// 更新処理 (POST)
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
        creatures[targetIndex].usage_note = req.body.usage_note; // ★ここを追加
    }
    res.redirect("/creatures");
});

// 削除処理 (POST)
app.post("/creatures/delete/:id", (req, res) => {
    const id = req.params.id;
    creatures = creatures.filter(item => item.id != id);
    res.redirect("/creatures");
});

// ...(マップ・レビュー機能はそのまま)...

app.listen(8080, () => console.log("Example app listening on port 8080!"));