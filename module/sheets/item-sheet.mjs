import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { SW25 } from "../helpers/config.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SW25ItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sw25", "sheet", "item"],
      width: 620,
      height: 480,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = "systems/sw25/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.data;

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    context.config = CONFIG.SW25;


    context.applyOptions = {
      "-": "SW25.Item.Noapply",
      on: "SW25.Item.applyon",
      custom: "SW25.Item.Custom"
    };

    if (itemData.type == "skill") {
      this._prepareSkillData(context);
    }

    if (itemData.type == "check") {
      this._prepareCheckData(context);
      context.checkmethodOptions = {
        normal: "SW25.Item.Check.Normalcheck",
        dice: "SW25.Item.Check.Customroll",
        power: "SW25.Item.Check.Powerroll"
      };
    }

    if (itemData.type == "weapon") {
      this._prepareItemRollData(context);
      this._prepareWeaponData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        rescost: "SW25.Item.Resourcecost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "armor") {
      this._prepareItemRollData(context);
      this._prepareArmorData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "accessory") {
      this._prepareItemRollData(context);
      this._prepareAccessoryData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "item") {
      this._prepareItemRollData(context);
      this._prepareItemData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "resource") {
      this._prepareItemRollData(context);
      this._prepareResourceData(context);
    }

    if (itemData.type == "combatability") {
      this._prepareItemRollData(context);
      this._prepareCombatabilityData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "enhancearts") {
      this._prepareItemRollData(context);
      this._prepareEnhanceartsData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        mpcost: "SW25.Item.Mpcost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "magicalsong") {
      this._prepareItemRollData(context);
      this._prepareMagicalsongData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "ridingtrick") {
      this._prepareItemRollData(context);
      this._prepareRidingtrickData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "alchemytech") {
      this._prepareItemRollData(context);
      this._prepareAlchemytechData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }

      context.resistOptions = {
        decide: "SW25.Item.Decide",
        any: "SW25.Item.Any",
        disappear: "SW25.Item.Disappear",
        shortening: "SW25.Item.Shortening"
      }
    }

    if (itemData.type == "phasearea") {
      this._prepareItemRollData(context);
      this._preparePhaseareaData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "tactics") {
      this._prepareItemRollData(context);
      this._prepareTacticsData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "infusion") {
      this._prepareItemRollData(context);
      this._prepareInfusionData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "barbarousskill") {
      this._prepareItemRollData(context);
      this._prepareBarbarousskillData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        mpcost: "SW25.Item.Mpcost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "essenceweave") {
      this._prepareItemRollData(context);
      this._prepareEssenceweaveData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        hpcost: "SW25.Item.Hpcost",
        description: "SW25.Item.Onlydescription"
      }

      context.resistOptions = {
        decide: "SW25.Item.Decide",
        any: "SW25.Item.Any",
        none: "SW25.Item.None",
        disappear: "SW25.Item.Disappear",
        halving: "SW25.Item.Halving"
      }
    }

    if (itemData.type == "otherfeature") {
      this._prepareItemRollData(context);
      this._prepareOtherFeatureData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        mpcost: "SW25.Item.Mpcost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "raceability") {
      this._prepareItemRollData(context);
      this._prepareRaceabilityData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "language") {
      this._prepareItemRollData(context);
      this._prepareLanguageData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "spell") {
      this._prepareItemRollData(context);
      this._prepareSpellData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Powerroll",
        dice: "SW25.Item.Diceroll",
        mpcost: "SW25.Item.Mpcost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "monsterability") {
      this._prepareItemRollData(context);
      this._prepareMonsterabilityData(context);
      context.applyOptions = {
        "-": "SW25.Item.Noapply",
        on: "SW25.Item.applyon"
      }
    }

    if (itemData.type == "action") {
      this._prepareItemRollData(context);
      this._prepareActionData(context);
      context.clickitemOptions = {
        all: "SW25.Item.All",
        power: "SW25.Item.Power",
        dice2: "SW25.Check",
        dice1: "SW25.Item.Action.ActionValue",
        mpcost: "SW25.Item.Mpcost",
        description: "SW25.Item.Onlydescription"
      }
    }

    if (itemData.type == "session") {
      this._prepareItemRollData(context);
      this._prepareSessionData(context);
    }

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = this.item.getRollData();

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  _prepareSkillData(context) {}
  _prepareCheckData(context) {}
  _prepareItemRollData(context) {}
  _prepareWeaponData(context) {}
  _prepareArmorData(context) {}
  _prepareAccessoryData(context) {}
  _prepareItemData(context) {}
  _prepareResourceData(context) {}
  _prepareCombatabilityData(context) {}
  _prepareEnhanceartsData(context) {}
  _prepareMagicalsongData(context) {}
  _prepareRidingtrickData(context) {}
  _prepareAlchemytechData(context) {}
  _preparePhaseareaData(context) {}
  _prepareTacticsData(context) {}
  _prepareInfusionData(context) {}
  _prepareBarbarousskillData(context) {}
  _prepareEssenceweaveData(context) {}
  _prepareOtherFeatureData(context) {}
  _prepareRaceabilityData(context) {}
  _prepareLanguageData(context) {}
  _prepareSpellData(context) {}
  _prepareMonsterabilityData(context) {}
  _prepareActionData(context) {}
  _prepareSessionData(context) {}

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on("click", ".effect-control", (ev) =>
      onManageActiveEffect(ev, this.item)
    );

    // Session Result.
    html.on("click", ".session-result", this._onSessionResult.bind(this));

    // Add Field.
    html.find(".add-field").click((ev) => {
      ev.preventDefault();
      const fields = duplicate(this.item.system.customFields || []);
      fields.push({ label: "", value: "" });
      this.item.update({ "system.customFields": fields });
    });

    // Delete Field.
    html.find(".remove-field").click((ev) => {
      ev.preventDefault();
      const idx = Number(ev.currentTarget.dataset.idx);
      //const fields = duplicate(this.item.system.customFields || []);
      let fieldsRaw = this.item.system.customFields;
      let fields = Array.isArray(fieldsRaw)
        ? duplicate(fieldsRaw)
        : Object.values(duplicate(fieldsRaw));
      fields.splice(idx, 1);
      this.item.update({ "system.customFields": fields });
    });

    // Move up.
    html.find(".move-up").click((ev) => {
      ev.preventDefault();
      const idx = Number(ev.currentTarget.dataset.idx);
      let fieldsRaw = this.item.system.customFields;
      let fields = Array.isArray(fieldsRaw)
        ? duplicate(fieldsRaw)
        : Object.values(duplicate(fieldsRaw));
      if (idx > 0) {
        [fields[idx - 1], fields[idx]] = [fields[idx], fields[idx - 1]];
        this.item.update({ "system.customFields": fields });
      }
    });

    // Move down.
    html.find(".move-down").click((ev) => {
      ev.preventDefault();
      const idx = Number(ev.currentTarget.dataset.idx);
      let fieldsRaw = this.item.system.customFields;
      let fields = Array.isArray(fieldsRaw)
        ? duplicate(fieldsRaw)
        : Object.values(duplicate(fieldsRaw));
      if (idx < fields.length - 1) {
        [fields[idx], fields[idx + 1]] = [fields[idx + 1], fields[idx]];
        this.item.update({ "system.customFields": fields });
      }
    });
  }

  async _onSessionResult(event) {
    event.preventDefault();

    const item = this.item;
    let chatData = null;
    let roll = null;
    let formula = null;
    let tooltip = null;
    let total = null;
    let isRoll = false;

    const label = game.i18n.localize("SW25.Item.Session.Result.Label");

    const title = item.name;
    const pcNum = Number(item.system.session.pcnum);

    const gamel =
      Number(item.system.session.mission.gamel) +
      Number(item.system.session.middle.gamel);
    const keepGamel = gamel % pcNum;
    const getGamel = Math.floor((gamel - keepGamel) / pcNum);

    let getExp =
      Number(item.system.session.mission.exp) +
      Number(item.system.session.middle.exp);

    const abyss = Number(item.system.session.middle.abyss);
    const keepAbyss = abyss % pcNum;
    const getAbyss = Math.floor((abyss - keepAbyss) / pcNum);
    const getTresure = Number(item.system.session.middle.tresure);

    const getSword = Number(item.system.session.middle.sword);

    let getHonor = Number(item.system.session.mission.honor);

    // basic info.
    const isBasic = item.system.result.character;
    const date = item.system.session.date;
    const gm = item.system.session.gamemaster;
    const player = item.system.session.player;

    // character result.
    let characterNames = item.system.result.character
      ? canvas.tokens.placeables
          .filter((token) => token.actor?.type === "character")
          .map((token) => token.name)
      : [];

    let isCharaExp = false;
    let charaResult = [];
    if (0 < characterNames.length) {
      isCharaExp = true;
      for (let name of characterNames) {
        const targetActor = game.actors.find((a) => a.name === name);
        if (targetActor) {
          const oneRollValue = targetActor.system.attributes.fumble ?? 0;
          charaResult.push({name: name, value: oneRollValue});
        }
      }
    }

    // custom items.
    const fieldsRaw = item.system.customFields;
    const customItems = Object.values(fieldsRaw);
    const isCustom = item.system.result.custom && customItems;

    // sword shard result.
    if (item.system.result.sword && 0 < getSword) {
      isRoll = true;
      formula = getSword + "d6";
      roll = new Roll(formula);
      await roll.evaluate({ async: true });
      tooltip = await roll.getTooltip();
      total= roll.total;

      getHonor += Number(roll.total);
      chatData = {
        speaker: ChatMessage.getSpeaker(),
        flavor: label,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls: [roll],
      };
    } else {
      chatData = {
        speaker: ChatMessage.getSpeaker(),
        flavor: label,
      };
    }
    const isGamel = (0 < getGamel || 0 < keepGamel);
    const isHonor = (0 < getHonor || 0 < getSword);
    const isAbyss = (0 < getAbyss || 0 < keepAbyss);

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/session-info.hbs",
      {
        title: title,
        isGamel: isGamel,
        getGamel: getGamel,
        keepGamel: keepGamel,
        getExp: getExp,
        isHonor: isHonor,
        getHonor: getHonor,
        getSword: getSword,
        isAbyss: isAbyss,
        getAbyss: getAbyss,
        keepAbyss: keepAbyss,
        getTresure: getTresure,
        isBasic: isBasic,
        date: date,
        gm: gm,
        player: player,
        isCharaExp: isCharaExp,
        charaResult: charaResult,
        isCustom: isCustom,
        customItems: customItems,
        isRoll: isRoll,
        formula: formula,
        tooltip: tooltip,
        total: total,
      }
    );

    ChatMessage.create(chatData);
  }
}
