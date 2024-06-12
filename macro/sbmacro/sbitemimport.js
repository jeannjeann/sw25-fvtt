async function sbitemimport() {
  // ダイアログ
  let filesInput = await new Promise((resolve) => {
    let dialogContent = `
      <p>JSONファイル(Sandbox形式)を選択してください:</p>
      <input type="file" id="json-files-input" accept=".json" multiple style="width: 100%;" />
    `;

    new Dialog({
      title: "Sandbox版所持品インポート",
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
        let type = "item";
        let baretype;
        if (data.system.attributes.eq_list) {
          baretype = data.system.attributes.eq_list.value;
          if (/^その他/.test(baretype)) baretype = "その他";
        }

        let usedice = false;
        let usepower = false;
        let category,
          reqstr,
          usage,
          hit,
          dmod,
          range,
          power,
          cvalue,
          dodge,
          pp,
          mpp,
          accpart;

        // 詳細データ
        switch (baretype) {
          case "武器":
            type = "weapon";
            usedice = true;
            usepower = true;
            reqstr = data.system.attributes.eq_weight_value.value;
            usage = data.system.attributes.eq_list2.value;
            hit = data.system.attributes.eq_hit_value.value;
            dmod = data.system.attributes.eq_damage_value.value;
            range = data.system.attributes.eq_memo_value.value;
            power = data.system.attributes.eq_d_value.value;
            cvalue = data.system.attributes.eq_c_value.value;
            break;
          case "鎧":
          case "盾":
            type = "armor";
            category = "-";
            if (baretype == "盾") category = "shield";
            rank = "";
            reqstr = data.system.attributes.eq_weight_value.value;
            dodge = data.system.attributes.eq_dodge_value.value;
            pp = data.system.attributes.eq_bougo_value.value;
            mpp = data.system.attributes.eq_mahou_bougo_value.value;
            break;
          case "頭":
            type = "accessory";
            accpart = "head";
            break;
          case "顔":
            type = "accessory";
            accpart = "face";
            break;
          case "耳":
            type = "accessory";
            accpart = "ear";
            break;
          case "首":
            type = "accessory";
            accpart = "neck";
            break;
          case "背中":
            type = "accessory";
            accpart = "back";
            break;
          case "右手":
            type = "accessory";
            accpart = "rhand";
            break;
          case "左手":
            type = "accessory";
            accpart = "lhand";
            break;
          case "腰":
            type = "accessory";
            accpart = "waist";
            break;
          case "足":
            type = "accessory";
            accpart = "leg";
            break;
          case "その他":
            type = "accessory";
            accpart = "other";
            break;
          default:
            break;
        }

        // アイテムデータ作成
        switch (type) {
          case "item":
            itemData = [
              {
                name: data.name,
                type: type,
              },
            ];
            break;
          case "weapon":
            itemData = [
              {
                name: data.name,
                type: type,
                system: {
                  description: "",
                  usedice: usedice,
                  usepower: usepower,
                  reqstr: reqstr,
                  usage: usage,
                  hit: hit,
                  dmod: dmod,
                  range: range,
                  power: power,
                  cvalue: cvalue,
                },
              },
            ];
            break;
          case "armor":
            itemData = [
              {
                name: data.name,
                type: type,
                system: {
                  description: "",
                  category: category,
                  reqstr: reqstr,
                  dodge: dodge,
                  pp: pp,
                  mpp: mpp,
                },
              },
            ];
            break;
          case "accessory":
            itemData = [
              {
                name: data.name,
                type: type,
                system: {
                  description: "",
                  accpart: accpart,
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
sbitemimport();
