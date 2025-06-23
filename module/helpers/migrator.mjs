export class Migrator {

  // item migration
  static async migrateItem(item, storedVersion, currentVersion) {
    let changed = false;
    const updateData = { system: {} };

    // v 2.1.2 migration.
    if ( storedVersion && Migrator.isVersionBefore(storedVersion, "2.1.2") ){
      if (item.type === "spell" && !item.system.resistinfo?.type) {
        updateData.system.resistinfo = {};
        updateData.system.resistinfo.type = item.system.hpresist ? "Vitres" : "Mndres";
        updateData.system.hpresist = null;
        changed = true;
      }

      if (item.type === "magicalsong" || item.type === "alchemytech") {
        updateData.system.resistinfo = {
          ...(item.system.resistinfo || {}),
          type: "Mndres"
        };
        changed = true;
      }

      if (item.type === "monsterability") {
        if (
          item.system.label1 == game.i18n.localize("SW25.Config.MonHit") &&
          item.system.label2 == game.i18n.localize("SW25.Config.MonDmg") &&
          item.system.label3 == game.i18n.localize("SW25.Config.MonDge")
        ) {
          updateData.system.dice1 = {
            resist: {
              type: "Dodge",
              result: "disappear"
            }
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
    }

    return changed ? updateData : null;
  }

  // actor migration
  static async migrateActor(actor, storedVersion, currentVersion) {
    let changed = false;
    const updateData = { system: {} };
    const updateItems = [];

    // v 2.1.2 migration.
    if ( storedVersion && Migrator.isVersionBefore(storedVersion, "2.1.2") ){
      if (actor.type === "character"){
        updateData.system.color = {
          main: {
            bg: "#000000",
            text: "#ffffff"
          },
          sub: {
            bg: "#efe6d8",
            text: "#000000"
          }
        };
        changed = true;
      }
    }  
    for (const item of actor.items) {
      const updateItem = await this.migrateItem(item, currentVersion, storedVersion);
      if (updateItem) updateItems.push({ _id: item.id, ...updateItem });
    }

    if (changed){
      await actor.update(updateData);
    }

    if (updateItems.length > 0) {
      await actor.updateEmbeddedDocuments("Item", updateItems);
    }
  }

  // world migration
  static async migrateWorld(storedVersion, currentVersion) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "20px";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translateX(-50%)";
    wrapper.style.width = "400px";
    wrapper.style.background = "rgba(0,0,0,0.8)";
    wrapper.style.color = "white";
    wrapper.style.padding = "10px";
    wrapper.style.fontFamily = "sans-serif";
    wrapper.style.zIndex = 10000;
    wrapper.style.borderRadius = "6px";
    wrapper.style.userSelect = "none";
    document.body.appendChild(wrapper);

    function createProgressBar(labelText) {
      const container = document.createElement("div");
      container.style.marginBottom = "10px";

      const label = document.createElement("div");
      label.textContent = labelText;
      label.style.marginBottom = "4px";

      const barBg = document.createElement("div");
      barBg.style.width = "100%";
      barBg.style.height = "20px";
      barBg.style.backgroundColor = "#444";
      barBg.style.borderRadius = "4px";
      barBg.style.overflow = "hidden";

      const bar = document.createElement("div");
      bar.style.height = "100%";
      bar.style.width = "0%";
      bar.style.backgroundColor = "#4caf50";
      bar.style.transition = "width 0.2s ease";

      barBg.appendChild(bar);
      container.appendChild(label);
      container.appendChild(barBg);

      return { container, label, bar };
    }

    const itemLabel = game.i18n.localize("PROGRESS.Item");
    const actorLabel = game.i18n.localize("PROGRESS.Actor");

    const itemProgress = createProgressBar(`${itemLabel}: 0 / 0`);
    wrapper.appendChild(itemProgress.container);

    const actorProgress = createProgressBar(`${actorLabel}: 0 / 0`);
    wrapper.appendChild(actorProgress.container);

    const allItems = [...game.items];
    const totalItems = allItems.length;
    let processedItems = 0;
    let itemBatch = [];

    for (const item of allItems) {
      const changes = await this.migrateItem(item, storedVersion, currentVersion);
      if (changes) {
        itemBatch.push({ _id: item.id, ...changes });
      }
      processedItems++;

      if (itemBatch.length >= 10 || processedItems === totalItems) {
        if (itemBatch.length > 0) {
          await Item.updateDocuments(itemBatch);
          itemBatch = [];
        }
        const percent = (processedItems / totalItems) * 100;
        itemProgress.bar.style.width = `${percent}%`;
        itemProgress.label.textContent = `${itemLabel}: ${processedItems} / ${totalItems}`;
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    const allActors = [...game.actors];
    const totalActors = allActors.length;
    let processedActors = 0;

    for (const actor of allActors) {
      await this.migrateActor(actor, storedVersion, currentVersion);
      processedActors++;

      if (processedActors % 10 === 0 || processedActors === totalActors) {
        const percent = (processedActors / totalActors) * 100;
        actorProgress.bar.style.width = `${percent}%`;
        actorProgress.label.textContent = `${actorLabel}: ${processedActors} / ${totalActors}`;
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    const complete = game.i18n.localize("PROGRESS.Complete");
    itemProgress.label.textContent = `${itemLabel}: ${complete} (${totalItems})`;
    itemProgress.bar.style.width = "100%";

    actorProgress.label.textContent = `${actorLabel}: ${complete} (${totalActors})`;
    actorProgress.bar.style.width = "100%";

    setTimeout(() => wrapper.remove(), 3000);
  }

  // version check
  static isVersionBefore(oldVer, newVer) {
    const a = oldVer.split(".").map(n => parseInt(n, 10));
    const b = newVer.split(".").map(n => parseInt(n, 10));

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const av = a[i] || 0;
      const bv = b[i] || 0;
      if (av < bv) return true;
      if (av > bv) return false;
    }
    return false;
  }
}