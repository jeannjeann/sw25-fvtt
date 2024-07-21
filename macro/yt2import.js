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
      let itemData = [];

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
        itemData = [
          {
            name: "生命抵抗力",
            type: "check",
            system: {
              description: "",
              checkskill: "adv",
              checkabi: "vit",
              showbtcheck: true,
            },
          },
          {
            name: "精神抵抗力",
            type: "check",
            system: {
              description: "",
              checkskill: "adv",
              checkabi: "mnd",
              showbtcheck: true,
            },
          },
          {
            name: "先制",
            type: "check",
            system: {
              description: "",
              checkskill: "-",
              checkabi: "-",
              showbtcheck: true,
            },
          },
          {
            name: "魔物知識",
            type: "check",
            system: {
              description: "",
              checkskill: "-",
              checkabi: "-",
              showbtcheck: true,
            },
          },
        ];

        // 技能追加
        let baseString = data.sheetDescriptionS.split("技能:")[1].trim();
        let baseSkills = baseString.split("／");
        let skill = baseSkills.map((skill) => {
          let match = skill.match(/([^\d]+)(\d+)/);
          return { name: match[1], level: parseInt(match[2], 10), type: "-" };
        });
        for (let i = 1; ; i++) {
          if (!data[`commonClass${i}`]) break;
          skill.push({
            name: data[`commonClass${i}`],
            level: data[`lvCommon${i}`],
            type: "commonskill",
          });
        }
        for (let i = 0; i < skill.length; i++) {
          let matchItem = game.items.find(
            (item) => item.name === skill[i].name
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", skill[i].name);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            setData.system.skilllevel = skill[i].level;
            itemData.push(setData);
          } else {
            itemData.push({
              name: skill[i].name,
              type: "skill",
              system: {
                description: "",
                skilllevel: skill[i].level,
                skilltype: skill[i].type,
              },
            });
          }
        }
        // 言語追加
        let defaultLang = [
          {
            race: "人間",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "地方語", talk: true, read: true },
            ],
          },
          {
            race: "エルフ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "エルフ語", talk: true, read: true },
            ],
          },
          {
            race: "ドワーフ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "ドワーフ語", talk: true, read: true },
            ],
          },
          {
            race: "タビット",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "神紀文明語", talk: false, read: true },
            ],
          },
          {
            race: "ルーンフォーク",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔動機文明語", talk: true, read: true },
            ],
          },
          {
            race: "リカント",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "リカント語", talk: true, read: true },
            ],
          },
          {
            race: "リルドラケン",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "ドラゴン語", talk: true, read: false },
            ],
          },
          {
            race: "グラスランナー",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "グラスランナー語", talk: true, read: true },
            ],
          },
          {
            race: "メリア",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "妖精語", talk: true, read: false },
            ],
          },
          {
            race: "ティエンス",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔神語", talk: true, read: false },
            ],
          },
          {
            race: "レプラカーン",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔動機文明語", talk: true, read: true },
            ],
          },
          {
            race: "アルヴ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "地方語", talk: true, read: true },
            ],
          },
          {
            race: "シャドウ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "シャドウ語", talk: true, read: true },
            ],
          },
          {
            race: "ソレイユ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "ソレイユ語", talk: true, read: false },
            ],
          },
          {
            race: "ウィークリング",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔動機文明語", talk: true, read: true },
            ],
          },
          {
            race: "スプリガン",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔法文明語", talk: true, read: true },
              { name: "巨人語", talk: true, read: true },
            ],
          },
          {
            race: "アビスボーン",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "地方語", talk: true, read: true },
            ],
          },
          {
            race: "ハイマン",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔法文明語", talk: true, read: true },
            ],
          },
          {
            race: "フロウライト",
            lang: [
              { name: "交易共通語", talk: true, read: true },
            ],
          },
          {
            race: "ディアボロ",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔神語", talk: true, read: false },
            ],
          },
          {
            race: "ドレイク",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
              { name: "汎用蛮族語", talk: true, read: true },
            ],
          },
          {
            race: "バジリスク",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "バジリスク語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "妖魔語", talk: true, read: false },
            ],
          },
          {
            race: "ダークトロール",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "巨人語", talk: true, read: true },
            ],
          },
          {
            race: "アルボル",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
              { name: "妖精語", talk: true, read: false },
            ],
          },
          {
            race: "バーバヤガー",
            lang: [
              { name: "交易共通語", talk: true, read: true },
              { name: "魔法文明語", talk: true, read: true },
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
            ],
          },
          {
            race: "ケンタウロス",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "ケンタウロス語", talk: true, read: true },
            ],
          },
          {
            race: "シザースコーピオン",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "アンドロスコーピオン語", talk: true, read: true },
              { name: "魔動機文明語", talk: true, read: true },
            ],
          },
          {
            race: "ドーン",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "交易共通語", talk: true, read: true },
            ],
          },
          {
            race: "コボルド",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "交易共通語", talk: true, read: true },
              { name: "妖魔語", talk: true, read: false },
            ],
          },
          {
            race: "ドレイクブロークン",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "交易共通語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
            ],
          },
          {
            race: "ラミア",
            lang: [
              { name: "汎用蛮族語", talk: true, read: true },
              { name: "交易共通語", talk: true, read: true },
              { name: "ドレイク語", talk: true, read: true },
            ],
          },
          {
            race: "ラルヴァ",
            lang: [
              { name: "地方語", talk: true, read: true },
              { name: "交易共通語", talk: true, read: true },
            ],
          },
        ];
        for (let i = 0; i < defaultLang.length; i++) {
          if (
            data.race == defaultLang[i].race ||
            data.race == "ナイトメア（" + defaultLang[i].race + "）"
          ) {
            for (let j = 0; j < defaultLang[i].lang.length; j++) {
              let matchItem = game.items.find(
                (item) => item.name === defaultLang[i].lang[j].name
              );
              if (!matchItem) {
                matchItem = await findEntryInCompendium(
                  "Item",
                  defaultLang[i].lang[j].name
                );
              }
              if (matchItem) {
                let setData = duplicate(matchItem);
                setData.system.conversation = defaultLang[i].lang[j].talk;
                setData.system.reading = defaultLang[i].lang[j].read;
                itemData.push(setData);
              } else {
                itemData.push({
                  name: defaultLang[i].lang[j].name,
                  type: "language",
                  system: {
                    conversation: defaultLang[i].lang[j].talk,
                    reading: defaultLang[i].lang[j].read,
                  },
                });
              }
            }
          }
        }
        for (let i = 1; ; i++) {
          if (!data[`language${i}`]) break;
          let talk = true;
          let read = true;
          if (!data[`language${i}Talk`]) talk = false;
          if (!data[`language${i}Read`]) read = false;
          let matchItem = game.items.find(
            (item) => item.name === data[`language${i}`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`language${i}`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            setData.system.conversation = talk;
            setData.system.reading = read;
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`language${i}`],
              type: "language",
              system: {
                conversation: talk,
                reading: read,
              },
            });
          }
        }
        // 武器追加
        for (let i = 1; ; i++) {
          if (!data[`weapon${i}Name`]) break;
          let dedicated = true;
          if (!data[`weapon${i}Own`]) dedicated = false;
          let category;
          switch (data[`weapon${i}Category`]) {
            case "ソード":
              category = "sword";
              break;
            case "アックス":
              category = "axe";
              break;
            case "スピア":
              category = "spear";
              break;
            case "メイス":
              category = "mace";
              break;
            case "スタッフ":
              category = "staff";
              break;
            case "フレイル":
              category = "flail";
              break;
            case "ウォーハンマー":
              category = "warhammer";
              break;
            case "格闘":
              category = "grapple";
              break;
            case "投擲":
              category = "throw";
              break;
            case "ボウ":
              category = "bow";
              break;
            case "クロスボウ":
              category = "crossbow";
              break;
            case "ガン":
              category = "gun";
              break;
            default:
              break;
          }
          let usage;
          switch (data[`weapon${i}Usage`]) {
            case "1H":
              usage = "1H";
              break;
            case "1H#":
              usage = "1H#";
              break;
            case "1H投":
              usage = "1HT";
              break;
            case "1H拳":
              usage = "1HN";
              break;
            case "1H両":
              usage = "1HB";
              break;
            case "2H":
              usage = "2H";
              break;
            case "2H#":
              usage = "2H#";
              break;
            case "振2H":
              usage = "S2H";
              break;
            case "突2H":
              usage = "P2H";
              break;
            default:
              break;
          }
          let matchItem = game.items.find(
            (item) => item.name === data[`weapon${i}Name`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`weapon${i}Name`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            setData.system.equip = true;
            setData.system.dedicated = dedicated;
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`weapon${i}Name`],
              type: "weapon",
              system: {
                description: data[`weapon${i}Note`],
                equip: true,
                dedicated: dedicated,
                usedice: true,
                usepower: true,
                category: category,
                usage: usage,
                reqstr: Number(data[`weapon${i}Reqd`]),
                hit: Number(data[`weapon${i}Acc`]),
                dmod: Number(data[`weapon${i}Dmg`]),
                power: Number(data[`weapon${i}Rate`]),
                cvalue: Number(data[`weapon${i}Crit`]),
              },
            });
          }
        }
        // 防具・盾追加
        for (let i = 1; ; i++) {
          if (!data[`armour${i}Name`]) break;
          let dedicated = true;
          if (!data[`armour${i}Own`]) dedicated = false;
          let category;
          switch (data[`armour${i}Category`]) {
            case "非金属鎧":
              category = "nonmetalarmor";
              break;
            case "金属鎧":
              category = "metalarmor";
              break;
            case "盾":
              category = "shield";
              break;
            case "その他":
              category = "other";
              break;
            default:
              break;
          }
          let matchItem = game.items.find(
            (item) => item.name === data[`armour${i}Name`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`armour${i}Name`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            setData.system.equip = true;
            setData.system.dedicated = dedicated;
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`armour${i}Name`],
              type: "armor",
              system: {
                description: data[`armour${i}Note`],
                equip: true,
                dedicated: dedicated,
                category: category,
                reqstr: Number(data[`armour${i}Reqd`]),
                dodge: Number(data[`armour${i}Eva`]),
                pp: Number(data[`armour${i}Def`]),
              },
            });
          }
        }
        // 装飾品追加
        let accessorypart = [
          "Head",
          "Face",
          "Ear",
          "Neck",
          "Back",
          "HandR",
          "HandL",
          "Waist",
          "Leg",
          "Other",
        ];
        for (let i = 0; i < accessorypart.length; i++) {
          let accname = "accessory" + accessorypart[i] + "Name";
          let accown = "accessory" + accessorypart[i] + "Own";
          let accnote = "accessory" + accessorypart[i] + "Note";
          let accpart;
          switch (accessorypart[i]) {
            case "Head":
              accpart = "head";
              break;
            case "Face":
              accpart = "face";
              break;
            case "Ear":
              accpart = "ear";
              break;
            case "Neck":
              accpart = "neck";
              break;
            case "Back":
              accpart = "back";
              break;
            case "HandR":
              accpart = "rhand";
              break;
            case "HandL":
              accpart = "lhand";
              break;
            case "Waist":
              accpart = "waist";
              break;
            case "Leg":
              accpart = "leg";
              break;
            case "Other":
              accpart = "other";
              break;
            default:
              break;
          }
          if (data[accname]) {
            let dedicated = true;
            if (!data[accown]) dedicated = false;
            let matchItem = game.items.find(
              (item) => item.name === data[accname]
            );
            if (!matchItem) {
              matchItem = await findEntryInCompendium("Item", data[accname]);
            }
            if (matchItem) {
              let setData = duplicate(matchItem);
              setData.system.equip = true;
              setData.system.dedicated = dedicated;
              itemData.push(setData);
            } else {
              itemData.push({
                name: data[accname],
                type: "accessory",
                system: {
                  description: data[accnote],
                  equip: true,
                  dedicated: dedicated,
                  accpart: accpart,
                },
              });
            }
          }
        }
        // 種族特徴追加
        let raceab = data.raceAbility.match(/［([^］]+)］/g);
        let raceability = raceab.map((match) => match.replace(/[［］]/g, ""));
        for (let i = 0; i < raceability.length; i++) {
          let matchItem = game.items.find(
            (item) => item.name === raceability[i]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", raceability[i]);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: raceability[i],
              type: "raceability",
              system: {
                description: "",
              },
            });
          }
        }
        // 戦闘特技追加
        let combatability = [];
        for (let i in data) {
          if (i.startsWith("combatFeats")) {
            combatability.push(data[i]);
          }
        }
        for (let i = 0; i < combatability.length; i++) {
          let matchItem = game.items.find(
            (item) => item.name === combatability[i]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", combatability[i]);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: combatability[i],
              type: "combatability",
              system: {
                description: "",
              },
            });
          }
        }
        // 練技追加
        for (let i = 1; ; i++) {
          if (!data[`craftEnhance${i}`]) break;
          let matchItem = game.items.find(
            (item) => item.name === data[`craftEnhance${i}`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`craftEnhance${i}`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`craftEnhance${i}`],
              type: "enhancearts",
              system: {
                description: "",
              },
            });
          }
        }
        // 呪歌・終律追加
        for (let i = 1; ; i++) {
          if (!data[`craftSong${i}`]) break;
          let type = "song";
          if (/終律：/.test(data[`craftSong${i}`])) type = "final";
          let songname = data[`craftSong${i}`].replace(/終律：/g, "");
          let matchItem = game.items.find((item) => item.name === songname);
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", songname);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: songname,
              type: "magicalsong",
              system: {
                description: "",
                type: type,
              },
            });
          }
        }
        // 騎芸追加
        for (let i = 1; ; i++) {
          if (!data[`craftRiding${i}`]) break;
          let matchItem = game.items.find(
            (item) => item.name === data[`craftRiding${i}`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`craftRiding${i}`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`craftRiding${i}`],
              type: "ridingtrick",
              system: {
                description: "",
              },
            });
          }
        }
        // 賦術追加
        for (let i = 1; ; i++) {
          if (!data[`craftAlchemy${i}`]) break;
          let matchItem = game.items.find(
            (item) => item.name === data[`craftAlchemy${i}`]
          );
          if (!matchItem) {
            matchItem = await findEntryInCompendium(
              "Item",
              data[`craftAlchemy${i}`]
            );
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: data[`craftAlchemy${i}`],
              type: "alchemytech",
              system: {
                description: "",
              },
            });
          }
        }
        // 相域追加
        for (let i = 1; ; i++) {
          if (!data[`craftGeomancy${i}`]) break;
          let index = data[`craftGeomancy${i}`].indexOf("相：");
          let paname = data[`craftGeomancy${i}`].substring(
            index + "相：".length
          );
          let patype = data[`craftGeomancy${i}`].charAt(index - 1);
          let type;
          switch (patype) {
            case "天":
              type = "ten";
              break;
            case "地":
              type = "chi";
              break;
            case "人":
              type = "jin";
              break;
            default:
              break;
          }
          let matchItem = game.items.find((item) => item.name === paname);
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", paname);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: paname,
              type: "phasearea",
              system: {
                description: "",
                type: type,
              },
            });
          }
        }
        // 鼓砲・陣率追加
        for (let i = 1; ; i++) {
          if (!data[`craftCommand${i}`]) break;
          let type = "drum";
          if (/陣率：/.test(data[`craftCommand${i}`])) type = "camp";
          let tacname = data[`craftCommand${i}`].replace(/陣率：/g, "");
          let matchItem = game.items.find((item) => item.name === tacname);
          if (!matchItem) {
            matchItem = await findEntryInCompendium("Item", tacname);
          }
          if (matchItem) {
            let setData = duplicate(matchItem);
            itemData.push(setData);
          } else {
            itemData.push({
              name: tacname,
              type: "tactics",
              system: {
                description: "",
                type: type,
                line: "-",
              },
            });
          }
        }
        createActor(actorData, itemData);

      }

      // 魔物・騎獣データ
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
        let feature = data.skills.replace(/&lt;br&gt;/g, "<br>");
        console.log(feature);
        
        let actorNum = parseInt(data.partsNum,10) ? parseInt(data.partsNum,10) : 1;

        for (var i = 1; i <= actorNum; i++) {
          let partsName = i == 1 ? name : name + "_" +  data["status" + i + "Style"];
          let mountLv = parseInt(data.lvMin) ? parseInt(data.lv) - parseInt(data.lvMin) : 0;
          let access = mountLv == 0 ? i : i + "-" + (mountLv+1) ;
          actorData = {
            name: partsName,
            type: "monster",
            system: {
              hp:{
                value: data["status" + access + "Hp"],
              },
              mp:{
                value: data["status" + access + "Mp"],
              },
              monlevel: data.lv,
              hpbase: data["status" + access + "Hp"],
              mpbase: data["status" + access + "Mp"],
              ppbase: data["status" + access + "Defense"],
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
          
          let itemDamage = data["status" + access + "Damage"].replace(/\b2d6\b|\b2d\b/g, "");
          let vitResist = data.vitResist ? data.vitResist : data["status" + access + "Vit"];
          let mndResist = data.mndResist ? data.mndResist : data["status" + access + "Mnd"];
          
          itemData = [
            {
              name: "抵抗判定",
              type: "monsterability",
              system: {
                description: "",
                usedice1: true,
                label1: "生命",
                checkbasemod1: vitResist,
                usefix1: true,
                applycheck1: false,
                usedice2: true,
                label2: "精神",
                checkbasemod2: mndResist,
                usefix2: true,
                applycheck2: false,
              },
            },
            {
              name: data["status" + i + "Style"],
              type: "monsterability",
              system: {
                description: "",
                usedice1: true,
                label1: "命中",
                checkbasemod1: data["status" + access + "Accuracy"],
                usefix1: true,
                applycheck1: false,
                usedice2: true,
                label2: "打撃",
                checkbasemod2: itemDamage,
                usefix2: false,
                applycheck2: true,
                usedice3: true,
                label3: "回避",
                checkbasemod3: data["status" + access + "Evasion"],
                usefix3: true,
                applycheck3: false,
              },
            },
            {
              name: "全特殊能力",
              type: "monsterability",
              system: {
                description: feature,
              },
            },
          ];

          abilityList = analysisFeature(feature);
          for(const val of abilityList){
            itemData.push(val);
          }
          createActor(actorData, itemData);
        }
      }

    } catch (e) {
      ui.notifications.error("ファイル形式エラー");
      console.error(e);
    }
  };
  if (fileInput) {
    reader.readAsText(fileInput);
  }
}

// アクター作成
function createActor(actorData, itemData){

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
}

// 魔物特殊能力解析
function analysisFeature(feature){
  const array = feature.split('<br>');
  var parts = "";
  const patternParts = /^●(.*)$/g;
  const patternMagic = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)+(.*)[/／]魔力([0-9０-９]+).*$/g;
  const patternSkill = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)+(.*)[/／]([0-9０-９]+)[0-9０-９\(\)（）]+[/／](.*)$/g;
  const patternSplit = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑).*$/g;
  const patternConst = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*(\[常\]|○|◯|〇)(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*.*$/g;
  const patternMain = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*(\[主\]|＞|▶|〆)(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*.*$/g;
  const patternAux = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*(\[補\]|≫|>>|☆)(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*.*$/g;
  const patternPrep = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*(\[戦\]|△)(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*.*$/g;
  const patternDecia = /^(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*(\[宣\]|🗨|□|☑)(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)*.*$/g;
  const patternReplace = /(\[常\]|○|◯|〇|\[戦\]|△|\[主\]|＞|▶|〆|\[補\]|≫|>>|☆|\[宣\]|🗨|□|☑)/g;
  
  let ability = [];

  var skill = ["","","","","",false,false,false,false,false,false,false];
  var output = false;
  
  for(const val of array){
    var match = "";

    // 能力区切り
    match = val.match(patternSplit);
    if(match != null && output){

      ability.push(
        {
          name: skill[0],
          type: "monsterability",
          system: {
            usedice1: skill[5],
            label1: skill[1],
            checkbasemod1: skill[2],
            usefix1: skill[6],
            applycheck1: false,
            remark: skill[3],
            description: skill[4],
            constant: skill[7],
            main: skill[8],
            aux: skill[9],
            prep: skill[10],
            decla: skill[11]
          },
        }
      );

      skill = ["","","","","",false,false,false,false,false,false,false];
      output = false;
    }

    // 常時特技
    match = val.match(patternConst);
    if(match != null){
      skill[0] = match[0].replace(patternReplace, "");
      skill[7] = true;
      output = true;
    }

    // 主動作
    match = val.match(patternMain);
    if(match != null){
      skill[0] = match[0].replace(patternReplace, "");
      skill[8] = true;
      output = true;
    }

    // 補助動作
    match = val.match(patternAux);
    if(match != null){
      skill[0] = match[0].replace(patternReplace, "");
      skill[9] = true;
      output = true;
    }

    // 戦闘準備
    match = val.match(patternPrep);
    if(match != null){
      skill[0] = match[0].replace(patternReplace, "");
      skill[10] = true;
      output = true;
    }

    // 宣言特技
    match = val.match(patternDecia);
    if(match != null){
      skill[0] = match[0].replace(patternReplace, "");
      skill[11] = true;
      output = true;
    }

    // 部位判定
    match = val.match(patternParts);
    if(match != null){
      parts = match[0];
      
      skill = ["","","","","",false,false,false,false,false,false,false];
      continue;
    }

    // 魔法判定
    match = val.match(patternMagic);
    if(match != null){
      var split = match[0].split(patternMagic);
      skill[0] = parts != "" ? "[" + parts + "]" + split[2] : split[2];
      skill[1] = "魔力";
      skill[2] = parseInt(toHalfWidth(split[3]),10);
      skill[3] = "";
      skill[4] = match[0];
      skill[5] = true;
      skill[6] = true;
      output = true;

      continue;
    }

    // 特殊能力判定
    match = val.match(patternSkill);
    if(match != null){
      var split = match[0].split(patternSkill);

      skill[0] = parts != "" ? "[" + parts + "]" + split[2] : split[2];
      skill[1] = "判定";
      skill[2] = parseInt(toHalfWidth(split[3]),10);
      skill[3] = split[4];
      skill[4] = match[0];
      skill[5] = true;
      skill[6] = true;
      output = true;

      continue;
    }
    
    skill[4] = skill[4] + "<br>"+ val;

  }

  if(output){

    ability.push(
      {
        name: skill[0],
        type: "monsterability",
        system: {
          usedice1: skill[5],
          label1: skill[1],
          checkbasemod1: skill[2],
          usefix1: skill[6],
          applycheck1: false,
          remark: skill[3],
          description: skill[4],
          constant: skill[7],
          main: skill[8],
          aux: skill[9],
          prep: skill[10],
          decla: skill[11]
        },
      }
    );
    
    output = false;
  }

  return ability;
}

// 全角半角変換関数
function toHalfWidth(str) {
  // 全角英数字を半角に変換
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str;
}

// HTMLデコード関数
function decodeHTML(escapedText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(escapedText, "text/html");
  return doc.documentElement.textContent;
}

// Compendium検索関数
async function findEntryInCompendium(type, entryName) {
  const packs = game.packs
    .filter((p) => p.documentClass.documentName === type)
    .sort((a, b) => a.metadata.label.localeCompare(b.metadata.label));
  for (const pack of packs) {
    const index = await pack.getIndex();
    const entryIndex = index.find((e) => e.name === entryName);
    if (entryIndex) {
      const compEntry = await pack.getDocument(entryIndex._id);
      return compEntry;
    }
  }
  return null;
}

// マクロを実行
yt2import();