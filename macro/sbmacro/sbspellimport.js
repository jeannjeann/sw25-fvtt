async function sbspellimport() {
  // ダイアログ
  let filesInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>JSONファイル(Sandbox形式)を選択してください:</p>
      <input type="file" id="json-files-input" accept=".json" multiple style="width: 100%;" />
    `;

    new Dialog({
      title: "Sandbox版魔法インポート",
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
        let itemData = [];
        let type;

        // 名前
        let name = data.name.replace(/^(LV|Rank)\d+\s*/, "");
        // 種別
        switch (data.system.groups[0].ikey) {
          case "spell_group1":
          case "spell_group101":
            type = "sorcerer";
            break;
          case "spell_group2":
          case "spell_group102":
            type = "conjurer";
            break;
          case "spell_group3":
          case "spell_group103":
            type = "wizard";
            break;
          case "spell_group4":
          case "spell_group104":
            type = "priest";
            break;
          case "spell_group8":
          case "spell_group108":
            type = "magitech";
            break;
          case "spell_group9":
          case "spell_group109":
            type = "fairy";
            break;
          case "spell_group17":
          case "spell_group117":
            type = "druid";
            break;
          case "spell_group18":
          case "spell_group118":
            type = "daemon";
            break;
          default:
            break;
        }
        // 詳細データ
        let bareData = data.system.description
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/&nbsp;/g, " ");
        let param = [];
        let bareline = bareData
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);
        for (let i = 0; i < bareline.length; i++) {
          let line = bareline[i];
          if (line.startsWith("効果:")) {
            let effect = line.substring(3).trim();
            i++;
            while (
              i < bareline.length &&
              !bareline[i].startsWith("詠唱:") &&
              !bareline[i].startsWith("威力:") &&
              !bareline[i].startsWith("備考:")
            ) {
              effect += " " + bareline[i].trim();
              i++;
            }
            param.push(["効果", effect]);
            i--;
          } else if (line.startsWith("備考:")) {
            let remark = line.substring(3).trim();
            param.push(["備考", remark]);
          } else {
            let element = line.split(/[:：]/);
            if (element.length === 2) {
              param.push([element[0].trim(), element[1].trim()]);
            }
          }
        }
        let level,
          mpcost,
          target,
          rangeshape,
          time,
          resist,
          prop,
          overview,
          description,
          power,
          cvalue,
          faith,
          sect,
          magispfere;
        let usepower = false;
        let hpresist = false;
        for (let i = 0; i < param.length; i++) {
          switch (param[i][0]) {
            case "レベル":
            case "ランク":
              level = param[i][1].replace(/"/g, "").trim();
              break;
            case "消費":
              mpcost = param[i][1].replace(/"/g, "").trim().replace(/MP/g, "");
              break;
            case "対象":
              target = param[i][1].replace(/"/g, "").trim();
              break;
            case "射程/形状":
              rangeshape = param[i][1].replace(/"/g, "").trim();
              break;
            case "時間":
              time = param[i][1].replace(/"/g, "").trim();
              break;
            case "抵抗":
              let bareresist = param[i][1].replace(/"/g, "").trim();
              if (bareresist.includes("生命/")) {
                hpresist = true;
                bareresist = bareresist.replace("生命/", "");
              }
              switch (bareresist) {
                case "必中":
                  resist = "decide";
                  break;
                case "任意":
                  resist = "any";
                  break;
                case "なし":
                  resist = "none";
                  break;
                case "消滅":
                  resist = "disappear";
                  break;
                case "半減":
                  resist = "halving";
                  break;
                case "短縮":
                  resist = "shortening";
                  break;
                default:
                  resist = "-";
                  break;
              }
              break;
            case "属性":
            case "備考":
              let bareprop = param[i][1].replace(/"/g, "").trim();
              if (bareprop == "第二の剣系専用 ") faith = "second";
              let indexsect = bareprop.indexOf("専用");
              if (indexsect !== -1) sect = bareprop.substring(0, indexsect);
              if (bareprop.includes("マギスフィア:")) {
                magispfere = bareprop.replace("マギスフィア:", "");
              }
              switch (bareprop) {
                case "土":
                  prop = "earth";
                  break;
                case "水・氷":
                  prop = "ice";
                  break;
                case "炎":
                  prop = "fire";
                  break;
                case "風":
                  prop = "wind";
                  break;
                case "雷":
                  prop = "thunder";
                  break;
                case "純エネルギー":
                  prop = "energy";
                  break;
                case "断空":
                  prop = "cut";
                  break;
                case "衝撃":
                  prop = "impact";
                  break;
                case "毒":
                  prop = "poison";
                  break;
                case "病気":
                  prop = "disease";
                  break;
                case "精神効果":
                  prop = "mental";
                  break;
                case "精神効果(弱)":
                case "精神効果（弱）":
                  prop = "mentalw";
                  break;
                case "呪い":
                  prop = "curse";
                  break;
                case "呪い+精神":
                case "呪い+精神効果":
                case "呪い＋精神":
                case "呪い＋精神効果":
                  prop = "curseMental";
                  break;
                case "その他":
                  prop = "other";
                  break;
                default:
                  prop = "-";
                  break;
              }
              break;
            case "概要":
              overview = param[i][1].replace(/"/g, "").trim();
              break;
            case "効果":
              description = param[i][1].replace(/"/g, "").trim();
              break;
            case "詠唱":
              description +=
                "<br>詠唱：<br>" + param[i][1].replace(/"/g, "").trim();
              break;
            case "威力":
              usepower = true;
              power = param[i][1].replace(/"/g, "").trim();
              break;
            case "C値":
              cvalue = param[i][1].replace(/"/g, "").trim();
              if (cvalue == "なし") cvalue = 13;
              break;
            default:
              break;
          }
        }

        // アイテムデータ作成
        itemData = [
          {
            name: name,
            type: "spell",
            system: {
              description: description,
              type: type,
              level: Number(level),
              mpcost: Number(mpcost),
              target: target,
              rangeshape: rangeshape,
              time: time,
              resist: resist,
              prop: prop,
              overview: overview,
              usepower: usepower,
              power: power,
              cvalue: cvalue,
              faith: faith,
              sect: sect,
              hpresist: hpresist,
              magispfere: magispfere,
            },
          },
        ];

        // アイテム作成
        for (let item of itemData) {
          await Item.create(item);
          ui.notifications.info(`「${item.name}」の作成されました。`);
        }
      } catch (e) {
        ui.notifications.error("ファイル形式エラー");
        console.error(e);
      }
    };
    reader.readAsText(file);
  }
}

// マクロを実行
sbspellimport();
