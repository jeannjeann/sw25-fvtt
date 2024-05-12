import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";

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

    if (itemData.type == "skill") {
      this._prepareSkillData(context);
    }

    if (itemData.type == "check") {
      this._prepareCheckData(context);
    }

    if (itemData.type == "weapon") {
      this._prepareItemRollData(context);
      this._prepareWeaponData(context);
    }

    if (itemData.type == "armor") {
      this._prepareItemRollData(context);
      this._prepareArmorData(context);
    }

    if (itemData.type == "accessory") {
      this._prepareItemRollData(context);
      this._prepareAccessoryData(context);
    }

    if (itemData.type == "item") {
      this._prepareItemRollData(context);
      this._prepareItemData(context);
    }

    if (itemData.type == "resource") {
      this._prepareItemRollData(context);
      this._prepareResourceData(context);
    }

    if (itemData.type == "combatability") {
      this._prepareItemRollData(context);
      this._prepareCombatabilityData(context);
    }

    if (itemData.type == "enhancearts") {
      this._prepareItemRollData(context);
      this._prepareEnhanceartsData(context);
    }

    if (itemData.type == "magicalsong") {
      this._prepareItemRollData(context);
      this._prepareMagicalsongData(context);
    }

    if (itemData.type == "ridingtrick") {
      this._prepareItemRollData(context);
      this._prepareRidingtrickData(context);
    }

    if (itemData.type == "alchemytech") {
      this._prepareItemRollData(context);
      this._prepareAlchemytechData(context);
    }

    if (itemData.type == "phasearea") {
      this._prepareItemRollData(context);
      this._preparePhaseareaData(context);
    }

    if (itemData.type == "tactics") {
      this._prepareItemRollData(context);
      this._prepareTacticsData(context);
    }

    if (itemData.type == "raceability") {
      this._prepareItemRollData(context);
      this._prepareRaceabilityData(context);
    }

    if (itemData.type == "language") {
      this._prepareItemRollData(context);
      this._prepareLanguageData(context);
    }

    if (itemData.type == "spell") {
      this._prepareItemRollData(context);
      this._prepareSpellData(context);
    }

    if (itemData.type == "monsterability") {
      this._prepareItemRollData(context);
      this._prepareMonsterabilityData(context);
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
  _prepareRaceabilityData(context) {}
  _prepareLanguageData(context) {}
  _prepareSpellData(context) {}
  _prepareMonsterabilityData(context) {}

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
  }
}
