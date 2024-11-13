// Import document classes.
import { SW25Actor } from "./documents/actor.mjs";
import { SW25Item } from "./documents/item.mjs";
import { SW25ActiveEffect } from "./documents/active-effect.mjs";
import { SW25Combat } from "./documents/combat.mjs";
// Import sheet classes.
import { SW25ActorSheet } from "./sheets/actor-sheet.mjs";
import { SW25ItemSheet } from "./sheets/item-sheet.mjs";
import { SW25ActiveEffectConfig } from "./sheets/active-effect-config.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { SW25 } from "./helpers/config.mjs";
import { chatButton } from "./helpers/chatbutton.mjs";
import { customCommand } from "./helpers/customcommand.mjs";
import { powerRoll } from "./helpers/powerroll.mjs";
import { lootRoll } from "./helpers/lootroll.mjs";
import { growthCheck } from "./helpers/growthcheck.mjs";
import { rollreq } from "./helpers/rollrequest.mjs";
import { preparePolyglot } from "./helpers/sw25languageprovider.mjs";

// Export variable.
export const rpt = {};
export let effectVitResPC,
  effectMndResPC,
  effectInitPC,
  effectMKnowPC,
  effectVitResMon,
  effectMndResMon,
  effectHitMon,
  effectDmgMon,
  effectDodgeMon,
  effectScpMon,
  effectCnpMon,
  effectWzpMon,
  effectPrpMon,
  effectMtpMon,
  effectFrpMon,
  effectDrpMon,
  effectDmpMon;

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.sw25 = {
    SW25Actor,
    SW25Item,
    SW25ActiveEffect,
    SW25Combat,
    rollItemMacro,
    powerRoll,
    lootRoll,
    growthCheck,
  };

  // Add custom constants for configuration.
  CONFIG.SW25 = SW25;

  // Define custom Document classes
  CONFIG.Actor.documentClass = SW25Actor;
  CONFIG.Item.documentClass = SW25Item;
  CONFIG.ActiveEffect.documentClass = SW25ActiveEffect;
  CONFIG.Combat.documentClass = SW25Combat;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("sw25", SW25ActorSheet, {
    makeDefault: true,
    label: "SW25.SheetLabels.Actor",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("sw25", SW25ItemSheet, {
    makeDefault: true,
    label: "SW25.SheetLabels.Item",
  });

  // Register Active effect sheet Class
  DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
  DocumentSheetConfig.registerSheet(
    ActiveEffect,
    "sw25",
    SW25ActiveEffectConfig,
    {
      makeDefault: true,
      label: "SW25.SheetLabels.ActiveEffect",
    }
  );

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper("isEven", function (num) {
  return num % 2 === 0;
});

Handlebars.registerHelper("growth", function (idx) {
  switch (idx) {
    case 0:
      return "⚀";
    case 1:
      return "⚁";
    case 2:
      return "⚂";
    case 3:
      return "⚃";
    case 4:
      return "⚄";
    case 5:
      return "⚅";
  }
});

Handlebars.registerHelper("localizeAbility", function (ability) {
  switch (ability) {
    case "dex":
      return game.i18n.localize("SW25.Ability.Technique");
    case "str":
      return game.i18n.localize("SW25.Ability.Body");
    case "int":
      return game.i18n.localize("SW25.Ability.Heart");
  }
});

Handlebars.registerHelper("localizeResist", function (resist) {
  switch (resist) {
    case "decide":
      return game.i18n.localize("SW25.Item.Decide");
    case "any":
      return game.i18n.localize("SW25.Item.Any");
    case "none":
      return game.i18n.localize("SW25.Item.None");
    case "disappear":
      return game.i18n.localize("SW25.Item.Disappear");
    case "halving":
      return game.i18n.localize("SW25.Item.Halving");
    case "shortening":
      return game.i18n.localize("SW25.Item.Shortening");
  }
  return "-";
});

Handlebars.registerHelper("localizeProp", function (prop) {
  switch (prop) {
    case "earth":
      return game.i18n.localize("SW25.Item.Earth");
    case "ice":
      return game.i18n.localize("SW25.Item.Ice");
    case "fire":
      return game.i18n.localize("SW25.Item.Fire");
    case "wind":
      return game.i18n.localize("SW25.Item.Wind");
    case "thunder":
      return game.i18n.localize("SW25.Item.Thunder");
    case "energy":
      return game.i18n.localize("SW25.Item.Energy");
    case "cut":
      return game.i18n.localize("SW25.Item.Cut");
    case "impact":
      return game.i18n.localize("SW25.Item.Impact");
    case "poison":
      return game.i18n.localize("SW25.Item.Poison");
    case "disease":
      return game.i18n.localize("SW25.Item.Disease");
    case "mental":
      return game.i18n.localize("SW25.Item.Mental");
    case "mentalw":
      return game.i18n.localize("SW25.Item.Mentalw");
    case "curse":
      return game.i18n.localize("SW25.Item.Curse");
    case "curseMental":
      return game.i18n.localize("SW25.Item.CurseMental");
    case "mentalPoison":
      return game.i18n.localize("SW25.Item.MentalPoison");
    case "other":
      return game.i18n.localize("SW25.Item.Other");
    case "fandw":
      return game.i18n.localize("SW25.Item.Fandw");
    case "iandt":
      return game.i18n.localize("SW25.Item.Iandt");
  }
  return "-";
});

Handlebars.registerHelper("localizeFairyProp", function (fairyprop) {
  switch (fairyprop) {
    case "fairyearth":
      return game.i18n.localize("SW25.Item.Spell.Fairyearth");
    case "fairyice":
      return game.i18n.localize("SW25.Item.Spell.Fairyice");
    case "fairyfire":
      return game.i18n.localize("SW25.Item.Spell.Fairyfire");
    case "fairywind":
      return game.i18n.localize("SW25.Item.Spell.Fairywind");
    case "fairylight":
      return game.i18n.localize("SW25.Item.Spell.Fairylight");
    case "fairydark":
      return game.i18n.localize("SW25.Item.Spell.Fairydark");
  }
  return "-";
});

Handlebars.registerHelper("localizePhasetype", function (phasetype) {
  switch (phasetype) {
    case "ten":
      return game.i18n.localize("SW25.Item.Phasearea.Ten");
    case "chi":
      return game.i18n.localize("SW25.Item.Phasearea.Chi");
    case "jin":
      return game.i18n.localize("SW25.Item.Phasearea.Jin");
  }
  return "-";
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));

  // Prepare gamesystem settings.
  game.settings.register("sw25", "effectVitResPC", {
    name: game.i18n.localize("SETTING.effectVitResPC.name"),
    hint:
      game.i18n.localize("SETTING.effectVitResPC.hint") +
      game.i18n.localize("SETTING.effectVitResPC.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectVitResPC.default"),
    onChange: (value) => {
      effectVitResPC = value;
    },
  });
  effectVitResPC = game.settings.get("sw25", "effectVitResPC");
  game.settings.register("sw25", "effectMndResPC", {
    name: game.i18n.localize("SETTING.effectMndResPC.name"),
    hint:
      game.i18n.localize("SETTING.effectMndResPC.hint") +
      game.i18n.localize("SETTING.effectMndResPC.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectMndResPC.default"),
    onChange: (value) => {
      effectMndResPC = value;
    },
  });
  effectMndResPC = game.settings.get("sw25", "effectMndResPC");
  game.settings.register("sw25", "effectInitPC", {
    name: game.i18n.localize("SETTING.effectInitPC.name"),
    hint:
      game.i18n.localize("SETTING.effectInitPC.hint") +
      game.i18n.localize("SETTING.effectInitPC.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectInitPC.default"),
    onChange: (value) => {
      effectInitPC = value;
    },
  });
  effectInitPC = game.settings.get("sw25", "effectInitPC");
  game.settings.register("sw25", "effectMKnowPC", {
    name: game.i18n.localize("SETTING.effectMKnowPC.name"),
    hint:
      game.i18n.localize("SETTING.effectMKnowPC.hint") +
      game.i18n.localize("SETTING.effectMKnowPC.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectMKnowPC.default"),
    onChange: (value) => {
      effectMKnowPC = value;
    },
  });
  effectMKnowPC = game.settings.get("sw25", "effectMKnowPC");
  game.settings.register("sw25", "effectVitResMon", {
    name: game.i18n.localize("SETTING.effectVitResMon.name"),
    hint:
      game.i18n.localize("SETTING.effectVitResMon.hint") +
      game.i18n.localize("SETTING.effectVitResMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectVitResMon.default"),
    onChange: (value) => {
      effectVitResMon = value;
    },
  });
  effectVitResMon = game.settings.get("sw25", "effectVitResMon");
  game.settings.register("sw25", "effectMndResMon", {
    name: game.i18n.localize("SETTING.effectMndResMon.name"),
    hint:
      game.i18n.localize("SETTING.effectMndResMon.hint") +
      game.i18n.localize("SETTING.effectMndResMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectMndResMon.default"),
    onChange: (value) => {
      effectMndResMon = value;
    },
  });
  effectMndResMon = game.settings.get("sw25", "effectMndResMon");
  game.settings.register("sw25", "effectHitMon", {
    name: game.i18n.localize("SETTING.effectHitMon.name"),
    hint:
      game.i18n.localize("SETTING.effectHitMon.hint") +
      game.i18n.localize("SETTING.effectHitMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectHitMon.default"),
    onChange: (value) => {
      effectHitMon = value;
    },
  });
  effectHitMon = game.settings.get("sw25", "effectHitMon");
  game.settings.register("sw25", "effectDmgMon", {
    name: game.i18n.localize("SETTING.effectDmgMon.name"),
    hint:
      game.i18n.localize("SETTING.effectDmgMon.hint") +
      game.i18n.localize("SETTING.effectDmgMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectDmgMon.default"),
    onChange: (value) => {
      effectDmgMon = value;
    },
  });
  effectDmgMon = game.settings.get("sw25", "effectDmgMon");
  game.settings.register("sw25", "effectDodgeMon", {
    name: game.i18n.localize("SETTING.effectDodgeMon.name"),
    hint:
      game.i18n.localize("SETTING.effectDodgeMon.hint") +
      game.i18n.localize("SETTING.effectDodgeMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectDodgeMon.default"),
    onChange: (value) => {
      effectDodgeMon = value;
    },
  });
  effectDodgeMon = game.settings.get("sw25", "effectDodgeMon");
  game.settings.register("sw25", "effectScpMon", {
    name: game.i18n.localize("SETTING.effectScpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectScpMon.hint") +
      game.i18n.localize("SETTING.effectScpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectScpMon.default"),
    onChange: (value) => {
      effectScpMon = value;
    },
  });
  effectScpMon = game.settings.get("sw25", "effectScpMon");
  game.settings.register("sw25", "effectCnpMon", {
    name: game.i18n.localize("SETTING.effectCnpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectCnpMon.hint") +
      game.i18n.localize("SETTING.effectCnpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectCnpMon.default"),
    onChange: (value) => {
      effectCnpMon = value;
    },
  });
  effectCnpMon = game.settings.get("sw25", "effectCnpMon");
  game.settings.register("sw25", "effectWzpMon", {
    name: game.i18n.localize("SETTING.effectWzpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectWzpMon.hint") +
      game.i18n.localize("SETTING.effectWzpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectWzpMon.default"),
    onChange: (value) => {
      effectWzpMon = value;
    },
  });
  effectWzpMon = game.settings.get("sw25", "effectWzpMon");
  game.settings.register("sw25", "effectPrpMon", {
    name: game.i18n.localize("SETTING.effectPrpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectPrpMon.hint") +
      game.i18n.localize("SETTING.effectPrpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectPrpMon.default"),
    onChange: (value) => {
      effectPrpMon = value;
    },
  });
  effectPrpMon = game.settings.get("sw25", "effectPrpMon");
  game.settings.register("sw25", "effectMtpMon", {
    name: game.i18n.localize("SETTING.effectMtpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectMtpMon.hint") +
      game.i18n.localize("SETTING.effectMtpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectMtpMon.default"),
    onChange: (value) => {
      effectMtpMon = value;
    },
  });
  effectMtpMon = game.settings.get("sw25", "effectMtpMon");
  game.settings.register("sw25", "effectFrpMon", {
    name: game.i18n.localize("SETTING.effectFrpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectFrpMon.hint") +
      game.i18n.localize("SETTING.effectFrpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectFrpMon.default"),
    onChange: (value) => {
      effectFrpMon = value;
    },
  });
  effectFrpMon = game.settings.get("sw25", "effectFrpMon");
  game.settings.register("sw25", "effectDrpMon", {
    name: game.i18n.localize("SETTING.effectDrpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectDrpMon.hint") +
      game.i18n.localize("SETTING.effectDrpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectDrpMon.default"),
    onChange: (value) => {
      effectDrpMon = value;
    },
  });
  effectDrpMon = game.settings.get("sw25", "effectDrpMon");
  game.settings.register("sw25", "effectDmpMon", {
    name: game.i18n.localize("SETTING.effectDmpMon.name"),
    hint:
      game.i18n.localize("SETTING.effectDmpMon.hint") +
      game.i18n.localize("SETTING.effectDmpMon.default"),
    scope: "world",
    config: true,
    type: String,
    default: game.i18n.localize("SETTING.effectDmpMon.default"),
    onChange: (value) => {
      effectDmpMon = value;
    },
  });
  effectDmpMon = game.settings.get("sw25", "effectDmpMon");
  game.settings.register("sw25", "fromCompendium", {
    name: game.i18n.localize("SETTING.fromCompendium.name"),
    hint: game.i18n.localize("SETTING.fromCompendium.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  });

  // Chat message button
  Hooks.on("renderChatMessage", (chatMessage, html, data) => {
    html.find(".buttonclick").click(function () {
      const button = $(this);
      const buttonType = button.data("buttontype");
      chatButton(chatMessage, buttonType);
    });
  });
  // Add listener to past message
  $(".chat-message .buttonclick").each((index, element) => {
    const messageId = $(element).closest(".message").attr("data-message-id");
    $(element).on("click", (event) => {
      const chatMessage = game.messages.get(messageId);
      const button = $(event.currentTarget);
      const buttonType = button.data("buttontype");
      chatButton(chatMessage, buttonType);
    });
  });

  // Prepare reference data from journal or compendium
  const entryName = "Reference Data";

  async function findEntryInCompendium(entryName) {
    const packs = game.packs
      .filter((p) => p.documentClass.documentName === "JournalEntry")
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

  let entry = game.journal.getName(entryName);
  if (!entry) {
    entry = await findEntryInCompendium(entryName);
  }
  if (!entry) return;

  // Find power table journal
  const ptPageTitle = "Reference Power Table";
  let ptPage = entry.pages.contents.find((p) => p.name === ptPageTitle);
  if (!ptPage) {
    entry = await findEntryInCompendium(entryName);
    if (entry) {
      ptPage = entry.pages.contents.find((p) => p.name === ptPageTitle);
    }
  }
  if (!ptPage) return;

  // Prepare reference power table
  const ptParser = new DOMParser();
  const ptHtmlString = ptPage.text.content;
  const ptDoc = ptParser.parseFromString(ptHtmlString, "text/html");

  const ptDivs = ptDoc.querySelectorAll("div.pt-item");
  let power = "";

  ptDivs.forEach((div, index) => {
    const ptText = div.querySelector("p").textContent;
    const ptValue = Number(ptText);

    if (index % 11 === 0) {
      power = ptText;
      rpt[power] = [];
    } else {
      rpt[power].push(ptValue);
    }
  });

  // Token apply hook
  game.socket.on("system.sw25", (data) => {
    if (!game.user.isGM) return;

    // Apply roll
    if (data.method == "applyRoll") {
      const targetToken = canvas.tokens.get(data.targetToken);
      const target = targetToken.actor;
      if (!target) return;
      target.update({
        "system.hp.value": data.resultHP,
        "system.mp.value": data.resultMP,
      });
    }

    // Apply MP cost
    if (data.method == "applyMp") {
      const targetToken = canvas.tokens.get(data.targetToken);
      const target = targetToken.actor;
      if (!target) return;
      target.update({
        "system.mp.value": data.resultMP,
      });
    }

    // Apply effect
    if (data.method == "applyEffect") {
      const targetTokens = data.targetTokens.map((tokenId) =>
        canvas.tokens.get(tokenId)
      );
      const target = targetTokens.map((token) => token.actor);
      const targetEffects = data.targetEffects;
      const orgActor = data.orgActor;
      target.forEach((targetActor) => {
        targetEffects.forEach((effect) => {
          const transferEffect = duplicate(effect);
          transferEffect.disabled = false;
          transferEffect.sourceName = orgActor;
          transferEffect.flags.sourceName = orgActor;
          transferEffect.flags.sourceId = `Actor.${data.orgId}`;
          targetActor.createEmbeddedDocuments("ActiveEffect", [transferEffect]);
        });
      });
    }
  });

  // preCreateActor hook
  Hooks.on("preCreateActor", (actor, options, userId) => {
    // Set default token
    let displayName = 0;
    let actorLink = false;
    let appendNumber = false;
    let prependAdjective = false;
    let disposition = 0;
    let displayBars = 0;
    switch (actor.type) {
      case "character":
        displayName = 50;
        actorLink = true;
        appendNumber = false;
        prependAdjective = false;
        disposition = 1;
        displayBars = 50;
        break;
      case "npc":
        displayName = 30;
        actorLink = true;
        appendNumber = false;
        prependAdjective = false;
        disposition = 0;
        displayBars = 0;
        break;
      case "monster":
        displayName = 30;
        actorLink = false;
        appendNumber = true;
        prependAdjective = true;
        disposition = -1;
        displayBars = 40;
        break;
      default:
        displayName = 0;
        actorLink = false;
        appendNumber = false;
        prependAdjective = false;
        disposition = 0;
        displayBars = 0;
    }

    // Update actor
    actor.updateSource({
      "prototypeToken.displayName": displayName,
      "prototypeToken.actorLink": actorLink,
      "prototypeToken.appendNumber": appendNumber,
      "prototypeToken.prependAdjective": prependAdjective,
      "prototypeToken.disposition": disposition,
      "prototypeToken.displayBars": displayBars,
    });
  });

  // createActor hook
  Hooks.on("createActor", async (actor, options, userId) => {
    // Default item data
    let itemData = [];
    let resvit = false;
    let resmnd = false;
    let init = false;
    let mknow = false;
    let monres = false;
    let monwp = false;
    if (actor.type == "character") {
      actor.items.forEach((item) => {
        if (item.name == game.i18n.localize("SW25.Config.ResVit"))
          resvit = true;
        if (item.name == game.i18n.localize("SW25.Config.ResMnd"))
          resmnd = true;
        if (item.name == game.i18n.localize("SW25.Config.Init")) init = true;
        if (item.name == game.i18n.localize("SW25.Config.MKnow")) mknow = true;
      });
      if (!resvit) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.ResVit"),
          type: "check",
          system: {
            description: "",
            checkskill: "adv",
            checkabi: "vit",
            showbtcheck: true,
          },
        });
      }
      if (!resmnd) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.ResMnd"),
          type: "check",
          system: {
            description: "",
            checkskill: "adv",
            checkabi: "mnd",
            showbtcheck: true,
          },
        });
      }
      if (!init) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.Init"),
          type: "check",
          system: {
            description: "",
            checkskill: "-",
            checkabi: "-",
            showbtcheck: true,
          },
        });
      }
      if (!mknow) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.MKnow"),
          type: "check",
          system: {
            description: "",
            checkskill: "-",
            checkabi: "-",
            showbtcheck: true,
          },
        });
      }
    }
    if (actor.type == "monster") {
      actor.items.forEach((item) => {
        if (item.name == game.i18n.localize("SW25.Config.MonRes"))
          monres = true;
        if (
          item.system.label1 == game.i18n.localize("SW25.Config.MonHit") &&
          item.system.label2 == game.i18n.localize("SW25.Config.MonDmg") &&
          item.system.label3 == game.i18n.localize("SW25.Config.MonDge")
        )
          monwp = true;
      });
      if (!monres) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.MonRes"),
          type: "monsterability",
          system: {
            description: "",
            usedice1: true,
            label1: game.i18n.localize("SW25.Config.MonResVit"),
            usefix1: true,
            applycheck1: "-",
            usedice2: true,
            label2: game.i18n.localize("SW25.Config.MonResMnd"),
            usefix2: true,
            applycheck2: "-",
          },
        });
      }
      if (!monwp) {
        itemData.push({
          name: game.i18n.localize("SW25.Config.MonWp"),
          type: "monsterability",
          system: {
            description: "",
            usedice1: true,
            label1: game.i18n.localize("SW25.Config.MonHit"),
            usefix1: true,
            applycheck1: "-",
            usedice2: true,
            label2: game.i18n.localize("SW25.Config.MonDmg"),
            usefix2: false,
            applycheck2: "on",
            usedice3: true,
            label3: game.i18n.localize("SW25.Config.MonDge"),
            usefix3: true,
            applycheck3: "-",
          },
        });
      }
    }

    // Set default item
    let item = await Item.create(itemData, { parent: actor });
  });

  // Custom chat command
  let customCommandModule = "_chatcommands";
  let chatcommands =
    game.modules.has(customCommandModule) &&
    game.modules.get(customCommandModule).active;
  if (chatcommands) {
    console.log("Enable custom chat commands");
    game.chatCommands.register({
      name: "/powerroll",
      aliases: [
        "/powroll",
        "/powr",
        "/rollpower",
        "/rollpow",
        "/rpow",
        "/rp",
        "/pow",
      ],
      module: "_chatcommands",
      description: "Roll power table.",
      icon: "<i class='fas fa-dice-d6'></i>",
      callback: async (chat, parameters, messageData) => {
        let command = "/powerroll";
        await customCommand(command, messageData, parameters);
        return;
      },
    });
  } else {
    console.log("Disable custom chat commands");
  }

  // Item update hook
  Hooks.on("updateItem", async (item, updateData, options, userId) => {
    // Linking equip and effect
    if (updateData.system && updateData.system.hasOwnProperty("equip")) {
      for (let activeEffect of item.effects) {
        if (updateData.system.equip) {
          if (activeEffect.disabled) {
            await activeEffect.update({ disabled: false });
          }
        } else {
          if (!activeEffect.disabled) {
            await activeEffect.update({ disabled: true });
          }
        }
      }
    }
  });

  // Load language from Compendium for Polyglot
  let polyglotmodule = "polyglot";
  let polyglot =
    game.modules.has(polyglotmodule) && game.modules.get(polyglotmodule).active;
  if (polyglot) {
    let fromCompendium = game.settings.get("sw25", "fromCompendium");
    if (fromCompendium) {
      await game.polyglot.languageProvider.getLanguages(fromCompendium);
    }
  }
});

// SceneControl Hook
Hooks.on("getSceneControlButtons", function (controls) {
  controls[0].tools.push({
    name: "rollRequest(Skill)",
    title: game.i18n.localize("SETTING.rollRequest"),
    icon: "fas fa-dice-d6",
    visible: game.user.isGM,
    onClick: () => {
      rollreq();
    },
    button: true,
  });
});

// Polyglot support
Hooks.once("polyglot.init", (LanguageProvider) => {
  const SW25LanguageProvider = preparePolyglot(LanguageProvider);
  game.polyglot.api.registerSystem(SW25LanguageProvider);
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes("Actor.") && !data.uuid.includes("Token.")) {
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.sw25.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "sw25.itemMacro": true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: "Item",
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
