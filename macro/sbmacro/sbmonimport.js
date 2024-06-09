async function sbmonimport() {
  // ダイアログ
  let filesInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>JSONファイル(Sandbox形式)を選択してください:</p>
      <input type="file" id="json-files-input" accept=".json" multiple style="width: 100%;" />
    `;

    new Dialog({
      title: "Sandbox版魔物インポート",
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: "インポート",
          callback: (html) => {
            let files = html.find("#json-files-input")[0].files;
            if (files.length === 0) {
              ui.notifications.warn("ファイルが選択されていません。");
              return;
            }
            resolve(files);
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "キャンセル",
          callback: () => resolve(null),
        },
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });

  if (!filesInput) {
    return;
  }

  // jsonファイル読み込み
  for (let file of filesInput) {
    let reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let data = JSON.parse(event.target.result);
        let actorData;
        let itemData = [];

        // アクターデータ作成
        let startLootText = "戦利品";
        let endLootText = "解説";
        let startLootIndex =
          data.system.attributes.memo.value.indexOf(startLootText);
        let endLootIndex =
          data.system.attributes.memo.value.indexOf(endLootText);
        let rawLoot = data.system.attributes.memo.value
          .substring(startLootIndex + startLootText.length, endLootIndex)
          .trim();
        let lootLines = rawLoot.split("\n");
        let addColon = true;
        for (let i = 0; i < lootLines.length; i++) {
          lootLines[i] = lootLines[i]
            .replace(/～/g, "-")
            .replace(/~/g, "-")
            .replace(/\*/g, "x")
            .replace(/[ 　]/g, "")
            .trim();
          if (lootLines[i] !== "") {
            if (addColon) {
              lootLines[i] = lootLines[i] + "：";
            } else {
              lootLines[i] = lootLines[i] + "<br>";
            }
            addColon = !addColon;
          }
        }
        let loot = lootLines.join("");

        let targetCharBio = "解説";
        let indexBio = data.system.attributes.memo.value.indexOf(targetCharBio);
        let rawBio = data.system.attributes.memo.value
          .substring(indexBio + targetCharBio.length)
          .replace(/[ 　]/g, "")
          .replace(/\(⇒.*?頁\)/g, "")
          .trim();
        let biography = "　" + rawBio.replace(/\n/g, "<br>　");

        actorData = {
          name: data.name,
          type: "monster",
          system: {
            monlevel: data.system.attributes.mons_level.value,
            hpbase: data.system.attributes.hp.value,
            hp: { value: data.system.attributes.hp.value },
            mpbase: data.system.attributes.mp.value,
            mp: { value: data.system.attributes.mp.value },
            ppbase: data.system.attributes.ac.value,
            mppbase: data.system.attributes.ac_m.value,
            type: "",
            intelligence: data.system.attributes.mons_int.value,
            perception: data.system.attributes.mons_per.value,
            reaction: data.system.attributes.mons_rea.value,
            impurity: data.system.attributes.mons_keg.value,
            language: data.system.attributes.mons_lang.value,
            habitat: "",
            popularity: data.system.attributes.mons_fame.value,
            weakpoint: data.system.attributes.mons_weakpoint.value,
            weakness: data.system.attributes.mons_weak.value,
            preemptive: data.system.attributes.mons_ini.value,
            move: data.system.attributes.mons_move2.value,
            part: "",
            corepart: "",
            biography: biography,
            loot: loot,
          },
        };

        // アイテムデータ作成
        let itemName, itemDamage;
        for (let i = 0; i < data.system.citems.length; i++) {
          if (data.system.citems[i].name == "MONSTER DAMAGE1") {
            itemName = data.system.citems[i].attributes.damage_name.value;
            itemDamage = data.system.citems[i].attributes.mons_damage.value;
            break;
          }
        }

        itemData = [
          {
            name: "抵抗判定",
            type: "monsterability",
            system: {
              description: "",
              usedice1: true,
              label1: "生命",
              checkbasemod1: data.system.attributes.mons_seimei_base.value,
              usefix1: true,
              applycheck1: false,
              usedice2: true,
              label2: "精神",
              checkbasemod2: data.system.attributes.mons_seisin_base.value,
              usefix2: true,
              applycheck2: false,
            },
          },
          {
            name: itemName,
            type: "monsterability",
            system: {
              description: "",
              usedice1: true,
              label1: "命中",
              checkbasemod1: data.system.attributes.mons_hit_base.value,
              usefix1: true,
              applycheck1: false,
              usedice2: true,
              label2: "打撃",
              checkbasemod2: itemDamage,
              usefix2: false,
              applycheck2: true,
              usedice3: true,
              label3: "回避",
              checkbasemod3: data.system.attributes.mons_dodge_base.value,
              usefix3: true,
              applycheck3: false,
            },
          },
        ];

        // アクター作成
        Actor.create(actorData)
          .then((actor) => {
            setTimeout(() => {
              let existingItems = actor.items.map((item) => item.id);
              actor
                .deleteEmbeddedDocuments("Item", existingItems)
                .then(() => {
                  return actor.createEmbeddedDocuments("Item", itemData);
                })
                .then(() => {
                  ui.notifications.info(`「${actor.name}」が作成されました。`);
                })
                .catch((error) => {
                  console.error(error);
                  ui.notifications.error(
                    "アイテムの削除または追加中にエラーが発生しました。"
                  );
                });
            }, 500);
          })
          .catch((error) => {
            console.error(error);
            ui.notifications.error("作成に失敗しました。");
          });
      } catch (e) {
        ui.notifications.error("ファイル形式エラー");
        console.error(e);
      }
    };
    reader.readAsText(file);
  }
}

// マクロを実行
sbmonimport();
