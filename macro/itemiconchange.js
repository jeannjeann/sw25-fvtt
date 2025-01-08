// 辞典アイテムアイコン一括変更
// compendiumKeysを変更したい辞典のIDに変更し、マクロ実行してください。ActorとItemの辞典に対応しています。
// 旧デフォルトアイコン（アイテム袋）のものをシステムデフォルトのアイコンに変更します。

//ここを変更
const compendiumKeys = [
 "sw25.actor", 
 "sw25.item"
];

let type_icon_pairs = {
  'weapon':'icons/svg/sword.svg', //武器
  'armor':'icons/svg/shield.svg', //防具
  'accessory':'icons/svg/wing.svg', //装飾品
  'item':'icons/svg/item-bag.svg', //アイテム
  'spell':'icons/svg/daze.svg', //魔法
  'enhancearts': 'icons/svg/upgrade.svg', //練技
  'magicalsong': 'icons/svg/upgrade.svg', //呪歌・終律
  'ridingtrick': 'icons/svg/upgrade.svg', //騎芸
  'alchemytech': 'icons/svg/upgrade.svg', //賦術
  'phasearea': 'icons/svg/upgrade.svg', //相域
  'tactics': 'icons/svg/upgrade.svg', //鼓砲・陣率
  'infusion': 'icons/svg/skull.svg', //魔装
  'barbarousskill': 'icons/svg/skull.svg', //蛮族特殊能力
  'essenceweave': 'icons/svg/upgrade.svg', //操気
  'check':'icons/svg/circle.svg', //判定
  'resource':'icons/svg/coins.svg', //リソース
  'combatability':'icons/svg/combat.svg', //戦闘特技
  'skill':'icons/svg/regen.svg', //技能
  'raceability':'icons/svg/paralysis.svg', //種族特徴
  'language':'icons/svg/book.svg', //言語
  'otherfeature': 'icons/svg/upgrade.svg', //その他の特技
  'monsterability':'icons/svg/skull.svg', //魔物能力
  'action': 'icons/svg/ice-aura.svg' //行動
};  

// メイン処理の関数
function changeItemsIcon(items) {
  for (let [searchValue, iconPath] of Object.entries(type_icon_pairs)) {
    // フィルタリング
    let filteredItems = items.filter((item) => item["type"] === searchValue);

    // 更新
    for (let item of filteredItems) {
      if (item.img == "icons/svg/item-bag.svg"){
        let updatedData = {
          img: iconPath,
        };
        item.update(updatedData);
      }
    }
  }
}

(async () => {
  // 辞典取得
  for (let compendiumKey of compendiumKeys) {
    let pack = game.packs.get(compendiumKey);
    if (!pack) {
      ui.notifications.error( `"${compendiumKey}" が見つかりません。`);
    } else {
      if (pack.metadata.type == "Item"){
        let items = await pack.getDocuments();
        await changeItemsIcon(items);
      } else if (pack.metadata.type == "Actor"){
        let actors = await pack.getDocuments();
        for (let actor of actors) {
          let items = actor.items;
          await changeItemsIcon(items);
        }
      } else {
        ui.notifications.error( `"${compendiumKey}" はキャラクターとアイテム以外の辞典です。`);
      }
    }
  }
  ui.notifications.info("条件に合致するアイテムが更新されました。");
})();

