//　終律は上手く動かない、戦闘特技、賦術、相域、鼓砲・陣率は作っていない

async function sbcsvimport() {
  // 読み込みデータ種別（手動設定）
  let type = "spell"; // spell, combatability, enhancearts, magicalsong, ridingtrick, alchemytech, phasearea, tactics
  let subtype = ""; // sorcerer, conjurer, wizard, priest, magitech, fairy, druid, daemon, song, final
  let fairytype = ""; // basicfairy, propfairy, specialfairy
  let fairyprop = ""; // fairyearth, fairyice, fairyfire, fairywind, fairylight, fairydark

  // ダイアログ
  let filesInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>CSVファイルを選択してください:</p>
      <input type="file" id="json-files-input" accept=".csv" multiple style="width: 100%;" />
    `;

    new Dialog({
      title: "Sandbox版CSVインポート",
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

  // csvファイル読み込み
  for (let file of filesInput) {
    let reader = new FileReader();
    reader.onload = async function (e) {
      let contents = e.target.result;
      let baredata = parseCSV(contents);
      let data = [];
      let itemData = [];

      // 詳細データ
      for (x = 0; x < baredata.length; x++) {
        let name = "";
        let constant = false;
        let main = false;
        let aux = false;
        let prep = false;
        let description = "";
        let overview = "";
        let level = null;
        let mpcost = null;
        let target = "";
        let rangeshape = "";
        let time = "";
        let resist = "";
        let hpresist = false;
        let prop = "";
        let usedice = false;
        let usepower = false;
        let power = null;
        let cvalue = null;
        let faith = "";
        let sect = "";
        let magispfere = "";
        let sing = "";
        let pet = "";
        let upget = "";
        let downget = "";
        let charmget = "";
        let upcond = "";
        let downcond = "";
        let charmcond = "";
        let upadd = "";
        let downadd = "";
        let charmadd = "";
        let singpoint = "";
        let upcost = "";
        let downcost = "";
        let charmcost = "";
        let premise = "";
        let support = "";
        let rtpart = "";

        data = baredata[x];

        if (type == "spell") {
          let barename = data[0];
          if (barename.includes("≫")) {
            aux = true;
            barename = barename.replace(/≫/g, "").trim();
          }
          if (barename.includes("△")) {
            prep = true;
            barename = barename.replace(/△/g, "").trim();
          }
          name = barename.replace(/【/g, "").replace(/】/g, "");
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case "効果:":
                let baredesc = data[i + 1];
                if (baredesc.includes("威力:")) {
                  usepower = true;
                  let barepower = baredesc.match(/威力:\s*(\d+)/);
                  let barecvalue = baredesc.match(/C値:\s*(\d+)/);
                  power = Number(barepower[1]);
                  if (!barecvalue || barecvalue[1] == "なし") cvalue = 13;
                  else cvalue = Number(barecvalue[1]);
                }
                description = baredesc
                  .replace(/威力:.*/, "")
                  .replace(/C値:.*/, "");
                break;
              case "詠唱:":
                description += "<br>詠唱：<br>" + data[i + 1];
                break;
              case "レベル:":
              case "ランク:":
                level = Number(data[i + 1]);
                break;
              case "消費:":
                mpcost = Number(data[i + 1].replace(/MP/g, ""));
                break;
              case "対象:":
                target = data[i + 1];
                break;
              case "射程/形状:":
                rangeshape = data[i + 1];
                break;
              case "時間:":
                time = data[10].replace(/"/g, "").trim();
                break;
              case "抵抗:":
                let bareresist = data[i + 1];
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
              case "属性:":
                let bareprop = data[i + 1];
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
              case "備考:":
                let etc = data[i + 1];
                if (etc.includes("第一の剣専用")) faith = "first";
                if (etc.includes("第二の剣専用")) faith = "second";
                let indexsect = etc.indexOf("専用(第");
                if (indexsect !== -1) sect = etc.substring(0, indexsect);
                if (etc.includes("マギスフィア:")) {
                  magispfere = etc.replace("マギスフィア:", "");
                }
                break;
              case "概要:":
                overview = data[i + 1];
                break;
              default:
                break;
            }
          }
          // アイテムデータ作成
          itemData.push({
            name: name,
            type: type,
            system: {
              description: description,
              type: subtype,
              aux: aux,
              prep: prep,
              level: level,
              mpcost: mpcost,
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
              fairytype: fairytype,
              fairyprop: fairyprop,
            },
          });
        }

        if (type == "enhancearts") {
          let barename = data[0];
          if (barename.includes("≫")) {
            aux = true;
            barename = barename.replace(/≫/g, "").trim();
          }
          if (barename.includes("△")) {
            prep = true;
            barename = barename.replace(/△/g, "").trim();
          }
          name = barename.replace(/【/g, "").replace(/】/g, "");
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case "習得可能レベル:":
                level = Number(data[i + 1]);
                break;
              case "消費:":
                mpcost = Number(data[i + 1].replace(/MP/g, ""));
                break;
              case "時間:":
                time = data[i + 1].replace(/"/g, "").trim();
                break;
              case "概要:":
                overview = data[i + 1];
                break;
              case "効果:":
                description = data[i + 1];
                break;
              default:
                break;
            }
          }
          // アイテムデータ作成
          itemData.push({
            name: name,
            type: type,
            system: {
              description: description,
              type: subtype,
              aux: aux,
              prep: prep,
              level: level,
              mpcost: mpcost,
              time: time,
              overview: overview,
            },
          });
        }

        if (type == "magicalsong") {
          let barename = data[0];
          name = barename.replace(/【/g, "").replace(/】/g, "");
          usedice = true;
          let up, down, charm;
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case "習得可能レベル:":
                level = Number(data[i + 1]);
                break;
              case "抵抗:":
                let bareresist = data[i + 1];
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
              case "属性:":
                let bareprop = data[i + 1];
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
              case "概要:":
                overview = data[i + 1];
                break;
              case "効果:":
                let baredesc = data[i + 1];
                if (baredesc.includes("威力:")) {
                  usepower = true;
                  let barepower = baredesc.match(/威力:\s*(\d+)/);
                  let barecvalue = baredesc.match(/C値:\s*(\d+)/);
                  power = Number(barepower[1]);
                  if (!barecvalue || barecvalue[1] == "なし") cvalue = 13;
                  else cvalue = Number(barecvalue[1]);
                }
                description = baredesc
                  .replace(/威力:.*/, "")
                  .replace(/C値:.*/, "");
                break;
              default:
                break;
            }
            if (subtype == "song") {
              switch (data[i]) {
                case "歌唱:":
                  sing = data[i + 1].replace(/"/g, "").trim();
                  break;
                case "ペット:":
                  pet = data[i + 1].replace(/"/g, "").trim();
                  break;
                case "基礎楽素:":
                  up = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↑(\d+)/);
                  down = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↓(\d+)/);
                  charm = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/♡(\d+)/);
                  upget = up ? Number(up[1]) : 0;
                  downget = down ? Number(down[1]) : 0;
                  charmget = charm ? Number(charm[1]) : 0;
                  break;
                case "効果発生条件:":
                  up = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↑(\d+)/);
                  down = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↓(\d+)/);
                  charm = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/♡(\d+)/);
                  upcond = up ? Number(up[1]) : 0;
                  downcond = down ? Number(down[1]) : 0;
                  charmcond = charm ? Number(charm[1]) : 0;
                  break;
                case "追加楽素:":
                  up = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↑(\d+)/);
                  down = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↓(\d+)/);
                  charm = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/♡(\d+)/);
                  upadd = up ? Number(up[1]) : 0;
                  downadd = down ? Number(down[1]) : 0;
                  charmadd = charm ? Number(charm[1]) : 0;
                  break;
                case "巧奏値:":
                  singpoint = data[i + 1].replace(/"/g, "").trim();
                  break;
                default:
                  break;
              }
            }
            if (subtype == "final") {
              switch (data[i]) {
                case "消費:":
                  up = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↑(\d+)/);
                  down = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/↓(\d+)/);
                  charm = data[i + 1]
                    .replace(/"/g, "")
                    .trim()
                    .match(/♡(\d+)/);
                  upcost = up ? Number(up[1]) : 0;
                  downcost = down ? Number(down[1]) : 0;
                  charmcost = charm ? Number(charm[1]) : 0;
                  break;
                default:
                  break;
              }
            }
          }
          // アイテムデータ作成
          itemData.push({
            name: name,
            type: type,
            system: {
              description: description,
              type: subtype,
              usedice: usedice,
              usepower: usepower,
              power: power,
              cvalue: cvalue,
              resist: resist,
              prop: prop,
              overview: overview,
              sing: sing,
              pet: pet,
              singpoint: singpoint,
              upget: upget,
              downget: downget,
              charmget: charmget,
              upcond: upcond,
              downcond: downcond,
              charmcond: charmcond,
              upadd: upadd,
              downadd: downadd,
              charmadd: charmadd,
              upcost: upcost,
              downcost: downcost,
              charmcost: charmcost,
            },
          });
        }

        if (type == "ridingtrick") {
          let barename = data[0];
          if (barename.includes("〇")) {
            constant = true;
            barename = barename.replace(/〇/g, "").trim();
          }
          if (barename.includes("▶")) {
            main = true;
            barename = barename.replace(/▶/g, "").trim();
          }
          if (barename.includes("≫")) {
            aux = true;
            barename = barename.replace(/≫/g, "").trim();
          }
          name = barename.replace(/【/g, "").replace(/】/g, "");
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case "習得可能レベル:":
                level = data[i + 1].replace(/"/g, "").trim();
                break;
              case "前提:":
                premise = data[i + 1].replace(/"/g, "").trim();
                break;
              case "対応:":
                support = data[i + 1].replace(/"/g, "").trim();
                break;
              case "適用部位:":
                rtpart = data[i + 1].replace(/"/g, "").trim();
                break;
              case "概要:":
                overview = data[i + 1].replace(/"/g, "").trim();
                break;
              case "効果:":
                description = data[i + 1].replace(/"/g, "").trim();
                break;
            }
          }
          // アイテムデータ作成
          itemData.push({
            name: name,
            type: type,
            system: {
              description: description,
              constant: constant,
              main: main,
              aux: aux,
              level: level,
              premise: premise,
              support: support,
              rtpart: rtpart,
              overview: overview,
            },
          });
        }

        if (type == "alchemytech") {
        }

        if (type == "phasearea") {
        }

        if (type == "tactics") {
        }

        if (type == "combatability") {
        }
      }

      // アイテム作成
      for (let item of itemData) {
        await Item.create(item);
        ui.notifications.info(`「${item.name}」が作成されました。`);
      }
    };
    reader.readAsText(file);
  }
}

// CSVパース関数
function parseCSV(csv) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if (char === "\n" && !inQuotes) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  if (currentCell !== "") {
    currentRow.push(currentCell.trim());
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

// マクロを実行
sbcsvimport();
