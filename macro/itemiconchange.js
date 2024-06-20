// Compendiumアイテムアイコン一括変更

// デフォルト設定
/*
武器 weapon icons/svg/sword.svg
防具 armor icons/svg/shield.svg
装飾品 accessory icons/svg/wing.svg
アイテム item icons/svg/item-bag.svg
魔法 spell icons/svg/daze.svg
その他特技 enhancearts magicalsong ridingtrick alchemytech phasearea tactics icons/svg/upgrade.svg
判定 check icons/svg/circle.svg
リソース resource icons/svg/coin.svg
戦闘特技 combatability icons/svg/combat.svg
技能 skill icons/svg/regen.svg
種族特徴 raceability icons/svg/paralysis.svg
言語 language icons/svg/book.svg
魔物能力 monsterability icons/svg/skull.svg
*/

// Compendium指定
const compendiumKey = "sw25compendium.item";
// 条件
const searchKey = "type";
const searchValue = "weapon";
// 変更データ
const iconPath = "icons/svg/sword.svg";

(async () => {
  // コンペンディウム取得
  let pack = game.packs.get(compendiumKey);
  if (!pack) {
    ui.notifications.error(
      "指定されたコンペンディウムパックが見つかりません。"
    );
    return;
  }

  // コンペンディウム全アイテム取得
  let items = await pack.getDocuments();

  // フィルタリング
  let filteredItems = items.filter((item) => item[searchKey] === searchValue);

  if (filteredItems.length === 0) {
    ui.notifications.warn("条件に合致するアイテムが見つかりません。");
    return;
  }

  // 更新
  for (let item of filteredItems) {
    let updatedData = {
      img: iconPath,
    };
    await item.update(updatedData);
  }

  ui.notifications.info("条件に合致するアイテムが更新されました。");
})();
