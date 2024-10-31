import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { powerRoll } from "../helpers/powerroll.mjs";
import { mpCost } from "../helpers/mpcost.mjs";
import { lootRoll } from "../helpers/lootroll.mjs";
import { growthCheck } from "../helpers/growthcheck.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SW25ActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sw25", "sheet", "actor"],
      width: 700,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "abilityskill",
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/sw25/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == "character") {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == "npc") {
      this._prepareItems(context);
      this._prepareNpcData(context);
    }

    // Prepare Monster data and items.
    if (actorData.type == "monster") {
      this._prepareItems(context);
      this._prepareMonsterData(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(CONFIG.SW25.abilities[k]) ?? k;
    }
  }

  _prepareNpcData(context) {}

  _prepareMonsterData(context) {}

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const skills = [];
    const checks = [];
    const battlechecks = [];
    const resources = [];
    const weapons = [];
    const battleweapons = [];
    const armors = [];
    const battlearmors = [];
    const accessories = [];
    const battleaccessories = [];
    const gear = [];
    const combatabilities = [];
    const enhancearts = [];
    const magicalsongs = [];
    const ridingtricks = [];
    const alchemytechs = [];
    const phaseareas = [];
    const tactics = [];
    const otherfeature = [];
    const raceabilities = [];
    const languages = [];
    const spells = [];
    const sorcerer = [];
    const conjurer = [];
    const wizard = [];
    const priest = [];
    const magitech = [];
    const fairy = [];
    const druid = [];
    const daemon = [];
    const monsterabilities = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to skill.
      if (i.type === "skill") {
        skills.push(i);
      }
      // Append to check & battlecheck.
      if (i.type === "check") {
        checks.push(i);
        if (i.system.showbtcheck === true) {
          battlechecks.push(i);
        }
      }
      // Append to resource.
      if (i.type === "resource") {
        resources.push(i);
      }
      // Append to weapon.
      else if (i.type === "weapon") {
        weapons.push(i);
        if (i.system.equip === true) {
          battleweapons.push(i);
        }
      }
      // Append to armor.
      else if (i.type === "armor") {
        armors.push(i);
        if (i.system.equip === true) {
          battlearmors.push(i);
        }
      }
      // Append to accessory.
      else if (i.type === "accessory") {
        accessories.push(i);
        if (i.system.equip === true) {
          battleaccessories.push(i);
        }
      }
      // Append to gear.
      else if (i.type === "item") {
        gear.push(i);
      }

      // Append to combatability.
      else if (i.type === "combatability") {
        combatabilities.push(i);
      }

      // Append to enhancearts.
      else if (i.type === "enhancearts") {
        enhancearts.push(i);
      }

      // Append to magicalsong.
      else if (i.type === "magicalsong") {
        magicalsongs.push(i);
      }

      // Append to ridingtrick.
      else if (i.type === "ridingtrick") {
        ridingtricks.push(i);
      }

      // Append to alchemytech.
      else if (i.type === "alchemytech") {
        alchemytechs.push(i);
      }

      // Append to phasearea.
      else if (i.type === "phasearea") {
        phaseareas.push(i);
      }

      // Append to tactics.
      else if (i.type === "tactics") {
        tactics.push(i);
      }

      // Append to otherfeeature.
      else if (i.type === "otherfeature") {
        otherfeature.push(i);
      }

      // Append to raceability.
      else if (i.type === "raceability") {
        raceabilities.push(i);
      }

      // Append to languages.
      else if (i.type === "language") {
        languages.push(i);
      }

      // Append to spells.
      else if (i.type === "spell") {
        spells.push(i);
        if (i.system.type === "sorcerer") {
          sorcerer.push(i);
        }
        if (i.system.type === "conjurer") {
          conjurer.push(i);
        }
        if (i.system.type === "wizard") {
          wizard.push(i);
        }
        if (i.system.type === "priest") {
          priest.push(i);
        }
        if (i.system.type === "magitech") {
          magitech.push(i);
        }
        if (i.system.type === "fairy") {
          fairy.push(i);
        }
        if (i.system.type === "druid") {
          druid.push(i);
        }
        if (i.system.type === "daemon") {
          daemon.push(i);
        }
      }

      // Append to monsterability.
      else if (i.type === "monsterability") {
        monsterabilities.push(i);
      }
    }

    let eashow = true;
    if (enhancearts.length == 0) {
      eashow = false;
    } else eashow = true;

    let msshow = true;
    if (magicalsongs.length == 0) {
      msshow = false;
    } else msshow = true;

    let rtshow = true;
    if (ridingtricks.length == 0) {
      rtshow = false;
    } else rtshow = true;

    let atshow = true;
    if (alchemytechs.length == 0) {
      atshow = false;
    } else atshow = true;

    let pashow = true;
    if (phaseareas.length == 0) {
      pashow = false;
    } else pashow = true;

    let tcshow = true;
    if (tactics.length == 0) {
      tcshow = false;
    } else tcshow = true;

    let ofshow = true;
    if (otherfeature.length == 0) {
      ofshow = false;
    } else ofshow = true;

    let scshow = true;
    if (sorcerer.length == 0) {
      scshow = false;
    } else scshow = true;

    let cnshow = true;
    if (conjurer.length == 0) {
      cnshow = false;
    } else cnshow = true;

    let wzshow = true;
    if (wizard.length == 0) {
      wzshow = false;
    } else wzshow = true;

    let prshow = true;
    if (priest.length == 0) {
      prshow = false;
    } else prshow = true;

    let mtshow = true;
    if (magitech.length == 0) {
      mtshow = false;
    } else mtshow = true;

    let frshow = true;
    if (fairy.length == 0) {
      frshow = false;
    } else frshow = true;

    let drshow = true;
    if (druid.length == 0) {
      drshow = false;
    } else drshow = true;

    let dmshow = true;
    if (daemon.length == 0) {
      dmshow = false;
    } else dmshow = true;

    // Assign and return
    context.skills = skills;
    context.checks = checks;
    context.battlechecks = battlechecks;
    context.resources = resources;
    context.weapons = weapons;
    context.battleweapons = battleweapons;
    context.armors = armors;
    context.battlearmors = battlearmors;
    context.accessories = accessories;
    context.battleaccessories = battleaccessories;
    context.gear = gear;
    context.combatabilities = combatabilities;
    context.enhancearts = enhancearts;
    context.eashow = eashow;
    context.magicalsongs = magicalsongs;
    context.msshow = msshow;
    context.ridingtricks = ridingtricks;
    context.rtshow = rtshow;
    context.alchemytechs = alchemytechs;
    context.atshow = atshow;
    context.phaseareas = phaseareas;
    context.pashow = pashow;
    context.tactics = tactics;
    context.tcshow = tcshow;
    context.otherfeature = otherfeature;
    context.ofshow = ofshow;
    context.raceabilities = raceabilities;
    context.languages = languages;
    context.spells = spells;
    context.sorcerer = sorcerer;
    context.scshow = scshow;
    context.conjurer = conjurer;
    context.cnshow = cnshow;
    context.wizard = wizard;
    context.wzshow = wzshow;
    context.priest = priest;
    context.prshow = prshow;
    context.magitech = magitech;
    context.mtshow = mtshow;
    context.fairy = fairy;
    context.frshow = frshow;
    context.druid = druid;
    context.drshow = drshow;
    context.daemon = daemon;
    context.dmshow = dmshow;
    context.monsterabilities = monsterabilities;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on("click", ".item-edit", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on("click", ".item-create", this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on("click", ".item-delete", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on("click", ".effect-control", (ev) => {
      const row = ev.currentTarget.closest("li");
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on("click", ".rollable", this._onRoll.bind(this));

    // Rollable abilities for Power Roll.
    html.on("click", ".powerrollable", this._onPowerRoll.bind(this));

    // Apply effect.
    html.on("click", ".applyeffect", this._onApplyEffect.bind(this));

    // Mp cost.
    html.on("click", ".mpcost", this._onMpCost.bind(this));

    // Loot roll.
    html.on("click", ".lootrollable", this._onLootRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find("li.item").each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

    // Open item details
    html.find(".item-label").click(this._showItemDetails.bind(this));
    html.find(".spell-label").click(this._showSpellList.bind(this));

    // Change Input Area
    html.on("change", ".qt-change", this._changeQuantity.bind(this));
    html.on("change", ".sl-change", this._changeSkillLevel.bind(this));
    html.on("change", ".sc-change", this._changeSkillMod.bind(this));
    html.on("change", ".cm-change", this._changeCheckMod.bind(this));
    html.on("change", ".cm1-change", this._changeCheckMod1.bind(this));
    html.on("change", ".cm2-change", this._changeCheckMod2.bind(this));
    html.on("change", ".cm3-change", this._changeCheckMod3.bind(this));
    html.on("change", ".pm-change", this._changePowerMod.bind(this));
    html.on("change", ".eq-change", this._changeEquip.bind(this));
    html.on("change", ".rd-change", this._changeReading.bind(this));
    html.on("change", ".cv-change", this._changeConversation.bind(this));

    // Change Button
    html.find(".adjustment-button").click(this._onAdjustmentButton.bind(this));
    html.find(".quantity-button").click(this._onQuantityButton.bind(this));
    html.find(".changesl-button").click(this._onSkilllevelButton.bind(this));
    html.find(".checkmod-button").click(this._onCheckmodButton.bind(this));
    html.find(".roll-ability-check").click(this._onGrowthCheck.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == "item") {
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      const rollData = this.actor.getRollData();
      const checktype = dataset.checktype ? dataset.checktype.split(",") : "";

      let roll = new Roll(dataset.roll, rollData);
      await roll.evaluate();

      let label = dataset.label ? `${dataset.label}` : "";

      let chatData = {
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get("core", "rollMode"),
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls: [roll],
      };

      let chatCritical = null;
      let chatFumble = null;
      if (roll.terms[0].total == 12) chatCritical = 1;
      if (roll.terms[0].total == 2) chatFumble = 1;

      let chatapply = dataset.apply;
      let chatspell = dataset.spell;
      chatData.flags = {
        total: roll.total,
        orgtotal: roll.total,
        formula: roll.formula,
        rolls: roll,
        tooltip: await roll.getTooltip(),
        apply: chatapply,
        spell: chatspell,
        checktype: checktype,
      };

      chatData.content = await renderTemplate(
        "systems/sw25/templates/roll/roll-check.hbs",
        {
          formula: roll.formula,
          tooltip: await roll.getTooltip(),
          critical: chatCritical,
          fumble: chatFumble,
          total: roll.total,
          apply: chatapply,
          spell: chatspell,
          checktype: checktype,
        }
      );

      ChatMessage.create(chatData);

      return roll;
    }
  }

  /**
   * Handle clickable power rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onPowerRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    const formula = dataset.roll;
    const powertype = dataset.powertype ? dataset.powertype.split(",") : "";
    const powertable = dataset.pt.split(",");
    //const powertable = dataset.pt.split(",").map(Number);

    let roll = await powerRoll(formula, powertable);

    const chatLabel = `${dataset.label}`;
    let cValueFormula = "@" + roll.cValue;
    let halfFormula = "";
    let lethalTechFormula = "";
    let criticalRayFormula = "";
    let pharmToolFormula = "";
    let powupFormula = "";
    if (roll.cValue == 100) cValueFormula = "@13";
    if (roll.halfPow == 1) halfFormula = "h+" + roll.halfPowMod;
    else if (roll.halfPowMod && roll.halfPowMod != 0)
      halfFormula = "+" + roll.halfPowMod;
    if (roll.lethalTech != 0) lethalTechFormula = "#" + roll.lethalTech;
    if (roll.criticalRay > 0) criticalRayFormula = "$+" + roll.criticalRay;
    else if (roll.criticalRay != 0) criticalRayFormula = "$" + roll.criticalRay;
    if (roll.pharmTool != 0) pharmToolFormula = "tf" + roll.pharmTool;
    if (roll.powup != 0) powupFormula = "r" + roll.powup;

    let chatFormula =
      "k" +
      roll.power +
      cValueFormula +
      "+" +
      roll.powMod +
      lethalTechFormula +
      criticalRayFormula +
      pharmToolFormula +
      powupFormula +
      halfFormula;

    let chatPower = roll.power;
    let chatLethalTech = null;
    let chatCriticalRay = null;
    let chatPharmTool = null;
    let chatPowup = null;
    let chatResult = roll.eachPowerResult;
    let chatMod = roll.powMod;
    let chatModTotal = roll.powMod;
    if (roll.halfPow == 0 && roll.halfPowMod && roll.halfPowMod != 0)
      chatModTotal += roll.halfPowMod;
    let chatHalf = null;
    let chatResults = roll.rawPowerResult;
    let chatTotal = roll.powerResult;
    let chatExtraRoll = null;
    let chatFumble = null;
    if (roll.halfPow == 1) chatHalf = roll.halfPowMod;
    if (roll.lethalTech != 0) chatLethalTech = roll.lethalTech;
    if (roll.criticalRay != 0) chatCriticalRay = roll.criticalRay;
    if (roll.pharmTool != 0) chatPharmTool = roll.pharmTool;
    if (roll.powup != 0) chatPowup = roll.powup;
    if (roll.rollCount > 0) chatExtraRoll = roll.rollCount;
    if (roll.fumble == 1) chatFumble = roll.fumble;

    let chatData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: chatLabel,
      rollMode: game.settings.get("core", "rollMode"),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll.fakeResult],
    };

    let showhalf = true;
    let shownoc = true;
    if (roll.halfPow == 1) {
      showhalf = false;
      shownoc = false;
    }
    if (roll.cValue == 100 || chatExtraRoll == null) shownoc = false;
    let chatapply = dataset.apply;

    chatData.flags = {
      formula: chatFormula,
      tooltip: await roll.fakeResult.getTooltip(),
      power: chatPower,
      lethalTech: chatLethalTech,
      criticalRay: chatCriticalRay,
      pharmTool: chatPharmTool,
      powup: chatPowup,
      result: chatResult,
      mod: chatMod,
      modTotal: chatModTotal,
      half: chatHalf,
      results: chatResults,
      total: chatTotal,
      extraRoll: chatExtraRoll,
      fumble: chatFumble,
      orghalf: roll.halfPowMod,
      orgtotal: chatTotal,
      orgextraRoll: chatExtraRoll,
      showhalf: showhalf,
      shownoc: shownoc,
      apply: chatapply,
      powertype: powertype,
    };

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/roll-power.hbs",
      {
        formula: chatFormula,
        tooltip: await roll.fakeResult.getTooltip(),
        power: chatPower,
        lethalTech: chatLethalTech,
        criticalRay: chatCriticalRay,
        pharmTool: chatPharmTool,
        powup: chatPowup,
        result: chatResult,
        mod: chatModTotal,
        half: chatHalf,
        results: chatResults,
        total: chatTotal,
        extraRoll: chatExtraRoll,
        fumble: chatFumble,
        showhalf: showhalf,
        shownoc: shownoc,
        apply: chatapply,
        powertype: powertype,
      }
    );

    ChatMessage.create(chatData);

    return roll;
  }

  async _onApplyEffect(event) {
    event.preventDefault();
    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    const orgActor = this.actor.name;
    const orgId = this.actor._id;
    const targetEffects = item.effects;
    const targetActorName = [];
    const transferEffectName = [];
    const targetedToken = game.user.targets;
    if (targetedToken.size === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Notargetwarn"));
      return;
    }

    // Target Actor
    const targetActors = [];
    targetedToken.forEach((token) => {
      targetActors.push(token.actor);

      // Actor name stock for chat message
      const actorName = token.actor.name;
      targetActorName.push({ actorName });
    });

    // Effect name stock for chat message
    targetEffects.forEach((effect) => {
      const effectName = effect.name;
      transferEffectName.push({ effectName });
    });

    // Apply
    const targetTokens = game.user.targets;
    const targetTokenId = Array.from(targetTokens, (target) => target.id);
    if (game.user.isGM) {
      targetActors.forEach((targetActor) => {
        targetEffects.forEach((effect) => {
          const transferEffect = duplicate(effect);
          transferEffect.disabled = false;
          transferEffect.sourceName = orgActor;
          transferEffect.flags.sourceName = orgActor;
          transferEffect.flags.sourceId = `Actor.${orgId}`;
          targetActor.createEmbeddedDocuments("ActiveEffect", [transferEffect]);
        });
      });
    } else {
      game.socket.emit("system.sw25", {
        method: "applyEffect",
        targetTokens: targetTokenId,
        targetEffects: targetEffects,
        orgActor: orgActor,
        orgId: orgId,
      });
    }

    // Chat message
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    let label = game.i18n.localize("SW25.Effectslong");
    let chatActorName = "";
    let chatEffectName = "";

    for (let i = 0; i < targetActorName.length; i++) {
      chatActorName += ">>> " + targetActorName[i].actorName + "<br>";
    }
    for (let i = 0; i < transferEffectName.length; i++) {
      chatEffectName += transferEffectName[i].effectName + "<br>";
    }

    let chatData = {
      speaker: speaker,
      flavor: label,
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/effect-apply.hbs",
      {
        targetActorName: chatActorName,
        transferEffectName: chatEffectName,
      }
    );

    ChatMessage.create(chatData);
  }

  async _onMpCost(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const token = selectedTokens[0];
    const cost = dataset.cost;
    const name = dataset.label;
    const type = dataset.type;
    const meta = 1;
    mpCost(token, cost, name, type, meta);
  }

  async _onLootRoll(event) {
    event.preventDefault();
    lootRoll(this.actor);
  }

  async _showItemDetails(event) {
    event.preventDefault();
    const toggler = $(event.currentTarget);
    const item = toggler.parents(".item");
    const description = item.find(".item-description");

    toggler.toggleClass("open", false);
    description.slideToggle();
  }

  async _showSpellList(event) {
    event.preventDefault();
    const toggler = $(event.currentTarget);
    const item = toggler.parents(".item");
    const description = item.find(".spell-description");

    toggler.toggleClass("open", false);
    description.slideToggle();
  }

  async _onAdjustmentButton(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const input = event.currentTarget.parentElement.querySelector("input");

    if (action === "decrease") input.valueAsNumber -= 1;
    else if (action === "increase") input.valueAsNumber += 1;

    this.submit();
  }
  async _onQuantityButton(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const input = event.currentTarget.closest("li").querySelector("input");
    const property = event.currentTarget.dataset.property;
    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );

    let quantity = parseInt(input.value);
    if (isNaN(quantity)) quantity = 0;
    if (action === "decrease") quantity -= 1;
    else if (action === "increase") quantity += 1;

    input.value = quantity;

    if (item) {
      const data = {};
      data[property] = quantity;
      await item.update(data);
      this._updateQuantity(item, quantity);
    }

    this.submit();
  }
  async _changeQuantity(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newQuantity = Number(event.currentTarget.value);
    await this._updateQuantity(item, newQuantity);
  }
  async _updateQuantity(item, quantity) {
    await item.update({ "system.quantity": quantity });
  }
  async _onSkilllevelButton(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const input = event.currentTarget.closest("li").querySelector("input");
    const property = event.currentTarget.dataset.property;
    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );

    let skilllevel = parseInt(input.value);
    if (isNaN(skilllevel)) skilllevel = 0;
    if (action === "decrease") skilllevel -= 1;
    else if (action === "increase") skilllevel += 1;

    input.value = skilllevel;

    if (item) {
      const data = {};
      data[property] = skilllevel;
      await item.update(data);
      this._updateSkilllevel(item, skilllevel);
    }

    this.submit();
  }
  async _changeSkillLevel(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newSkillLevel = Number(event.currentTarget.value);
    item.update({ "system.skilllevel": newSkillLevel });
  }
  async _updateSkilllevel(item, skilllevel) {
    await item.update({ "system.skilllevel": skilllevel });
  }
  async _changeSkillMod(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newSkillMod = Number(event.currentTarget.value);
    if (newSkillMod == 0) newSkillMod = null;
    item.update({ "system.skillmod": newSkillMod });
  }
  async _onCheckmodButton(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const input = event.currentTarget.closest("li").querySelector("input");
    const property = event.currentTarget.dataset.property;
    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );

    let checkmod = parseInt(input.value);
    if (isNaN(checkmod)) checkmod = 0;
    if (action === "decrease") checkmod -= 1;
    else if (action === "increase") checkmod += 1;

    input.value = checkmod;

    if (item) {
      const data = {};
      data[property] = checkmod;
      await item.update(data);
      this._updateCheckmod(item, checkmod);
    }

    this.submit();
  }
  async _changeCheckMod(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newCheckMod = Number(event.currentTarget.value);
    if (newCheckMod == 0) newCheckMod = null;
    item.update({ "system.checkmod": newCheckMod });
  }
  async _updateCheckmod(item, checkmod) {
    await item.update({ "system.checkmod": checkmod });
  }

  async _changeCheckMod1(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newCheckMod = Number(event.currentTarget.value);
    if (newCheckMod == 0) newCheckMod = null;
    item.update({ "system.checkmod1": newCheckMod });
  }
  async _updateCheckmod(item, checkmod) {
    await item.update({ "system.checkmod1": checkmod });
  }

  async _changeCheckMod2(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newCheckMod = Number(event.currentTarget.value);
    if (newCheckMod == 0) newCheckMod = null;
    item.update({ "system.checkmod2": newCheckMod });
  }
  async _updateCheckmod(item, checkmod) {
    await item.update({ "system.checkmod2": checkmod });
  }

  async _changeCheckMod3(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newCheckMod = Number(event.currentTarget.value);
    if (newCheckMod == 0) newCheckMod = null;
    item.update({ "system.checkmod3": newCheckMod });
  }
  async _updateCheckmod(item, checkmod) {
    await item.update({ "system.checkmod3": checkmod });
  }

  async _changePowerMod(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newPowerMod = Number(event.currentTarget.value);
    if (newPowerMod == 0) newPowerMod = null;
    item.update({ "system.powermod": newPowerMod });
  }
  async _updatePowermod(item, powermod) {
    await item.update({ "system.powermod": powermod });
  }

  async _changeEquip(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newEquip = event.currentTarget.checked;
    item.update({ "system.equip": newEquip });
  }
  async _updateEquip(item, equip) {
    await item.update({ "system.equip": equip });
  }

  async _changeReading(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newReading = event.currentTarget.checked;
    item.update({ "system.reading": newReading });
  }
  async _updateReading(item, reading) {
    await item.update({ "system.reading": reading });
  }

  async _changeConversation(event) {
    event.preventDefault();

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let newConversation = event.currentTarget.checked;
    item.update({ "system.conversation": newConversation });
  }
  async _updateConversation(item, conversation) {
    await item.update({ "system.conversation": conversation });
  }

  async _onGrowthCheck(event) {
    event.preventDefault();
    growthCheck(this.actor);
  }
}
