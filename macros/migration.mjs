/**
 *
 * データマイグレーション用のマクロです。
 * v2.1.2以前のデータを読み込み、新しい形式へとコンバートします。
 *
 */
const versionOptions = [{ label: "v2.1.2 以前", value: "2.1.2" }];
const storedVersionDefault = "2.1.2";
const currentVersion = "2.1.3";

function isVersionBefore(version, target) {
  const a = version.split(".").map((n) => parseInt(n, 10));
  const b = target.split(".").map((n) => parseInt(n, 10));
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const na = a[i] ?? 0;
    const nb = b[i] ?? 0;
    if (na < nb) return true;
    if (na > nb) return false;
  }
  return false;
}

async function migrateItem(item, storedVersion, currentVersion) {
  let changed = false;
  const updateData = { system: {} };

  if (storedVersion && isVersionBefore(storedVersion, "2.1.3")) {
    if (item.type === "spell" && !item.system.resistinfo?.type) {
      updateData.system.resistinfo = {};
      updateData.system.resistinfo.type = item.system.hpresist
        ? "Vitres"
        : "Mndres";
      updateData.system.hpresist = null;
      changed = true;
    }

    if (["magicalsong", "alchemytech"].includes(item.type)) {
      updateData.system.resistinfo = {
        ...(item.system.resistinfo || {}),
        type: "Mndres",
      };
      changed = true;
    }

    if (item.type === "monsterability") {
      if (
        item.system.label1 === game.i18n.localize("SW25.Config.MonHit") &&
        item.system.label2 === game.i18n.localize("SW25.Config.MonDmg") &&
        item.system.label3 === game.i18n.localize("SW25.Config.MonDge")
      ) {
        updateData.system.dice1 = {
          resist: {
            type: "Dodge",
            result: "disappear",
          },
        };
        changed = true;
      }
    }

    if (item.system.resist != null) {
      updateData.system.resistinfo = updateData.system.resistinfo || {};
      updateData.system.resistinfo.result = item.system.resist;
      updateData.system.resist = null;
      changed = true;
    }

    const prop = item.system?.prop;
    if (typeof prop === "string") {
      let clearElements = {};
      let propElementMap = {};

      if (["spell", "magicalsong", "phasearea"].includes(item.type)) {
        clearElements = {
          "system.elements.type": "",
          "system.elements.magic.earth": false,
          "system.elements.magic.ice": false,
          "system.elements.magic.fire": false,
          "system.elements.magic.wind": false,
          "system.elements.magic.thunder": false,
          "system.elements.magic.energy": false,
          "system.elements.magic.cut": false,
          "system.elements.magic.impact": false,
          "system.elements.magic.poison": false,
          "system.elements.magic.disease": false,
          "system.elements.magic.curse": false,
          "system.elements.magic.mental": false,
          "system.elements.magic.mentalw": false,
          "system.elements.magic.healing": false,
          "system.elements.physical.blade": false,
          "system.elements.physical.blow": false,
          "system.elements.physical.mithril": false,
        };

        propElementMap = {
          earth: { "system.elements.magic.earth": true },
          ice: { "system.elements.magic.ice": true },
          fire: { "system.elements.magic.fire": true },
          wind: { "system.elements.magic.wind": true },
          thunder: { "system.elements.magic.thunder": true },
          energy: { "system.elements.magic.energy": true },
          cut: { "system.elements.magic.cut": true },
          impact: { "system.elements.magic.impact": true },
          poison: { "system.elements.magic.poison": true },
          disease: { "system.elements.magic.disease": true },
          mental: { "system.elements.magic.mental": true },
          mentalw: { "system.elements.magic.mentalw": true },
          curse: { "system.elements.magic.curse": true },
          curseMental: {
            "system.elements.type": "or",
            "system.elements.magic.curse": true,
            "system.elements.magic.mental": true,
          },
          mentalPoison: {
            "system.elements.type": "or",
            "system.elements.magic.mental": true,
            "system.elements.magic.poison": true,
          },
          fandw: {
            "system.elements.type": "and",
            "system.elements.magic.fire": true,
            "system.elements.magic.wind": true,
          },
          iandt: {
            "system.elements.type": "and",
            "system.elements.magic.ice": true,
            "system.elements.magic.thunder": true,
          },
          other: {},
        };
      }

      if (item.type === "weapon") {
        clearElements = {
          "system.elements.physical.blade": false,
          "system.elements.physical.blow": false,
        };

        propElementMap = {
          blade: { "system.elements.physical.blade": true },
          blow: { "system.elements.physical.blow": true },
          both: {
            "system.elements.physical.blade": true,
            "system.elements.physical.blow": true,
          },
          other: {},
        };
      }

      if (Object.keys(clearElements).length > 0) {
        updateData.system = updateData.system || {};
        updateData.system.elements = mergeObject({}, clearElements, {
          inplace: false,
        });

        const propData = propElementMap[prop] || {};
        for (const [path, value] of Object.entries(propData)) {
          setProperty(updateData, path, value);
        }

        changed = true;
      }
    }
  }

  return changed ? updateData : null;
}

async function migrateActor(actor, storedVersion, currentVersion) {
  let changed = false;
  const updateData = { system: {} };
  const updateItems = [];

  if (storedVersion && isVersionBefore(storedVersion, "2.1.3")) {
    if (actor.type === "character" && !actor.system.color) {
      updateData.system.color = {
        main: { bg: "#000000", text: "#ffffff" },
        sub: { bg: "#dad8cc", text: "#000000" },
      };
      changed = true;
    }

    if (actor.type === "monster") {
      const classKeys = [
        "Barbarous",
        "Animal",
        "Plant",
        "Undead",
        "MagicCreature",
        "Machine",
        "Eidolon",
        "Fairie",
        "Daemon",
        "Human",
        "Other",
      ];

      const localizedType = actor.system?.type;
      let matchedKey = null;

      if (localizedType) {
        for (const key of classKeys) {
          const localizedName = game.i18n.localize(`SW25.Actor.Class.${key}`);
          if (localizedType === localizedName) {
            matchedKey = key;
            break;
          }
        }
      }

      if (!matchedKey) {
        matchedKey = "Other";
      }

      updateData.system = updateData.system || {};
      updateData.system.classType = matchedKey;
      changed = true;
    }
  }

  for (const item of actor.items.contents) {
    const updateItem = await migrateItem(item, storedVersion, currentVersion);
    if (updateItem) updateItems.push({ _id: item.id, ...updateItem });
  }

  if (changed) {
    await actor.update(updateData);
  }

  if (updateItems.length > 0) {
    await actor.updateEmbeddedDocuments("Item", updateItems);
  }

  return changed || updateItems.length > 0;
}

function createProgressBar(labelText) {
  const container = document.createElement("div");
  container.id = "migration-progress-bar";
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "10px",
    background: "#222",
    border: "1px solid #888",
    color: "white",
    zIndex: 10000,
    borderRadius: "5px",
    fontFamily: "Arial, sans-serif",
  });

  const label = document.createElement("div");
  label.textContent = labelText;
  label.style.marginBottom = "5px";

  const bar = document.createElement("progress");
  bar.value = 0;
  bar.max = 1;
  bar.style.width = "250px";

  container.appendChild(label);
  container.appendChild(bar);
  document.body.appendChild(container);

  return { container, bar, label };
}

function removeProgressBar(container) {
  if (container && container.remove) container.remove();
}

const packs = game.packs.filter((p) =>
  ["Item", "Actor"].includes(p.documentName)
);

if (packs.length === 0) {
  ui.notifications.warn(
    "アイテムまたはアクターのコンペンディウムが見つかりません。"
  );
  return;
}

new Dialog({
  title: "マイグレーション対象の辞典とバージョンを選択",
  content: `
    <form>
      <div class="form-group">
        <label>辞典:</label>
        <select name="compendium" style="width: 100%">
          ${packs
            .map(
              (p) =>
                `<option value="${p.collection}">${p.metadata.label}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-group" style="margin-top: 10px;">
        <label>辞典のバージョン:</label>
        <select name="storedVersion" style="width: 100%">
          ${versionOptions
            .map(
              (v) =>
                `<option value="${v.value}" ${
                  v.value === storedVersionDefault ? "selected" : ""
                }>${v.label}</option>`
            )
            .join("")}
        </select>
      </div>
    </form>
  `,
  buttons: {
    migrate: {
      icon: '<i class="fas fa-sync"></i>',
      label: "マイグレーション実行",
      callback: (html) => {
        (async () => {
          const collection = html.find('[name="compendium"]').val();
          const storedVersion = html.find('[name="storedVersion"]').val();
          const pack = game.packs.get(collection);
          if (!pack)
            return ui.notifications.error("辞典が取得できませんでした。");

          if (pack.metadata.locked) {
            ui.notifications.warn(
              "選択された辞典はロックされています。ロックを解除してください。"
            );
            return;
          }

          const documents = await pack.getDocuments();
          const docType = pack.documentName;
          const { container, bar, label } =
            createProgressBar("マイグレーション進行中");

          let count = 0;
          for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            bar.value = i / documents.length;
            label.textContent = `マイグレーション中: ${i + 1} / ${
              documents.length
            }`;

            let updated = false;
            if (docType === "Item") {
              const update = await migrateItem(
                doc,
                storedVersion,
                currentVersion
              );
              if (update) {
                await doc.update(update);
                updated = true;
              }
            } else if (docType === "Actor") {
              updated = await migrateActor(doc, storedVersion, currentVersion);
            }

            if (updated) count++;
          }

          bar.value = 1;
          label.textContent = `完了: ${count} 件を更新しました。`;

          setTimeout(() => removeProgressBar(container), 5000);
        })();
      },
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "キャンセル",
    },
  },
  default: "migrate",
}).render(true);
