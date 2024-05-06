// ゆとシートIIインポートマクロ
async function yt2import() {
  // ダイアログ
  let fileInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>JSONファイル(ゆとシートII出力)を選択してください:</p>
      <input type="file" id="json-file-input" accept=".json" style="width: 100%;" />
    `;

    new Dialog({
      title: "ゆとシートII インポート",
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: "インポート",
          callback: (html) => {
            let file = html.find("#json-file-input")[0].files[0];
            if (!file) {
              ui.notifications.warn("ファイルが選択されていません。");
              return;
            }
            resolve(file);
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

  // JSON読み込み
  let reader = new FileReader();
  reader.onload = async (event) => {
    try {
      let data = JSON.parse(event.target.result);
      let actorData;

      // アクターデータ作成
      // PC
      let biography = decodeHTML(data.freeNote);

      if (!data.monsterName) {
        actorData = {
          name: data.characterName,
          type: "character",
          system: {
            abilities: {
              dex: {
                racevalue: Number(data.sttBaseTec),
                valuebase: Number(data.sttBaseA),
                valuegrowth: Number(data.sttGrowA),
                valuemodify: Number(data.sttAddA),
              },
              agi: {
                valuebase: Number(data.sttBaseB),
                valuegrowth: Number(data.sttGrowB),
                valuemodify: Number(data.sttAddB),
              },
              str: {
                racevalue: Number(data.sttBasePhy),
                valuebase: Number(data.sttBaseC),
                valuegrowth: Number(data.sttGrowC),
                valuemodify: Number(data.sttAddC),
              },
              vit: {
                valuebase: Number(data.sttBaseD),
                valuegrowth: Number(data.sttGrowD),
                valuemodify: Number(data.sttAddD),
              },
              int: {
                racevalue: Number(data.sttBaseSpi),
                valuebase: Number(data.sttBaseE),
                valuegrowth: Number(data.sttGrowE),
                valuemodify: Number(data.sttAddE),
              },
              mnd: {
                valuebase: Number(data.sttBaseF),
                valuegrowth: Number(data.sttGrowF),
                valuemodify: Number(data.sttAddF),
              },
            },
            money: data.moneyTotal,
            race: data.race,
            biography: biography,
            attributes: {
              age: data.age,
              gender: data.gender,
              born: data.birth,
              faith: data.faith,
              honer: {
                rank: data.rank,
                value: data.honor,
              },
              impurity: data.sin,
              totalexp: data.expTotal,
            },
          },
        };
      }

      // Monster
      if (data.monsterName != null) {
        let name = data.monsterName;
        if (data.characterName != null) name = data.characterName;
        let part = data.partsNum + " (" + data.parts + ")";
        if (data.partsNum == 1 || data.partsNum == null) part = null;
        let biography = decodeHTML(data.description);
        let loot = "";
        let lootNum = Number(data.lootsNum);
        if (lootNum > 0) {
          for (let i = 1; i <= lootNum; i++) {
            let numName = `data.loots${i}Num`;
            let itemName = `data.loots${i}Item`;
            let num = eval(numName);
            let item = eval(itemName);
            loot += num + " : " + item + "<br>";
          }
        }

        actorData = {
          name: name,
          type: "monster",
          system: {
            monlevel: data.lv,
            type: data.taxa,
            intelligence: data.intellect,
            perception: data.perception,
            reaction: data.disposition,
            impurity: data.sin,
            language: data.language,
            habitat: data.habitat,
            popularity: data.reputation,
            weakpoint: data["reputation+"],
            weakness: data.weakness,
            preemptive: data.initiative,
            move: data.mobility,
            part: part,
            corepart: data.coreParts,
            biography: biography,
            loot: loot,
          },
        };
      }

      // アクター作成
      Actor.create(actorData)
        .then((actor) => {
          ui.notifications.info(`「${actor.name}」が作成されました。`);
        })
        .catch((err) => {
          ui.notifications.error("作成に失敗しました。");
          console.error(err);
        });
    } catch (e) {
      ui.notifications.error("ファイル形式エラー");
      console.error(e);
    }
  };
  if (fileInput) {
    reader.readAsText(fileInput);
  }
}

// HTMLデコード関数
function decodeHTML(escapedText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(escapedText, "text/html");
  return doc.documentElement.textContent;
}

// マクロを実行
yt2import();
