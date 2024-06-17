async function sbfeatimport() {
  // ダイアログ
  let filesInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>JSONファイル(Sandbox形式)を選択してください:</p>
      <input type="file" id="json-files-input" accept=".json" multiple style="width: 100%;" />
    `;

    new Dialog({
      title: "Sandbox版特技等インポート",
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
        let name,
          type,
          description,
          overview,
          constant,
          main,
          aux,
          prep,
          level,
          time,
          mpcost,
          target,
          rangeshape,
          usedice,
          usepower,
          power,
          cvalue,
          premise,
          cond;
        let catype,
          secret,
          condtype,
          use,
          app,
          risk,
          school,
          honercost,
          sectype,
          limcond;
        let mstype,
          resist,
          prop,
          sing,
          pet,
          singpoint,
          upget,
          downget,
          charmget,
          upcond,
          downcond,
          charmcond,
          upadd,
          downadd,
          charmadd,
          upcost,
          downcost,
          charmcost;
        let support, rtpart;
        let red = 0,
          green = 0,
          black = 0,
          white = 0,
          gold = 0;
        let patype, mincost, maxcost;
        let tctype, cost, line, rank, get;

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
              !bareline[i].startsWith("威力:") &&
              !bareline[i].startsWith("流派:")
            ) {
              effect += " " + bareline[i].trim();
              i++;
            }
            param.push(["効果", effect]);
            i--;
          } else if (line.startsWith("流派:")) {
            let remark = line.substring(3).trim();
            param.push(["流派", remark]);
          } else {
            let element = line.split(/[:：]/);
            if (element.length === 2) {
              param.push([element[0].trim(), element[1].trim()]);
            }
          }
        }

        // 詳細データ
        switch (data.system.groups[0].ikey) {
          case "skill_group":
          case "sengen_skill_group":
          case "hiden_group":
            name = data.name;
            type = "combatability";
            catype = "allways";
            if (/主動作/.test(data.system.rollname)) catype = "mainop";
            if (/宣言/.test(data.system.rollname)) catype = "declaration";
            if (/△/.test(data.system.description)) prep = true;
            if (data.system.groups[0].ikey == "hiden_group") secret = true;
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "前提":
                  condtype = "premise";
                  cond = param[i][1].replace(/"/g, "").trim();
                  break;
                case "置き換え":
                  condtype = "replace";
                  cond = param[i][1].replace(/"/g, "").trim();
                  break;
                case "習得":
                  condtype = "learn";
                  cond = param[i][1].replace(/"/g, "").trim();
                  break;
                case "使用":
                  use = param[i][1].replace(/"/g, "").trim();
                  break;
                case "適用":
                  app = param[i][1].replace(/"/g, "").trim();
                  break;
                case "リスク":
                  risk = param[i][1].replace(/"/g, "").trim();
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "流派":
                  school = param[i][1].replace(/"/g, "").trim();
                  break;
                case "必要名誉点":
                  honercost = param[i][1].replace(/"/g, "").trim();
                  break;
                case "タイプ":
                  sectype = param[i][1].replace(/"/g, "").trim();
                  break;
                case "限定条件":
                  limcond = param[i][1].replace(/"/g, "").trim();
                  break;
                case "効果":
                  description = param[i][1].replace(/"/g, "").trim();
                  break;
              }
            }
            break;
          case "spell_group26":
          case "spell_group126":
            name = data.name.replace(/【/g, "").replace(/】/g, "");
            type = "enhancearts";
            if (/≫/.test(data.system.description)) aux = true;
            if (/△/.test(data.system.description)) prep = true;
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "習得可能レベル":
                  level = param[i][1].replace(/"/g, "").trim();
                  break;
                case "時間":
                  time = param[i][1].replace(/"/g, "").trim();
                  break;
                case "消費":
                  mpcost = param[i][1]
                    .replace(/"/g, "")
                    .trim()
                    .replace(/MP/g, "");
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "効果":
                  description = param[i][1].replace(/"/g, "").trim();
                  break;
              }
            }
            break;
          case "spell_group19":
          case "spell_group119":
          case "spell_group20":
          case "spell_group120":
            type = "magicalsong";
            name = data.name
              .replace(/【/g, "")
              .replace(/】/g, "")
              .replace(/終律:/g, "");
            usedice = true;
            if (
              data.system.groups[0].ikey == "spell_group19" ||
              data.system.groups[0].ikey == "spell_group119"
            ) {
              mstype = "song";
              for (let i = 0; i < param.length; i++) {
                let up, down, charm;
                switch (param[i][0]) {
                  case "歌唱":
                    sing = param[i][1].replace(/"/g, "").trim();
                    break;
                  case "ペット":
                    pet = param[i][1].replace(/"/g, "").trim();
                    break;
                  case "基礎楽素":
                    up = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&uarr;(\d+)/);
                    down = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&darr;(\d+)/);
                    charm = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/♡(\d+)/);
                    upget = up ? Number(up[1]) : 0;
                    downget = down ? Number(down[1]) : 0;
                    charmget = charm ? Number(charm[1]) : 0;
                    break;
                  case "効果発生条件":
                    up = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&uarr;(\d+)/);
                    down = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&darr;(\d+)/);
                    charm = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/♡(\d+)/);
                    upcond = up ? Number(up[1]) : 0;
                    downcond = down ? Number(down[1]) : 0;
                    charmcond = charm ? Number(charm[1]) : 0;
                    break;
                  case "追加楽素":
                    up = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&uarr;(\d+)/);
                    down = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&darr;(\d+)/);
                    charm = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/♡(\d+)/);
                    upadd = up ? Number(up[1]) : 0;
                    downadd = down ? Number(down[1]) : 0;
                    charmadd = charm ? Number(charm[1]) : 0;
                    break;
                  case "巧奏値":
                    singpoint = param[i][1].replace(/"/g, "").trim();
                    break;
                  default:
                    break;
                }
              }
            }
            if (
              data.system.groups[0].ikey == "spell_group20" ||
              data.system.groups[0].ikey == "spell_group120"
            ) {
              mstype = "final";
              for (let i = 0; i < param.length; i++) {
                let up, down, charm;
                switch (param[i][0]) {
                  case "消費":
                    up = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&uarr;(\d+)/);
                    down = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/&darr;(\d+)/);
                    charm = param[i][1]
                      .replace(/"/g, "")
                      .trim()
                      .match(/♡(\d+)/);
                    upcost = up ? Number(up[1]) : 0;
                    downcost = down ? Number(down[1]) : 0;
                    charmcost = charm ? Number(charm[1]) : 0;
                    break;
                  case "威力":
                    usepower = true;
                    power = param[i][1].replace(/"/g, "").trim();
                    break;
                  case "C値":
                    cvalue = param[i][1].replace(/"/g, "").trim();
                    break;
                  default:
                    break;
                }
              }
            }
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "習得可能レベル":
                  level = param[i][1].replace(/"/g, "").trim();
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "抵抗":
                  let bareresist = param[i][1].replace(/"/g, "").trim();
                  switch (bareresist) {
                    case "必中":
                      resist = "decide";
                      break;
                    case "任意":
                      resist = "any";
                      break;
                    case "消滅":
                      resist = "disappear";
                      break;
                    case "半減":
                      resist = "halving";
                      break;
                    default:
                      resist = "-";
                      break;
                  }
                  break;
                case "属性":
                  let bareprop = param[i][1].replace(/"/g, "").trim();
                  switch (bareprop) {
                    case "水・氷":
                      prop = "ice";
                      break;
                    case "風":
                      prop = "wind";
                      break;
                    case "衝撃":
                      prop = "impact";
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
                    case "炎かつ風":
                      prop = "fandw";
                      break;
                    case "水・氷かつ雷":
                      prop = "iandt";
                      break;
                    default:
                      prop = "-";
                      break;
                  }
                  break;
                case "効果":
                  description = param[i][1].replace(/"/g, "").trim();
                  break;
              }
            }
            break;
          case "spell_group21":
          case "spell_group121":
            type = "ridingtrick";
            name = data.name.replace(/【/g, "").replace(/】/g, "");
            if (/◯/.test(data.system.description)) constant = true;
            if (/▶/.test(data.system.description)) main = true;
            if (/≫/.test(data.system.description)) aux = true;
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "習得可能レベル":
                  level = param[i][1].replace(/"/g, "").trim();
                  break;
                case "前提":
                  premise = param[i][1].replace(/"/g, "").trim();
                  break;
                case "対応":
                  support = param[i][1].replace(/"/g, "").trim();
                  break;
                case "適用部位":
                  rtpart = param[i][1].replace(/"/g, "").trim();
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "効果":
                  description = param[i][1].replace(/"/g, "").trim();
                  break;
              }
            }
            break;
          case "spell_group22":
          case "spell_group122":
            type = "alchemytech";
            name = data.name.replace(/【/g, "").replace(/】/g, "");
            if (/△/.test(data.system.description)) prep = true;
            if (/≫/.test(data.system.description)) aux = true;
            usedice = true;
            switch (data.system.attributes.alc_list.value) {
              case "赤":
                red = Number(data.system.attributes.spell_cost.value);
                break;
              case "緑":
                green = Number(data.system.attributes.spell_cost.value);
                break;
              case "黒":
                black = Number(data.system.attributes.spell_cost.value);
                break;
              case "白":
                white = Number(data.system.attributes.spell_cost.value);
                break;
              case "金":
                gold = Number(data.system.attributes.spell_cost.value);
                break;
              default:
                break;
            }
            switch (data.system.attributes.alc_list2.value) {
              case "赤":
                red = Number(data.system.attributes.spell_cost2.value);
                break;
              case "緑":
                green = Number(data.system.attributes.spell_cost2.value);
                break;
              case "黒":
                black = Number(data.system.attributes.spell_cost2.value);
                break;
              case "白":
                white = Number(data.system.attributes.spell_cost2.value);
                break;
              case "金":
                gold = Number(data.system.attributes.spell_cost2.value);
                break;
              default:
                break;
            }
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "習得可能レベル":
                  level = param[i][1].replace(/"/g, "").trim();
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
                  switch (bareresist) {
                    case "必中":
                      resist = "decide";
                      break;
                    case "任意":
                      resist = "any";
                      break;
                    case "消滅":
                      resist = "disappear";
                      break;
                    case "短縮":
                      resist = "shortening";
                      break;
                    default:
                      resist = "-";
                      break;
                  }
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "効果":
                  description = param[i][1]
                    .replace(/"/g, "")
                    .trim()
                    .replace(/B:/g, "<br>B:");
                  break;
              }
            }
            break;
          case "spell_group23":
          case "spell_group123":
            type = "phasearea";
            name = data.name
              .replace(/【/g, "")
              .replace(/】/g, "")
              .replace(/天相:/g, "")
              .replace(/地相:/g, "")
              .replace(/人相:/g, "");
            if (/天相/.test(data.name)) patype = "ten";
            if (/地相/.test(data.name)) patype = "chi";
            if (/人相/.test(data.name)) patype = "jin";
            let barelevel = bareData.match(/習得可能レベル (\d+)/);
            level = barelevel[1];
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "消費":
                  let barecost = param[i][1].replace(/"/g, "").trim();
                  let baremin = barecost.match(/命脈点(\d+)/);
                  let min = baremin[1];
                  let max = min;
                  if (/~|～/.test(barecost)) {
                    let baremax = barecost.match(/[~～](\d+)/g);
                    max = baremax.map((match) => match.slice(1));
                  }
                  mincost = min;
                  maxcost = max;
                  break;
                case "時間":
                  time = param[i][1].replace(/"/g, "").trim();
                  break;
                case "属性":
                  let bareprop = param[i][1].replace(/"/g, "").trim();
                  switch (bareprop) {
                    case "雷":
                      prop = "thunder";
                      break;
                    case "精神効果(弱)":
                    case "精神効果（弱）":
                      prop = "mentalw";
                      break;
                    case "呪い":
                      prop = "curse";
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
              }
            }
            break;
          case "spell_group24":
          case "spell_group124":
          case "spell_group25":
          case "spell_group125":
            type = "tactics";
            name = data.name
              .replace(/【/g, "")
              .replace(/】/g, "")
              .replace(/陣率:/g, "");
            if (/△/.test(data.system.description)) prep = true;
            if (/≫/.test(data.system.description)) aux = true;
            if (
              data.system.groups[0].ikey == "spell_group24" ||
              data.system.groups[0].ikey == "spell_group124"
            ) {
              tctype = "drum";
              for (let i = 0; i < param.length; i++) {
                switch (param[i][0]) {
                  case "系統":
                    let bareline = param[i][1].replace(/"/g, "").trim();
                    switch (bareline) {
                      case "攻撃系":
                        line = "attack";
                        break;
                      case "回避系":
                        line = "dodge";
                        break;
                      case "防御系":
                        line = "deffence";
                        break;
                      case "抵抗系":
                        line = "resist";
                        break;
                      case "鼓舞系":
                        line = "inspire";
                        break;
                      default:
                        line = "-";
                        break;
                    }
                    break;
                  case "ランク":
                    rank = Number(
                      param[i][1]
                        .replace(/"/g, "")
                        .trim()
                        .replace(/ランク/g, "")
                    );
                    break;
                  case "陣気蓄積":
                    get = Number(param[i][1].replace(/"/g, "").trim());
                    break;
                }
              }
            }
            if (
              data.system.groups[0].ikey == "spell_group25" ||
              data.system.groups[0].ikey == "spell_group125"
            ) {
              tctype = "camp";
              for (let i = 0; i < param.length; i++) {
                switch (param[i][0]) {
                  case "前提":
                    premise = param[i][1].replace(/"/g, "").trim();
                    break;
                  case "使用条件":
                    cond = param[i][1].replace(/"/g, "").trim();
                    break;
                }
              }
            }
            for (let i = 0; i < param.length; i++) {
              switch (param[i][0]) {
                case "習得可能レベル":
                  level = param[i][1].replace(/"/g, "").trim();
                  break;
                case "陣気コスト":
                  cost = param[i][1].replace(/"/g, "").trim();
                  break;
                case "概要":
                  overview = param[i][1].replace(/"/g, "").trim();
                  break;
                case "効果":
                  description = param[i][1].replace(/"/g, "").trim();
                  break;
              }
            }
            break;
          default:
            break;
        }

        // アイテムデータ作成
        switch (type) {
          case "combatability":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  type: catype,
                  prep: prep,
                  secret: secret,
                  condtype: condtype,
                  cond: cond,
                  use: use,
                  app: app,
                  risk: risk,
                  overview: overview,
                  school: school,
                  honercost: honercost,
                  sectype: sectype,
                  limcond: limcond,
                },
              },
            ];
            break;
          case "enhancearts":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  aux: aux,
                  prep: prep,
                  level: level,
                  time: time,
                  mpcost: mpcost,
                  overview: overview,
                },
              },
            ];
            break;
          case "magicalsong":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  usedice: usedice,
                  usepower: usepower,
                  type: mstype,
                  level: level,
                  overview: overview,
                  resist: resist,
                  prop: prop,
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
                  power: power,
                  cvalue: cvalue,
                },
              },
            ];
            break;
          case "ridingtrick":
            itemData = [
              {
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
              },
            ];
            break;
          case "alchemytech":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  usedice: usedice,
                  prep: prep,
                  aux: aux,
                  level: level,
                  target: target,
                  rangeshape: rangeshape,
                  time: time,
                  resist: resist,
                  red: red,
                  green: green,
                  black: black,
                  white: white,
                  gold: gold,
                  overview: overview,
                },
              },
            ];
            break;
          case "phasearea":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  type: patype,
                  time: time,
                  prop: prop,
                  level: level,
                  mincost: mincost,
                  maxcost: maxcost,
                  overview: overview,
                },
              },
            ];
            break;
          case "tactics":
            itemData = [
              {
                name: name,
                type: type,
                system: {
                  description: description,
                  type: tctype,
                  prep: prep,
                  aux: aux,
                  level: level,
                  cost: cost,
                  line: line,
                  rank: rank,
                  get: get,
                  premise: premise,
                  cond: cond,
                  overview: overview,
                },
              },
            ];
            break;
          default:
            break;
        }

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
sbfeatimport();
