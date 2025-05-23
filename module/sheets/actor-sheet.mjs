import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { powerRoll } from "../helpers/powerroll.mjs";
import { mpCost, hpCost } from "../helpers/mpcost.mjs";
import { lootRoll } from "../helpers/lootroll.mjs";
import { growthCheck } from "../helpers/growthcheck.mjs";
import { actionRoll } from "../helpers/actionroll.mjs";
import { targetRollDialog, targetSelectDialog } from "../helpers/dialogs.mjs";
import { SW25 } from "../helpers/config.mjs";

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

    context.config = CONFIG.SW25;

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
    const infusion = [];
    const barbarousskill = [];
    const essenceweave = [];
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
    const abyssal = [];
    const monsterabilities = [];
    const actions = [];
    const actionsf17 = [];
    const actionsf16 = [];
    const actionsf38 = [];
    const actionsf35 = [];
    const actionsf59 = [];
    const actionsf54 = [];
    const actionsf610 = [];
    const actionsf63 = [];
    const actionsd18 = [];
    const actionsd28 = [];
    const actionsd49 = [];
    const actionsd610 = [];
    const notes = [];
    const materials = {
      red: { b: [], a: [], s: [], ss: [] },
      green: { b: [], a: [], s: [], ss: [] },
      black: { b: [], a: [], s: [], ss: [] },
      white: { b: [], a: [], s: [], ss: [] },
      gold: { b: [], a: [], s: [], ss: [] },
    };
    const lifelines = [];
    const tacspowers = [];
    const abyssexs = [];
    let materialshow = {
      all: false,
      red: false,
      green: false,
      black: false,
      white: false,
      gold: false,
    };

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
        if (
          i.system?.resource?.type == null ||
          i.system?.resource?.type == "none" ||
          !i.system?.resource?.isNotBattle
        ) {
          resources.push(i);
        }

        if (i.system?.resource?.type == "note") {
          notes.push(i);
        } else if (i.system?.resource?.type == "material") {
          let materialtype = i.system?.resource?.materialtype;
          let materialrank = i.system?.resource?.materialrank;
          materials[materialtype][materialrank].push(i);
          materialshow.all = true;
          materialshow[materialtype] = true;
        } else if (i.system?.resource?.type == "lifeline") {
          lifelines.push(i);
        } else if (i.system?.resource?.type == "tacspower") {
          tacspowers.push(i);
        } else if (i.system?.resource?.type == "abyssex") {
          abyssexs.push(i);
        }
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

      // Append to infusion.
      else if (i.type === "infusion") {
        infusion.push(i);
      }

      // Append to barbarousskill.
      else if (i.type === "barbarousskill") {
        barbarousskill.push(i);
      }

      // Append to essenceweave.
      else if (i.type === "essenceweave") {
        essenceweave.push(i);
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
        if (i.system.type === "abyssal") {
          abyssal.push(i);
        }
      }

      // Append to monsterability.
      else if (i.type === "monsterability") {
        monsterabilities.push(i);
      }

      // Append to action.
      else if (i.type === "action") {
        actions.push(i);
        if (i.system.actiondice == "f1") {
          if (i.system.actionresult == "7") {
            actionsf17.push(i);
          }
          if (i.system.actionresult == "6") {
            actionsf16.push(i);
          }
        }
        if (i.system.actiondice == "f3") {
          if (i.system.actionresult == "8") {
            actionsf38.push(i);
          }
          if (i.system.actionresult == "5") {
            actionsf35.push(i);
          }
        }
        if (i.system.actiondice == "f5") {
          if (i.system.actionresult == "9") {
            actionsf59.push(i);
          }
          if (i.system.actionresult == "4") {
            actionsf54.push(i);
          }
        }
        if (i.system.actiondice == "f6") {
          if (i.system.actionresult == "10") {
            actionsf610.push(i);
          }
          if (i.system.actionresult == "3") {
            actionsf63.push(i);
          }
        }
        if (i.system.actiondice == "d1") {
          if (i.system.actionresult == "8") {
            actionsd18.push(i);
          }
        }
        if (i.system.actiondice == "d2") {
          if (i.system.actionresult == "8") {
            actionsd28.push(i);
          }
        }
        if (i.system.actiondice == "d4") {
          if (i.system.actionresult == "9") {
            actionsd49.push(i);
          }
        }
        if (i.system.actiondice == "d6") {
          if (i.system.actionresult == "10") {
            actionsd610.push(i);
          }
        }
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

    let ifshow = true;
    if (infusion.length == 0) {
      ifshow = false;
    } else ifshow = true;

    let bsshow = true;
    if (barbarousskill.length == 0) {
      bsshow = false;
    } else bsshow = true;

    let ewshow = true;
    if (essenceweave.length == 0) {
      ewshow = false;
    } else ewshow = true;

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

    let abshow = true;
    if (abyssal.length == 0) {
      abshow = false;
    } else abshow = true;

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
    context.infusion = infusion;
    context.ifshow = ifshow;
    context.barbarousskill = barbarousskill;
    context.bsshow = bsshow;
    context.essenceweave = essenceweave;
    context.ewshow = ewshow;
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
    context.abyssal = abyssal;
    context.abshow = abshow;
    context.monsterabilities = monsterabilities;
    context.actions = actions;
    context.actionsf17 = actionsf17;
    context.actionsf16 = actionsf16;
    context.actionsf38 = actionsf38;
    context.actionsf35 = actionsf35;
    context.actionsf59 = actionsf59;
    context.actionsf54 = actionsf54;
    context.actionsf610 = actionsf610;
    context.actionsf63 = actionsf63;
    context.actionsd18 = actionsd18;
    context.actionsd28 = actionsd28;
    context.actionsd49 = actionsd49;
    context.actionsd610 = actionsd610;
    context.notes = notes;
    context.materials = materials;
    context.lifelines = lifelines;
    context.tacspowers = tacspowers;
    context.abyssexs = abyssexs;
    context.noteshow = notes.length > 0;
    context.materialshow = materialshow;
    context.lifelineshow = lifelines.length > 0;
    context.tacspowershow = tacspowers.length > 0;
    context.abyssexshow = abyssexs.length > 0;
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

    // Hp cost.
    html.on("click", ".hpcost", this._onHpCost.bind(this));

    // Resource cost.
    html.on("click", ".resourcecost", this._onResourceCost.bind(this));

    // Loot roll.
    html.on("click", ".lootrollable", this._onLootRoll.bind(this));

    // use Phasearea.
    html.on("click", ".usephasearea", this._onUsePhasearea.bind(this));

    // Material card cost.
    html.on("click", ".materialcardcost", this._onMaterialcardCost.bind(this));

    // Popularity roll.
    html.on("click", ".popularityrollable", this._onPopularityRoll.bind(this));

    // Preemptive roll.
    html.on("click", ".preemptiverollable", this._onPreEmptiveRoll.bind(this));

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
    html.find(".spelllist-label").click(this._showSpellList.bind(this));
    html.find(".spell-label").click(this._showSpellDetails.bind(this));
    html.find(".action-label").click(this._showActionDetails.bind(this));

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
    html.find(".roll-actiontable").click(this._onActionTable.bind(this));

    // Drag action item to table
    html.find(`.actiontable`).on("drop", this._onActionTableDrag.bind(this));

    // Fairy contract check
    html.find(".fairy-contract").on("click", async (ev) => {
      const target = ev.currentTarget;
      const dataPath = target.dataset.path;
      const currentState = getProperty(this.actor, dataPath) || false;

      await this.actor.update({ [dataPath]: !currentState });
      target.classList.toggle("checked", !currentState);
    });
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
    const name = game.i18n.format("DOCUMENT.New", {
      type: game.i18n.localize(`TYPES.Item.${type}`),
    });
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
    const element = event.currentTarget;
    const dataset = element.dataset;
    const targetTokens = game.user.targets;
    if (dataset.apply == "-" || !dataset.apply || targetTokens.size === 0) {
      await this._onRollExec(event);
      return;
    } else {
      let label = dataset.label ? `${dataset.label}` : "";
      const targetRoll = await targetRollDialog(targetTokens, label);
      if (targetRoll == "cancel") {
        return;
      } else if (targetRoll == "once") {
        await this._onRollExec(event, targetTokens);
        return;
      } else if (targetRoll == "individual") {
        let chatMessageId = [];
        for (const [index, token] of Array.from(targetTokens).entries()) {
          const targetToken = new Set([token]);
          await this._onRollExec(event, targetToken).then((result) => {
            chatMessageId.push(result.chatMessageId);
          });
        }

        // rendar apply all message
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const checktype = dataset.checktype ? dataset.checktype.split(",") : "";
        let chatData = {
          speaker: speaker,
          flavor: `${label} - <b>${game.i18n.localize("SW25.Applyall")}</b>`,
        };
        chatData.flags = {
          targetMessage: chatMessageId,
        };
        chatData.content = await renderTemplate(
          "systems/sw25/templates/roll/roll-applyall.hbs",
          {
            apply: dataset.apply,
            checktype: checktype,
          }
        );

        ChatMessage.create(chatData);
        return;
      }
    }

    await this._onRollExec(event);
  }
  async _onRollExec(event, targetTokens) {
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

      let chatresuse;
      if (dataset.resuse) {
        const resuseid = dataset.resuse;
        const resusequantity = dataset.resusequantity;
        const resuseitem = this.actor.items.get(resuseid);
        const resuseitemquantity = resuseitem.system.quantity;
        const remainingquantity = resuseitemquantity - resusequantity;
        const min = resuseitem.system.qmin;

        if (resuseitem) {
          if (resuseitemquantity < resusequantity) {
            ui.notifications.warn(
              game.i18n.localize("SW25.Item.Noresquantitiywarn") +
                resuseitem.name
            );
            return;
          }
          if (remainingquantity < min) {
            ui.notifications.warn(
              game.i18n.localize("SW25.Item.Noresquantitiywarn") +
                resuseitem.name
            );
            return;
          }
          resuseitem.update({ "system.quantity": remainingquantity });
          chatresuse = `<div style="text-align: right;">${resuseitem.name}: ${resuseitemquantity} >>> ${remainingquantity}</div>`;
        }
      }

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

      // when selected target
      let target = null;
      let targetName = null;
      if (targetTokens) {
        const targetArray = Array.from(targetTokens);
        target = targetArray.map((target) => target.id);
        let targetNames = targetArray.map((target) => target.document.name);
        targetName = ``;
        for (let i = 0; i < targetNames.length; i++) {
          if (i != 0) targetName = targetName + `<br>`;
          targetName = targetName + `>>> ${targetNames[i]}`;
        }
        targetName = targetName + ``;
      }

      chatData.flags = {
        total: roll.total,
        orgtotal: roll.total,
        formula: roll.formula,
        rolls: roll,
        tooltip: await roll.getTooltip(),
        apply: chatapply,
        spell: chatspell,
        checktype: checktype,
        target,
        targetName: targetName,
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
          resusetext: chatresuse,
          targetName: targetName,
        }
      );

      let chatMessageId;
      await ChatMessage.create(chatData).then((chatMessage) => {
        chatMessageId = chatMessage.id;
      });

      return { roll, chatMessageId };
    }
  }

  /**
   * Handle clickable power rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onPowerRoll(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const targetTokens = game.user.targets;
    if (dataset.apply == "-" || !dataset.apply || targetTokens.size === 0) {
      await this._onPowerRollExec(event);
      return;
    } else {
      let label = dataset.label ? `${dataset.label}` : "";
      const targetRoll = await targetRollDialog(targetTokens, label);
      if (targetRoll == "cancel") {
        return;
      } else if (targetRoll == "once") {
        await this._onPowerRollExec(event, targetTokens);
        return;
      } else if (targetRoll == "individual") {
        let chatMessageId = [];
        for (const [index, token] of Array.from(targetTokens).entries()) {
          const targetToken = new Set([token]);
          await this._onPowerRollExec(event, targetToken).then((result) => {
            chatMessageId.push(result.chatMessageId);
          });
        }

        // rendar apply all message
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const powertype = dataset.powertype ? dataset.powertype.split(",") : "";
        let chatData = {
          speaker: speaker,
          flavor: `${label} - <b>${game.i18n.localize("SW25.Applyall")}</b>`,
        };
        chatData.flags = {
          targetMessage: chatMessageId,
        };
        chatData.content = await renderTemplate(
          "systems/sw25/templates/roll/roll-applyall.hbs",
          {
            apply: dataset.apply,
            powertype: powertype,
          }
        );

        ChatMessage.create(chatData);
        return;
      }
    }

    await this._onPowerRollExec(event);
  }
  async _onPowerRollExec(event, targetTokens) {
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

    // when selected target
    let target = null;
    let targetName = null;
    if (targetTokens) {
      const targetArray = Array.from(targetTokens);
      target = targetArray.map((target) => target.id);
      let targetNames = targetArray.map((target) => target.document.name);
      targetName = ``;
      for (let i = 0; i < targetNames.length; i++) {
        if (i != 0) targetName = targetName + `<br>`;
        targetName = targetName + `>>> ${targetNames[i]}`;
      }
      targetName = targetName + ``;
    }

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
      target,
      targetName: targetName,
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
        targetName: targetName,
      }
    );

    let chatMessageId;
    await ChatMessage.create(chatData).then((chatMessage) => {
      chatMessageId = chatMessage.id;
    });

    return { roll, chatMessageId };
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

    // if no target,show dialog
    if (targetedToken.size === 0) {
      const title = `${item.name} (${game.i18n.localize("SW25.Effectslong")})`;
      const selectedTokens = await targetSelectDialog(title);
      game.user.updateTokenTargets(selectedTokens.map((token) => token.id));
      if (!selectedTokens) {
        return;
      }
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

    // reset target
    game.user.targets.forEach((target) => target.setTarget(false));

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

  async _onHpCost(event) {
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
    const max = dataset.max;
    const name = dataset.label;
    const type = dataset.type;
    hpCost(token, cost, max, name, type);
  }

  async _onResourceCost(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });

    if (dataset.resuse) {
      const resuseid = dataset.resuse;
      const resusequantity = dataset.resusequantity;
      const resuseitem = this.actor.items.get(resuseid);
      const resuseitemquantity = resuseitem.system.quantity;
      const remainingquantity = resuseitemquantity - resusequantity;
      const min = resuseitem.system.qmin;

      if (resuseitem) {
        if (resuseitemquantity < resusequantity) {
          ui.notifications.warn(
            game.i18n.localize("SW25.Item.Noresquantitiywarn") + resuseitem.name
          );
          return;
        }
        if (remainingquantity < min) {
          ui.notifications.warn(
            game.i18n.localize("SW25.Item.Noresquantitiywarn") + resuseitem.name
          );
          return;
        }
        resuseitem.update({ "system.quantity": remainingquantity });

        let chatData = {
          speaker: speaker,
        };

        chatData.content = `<div style="text-align: right;">${resuseitem.name}: ${resuseitemquantity} >>> ${remainingquantity}</div>`;

        ChatMessage.create(chatData);
      }
    }
  }

  async _onLootRoll(event) {
    event.preventDefault();
    lootRoll(this.actor);
  }

  async _onPopularityRoll(event) {
    event.preventDefault();

    let checkName = game.settings.get("sw25", "effectMKnowPC");
    let inputName = "";
    let refAbility = "";
    let modifier = "";
    let targetValue = 0;
    let method = "check";

    let isView = false;
    if (
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER <= this.actor.ownership.default
    ) {
      isView = true;
    }

    let monsterName = isView
      ? this.actor.name
      : this.actor.system.udname
      ? this.actor.system.udname
      : game.i18n.localize("SW25.Monster.Unidentifiedmon");
    monsterName += `(${this.actor.system.type})`;
    targetValue = this.actor.system.popularity;
    targetValue += Number.isFinite(this.actor.system.weakpoint)
      ? "/" + this.actor.system.weakpoint
      : "";

    let message = `${game.i18n.localize(
      "SW25.Monster.Popularity"
    )}/${game.i18n.localize("SW25.Monster.Weakpoint")}`;

    const speaker = isView
      ? ChatMessage.getSpeaker({ actor: this.actor })
      : ChatMessage.getSpeaker({ alias: "Gamemaster" });

    let chatData = {
      speaker: speaker,
      flavor: checkName,
    };
    chatData.flags = {
      checkName: checkName,
      inputName: inputName,
      refAbility: refAbility,
      modifier: modifier,
      targetValue: targetValue,
      method: method,
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-card.hbs",
      {
        checkName: checkName,
        message: message,
        difficulty: monsterName,
        targetValue: targetValue,
        mod: modifier,
      }
    );

    ChatMessage.create(chatData);
  }

  async _onPreEmptiveRoll(event) {
    event.preventDefault();

    let checkName = game.settings.get("sw25", "effectInitPC");
    let inputName = "";
    let refAbility = "";
    let modifier = "";
    let targetValue = 0;
    let method = "check";

    let isView = false;
    if (
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER <= this.actor.ownership.default
    ) {
      isView = true;
    }

    let monsterName = isView
      ? this.actor.name
      : this.actor.system.udname
      ? this.actor.system.udname
      : game.i18n.localize("SW25.Monster.Unidentifiedmon");
    monsterName += `(${this.actor.system.type})`;
    targetValue = this.actor.system.preemptive;
    let message = game.i18n.localize("SW25.Monster.Preemptive");

    const speaker = isView
      ? ChatMessage.getSpeaker({ actor: this.actor })
      : ChatMessage.getSpeaker({ alias: "Gamemaster" });

    let chatData = {
      speaker: speaker,
      flavor: checkName,
    };
    chatData.flags = {
      checkName: checkName,
      inputName: inputName,
      refAbility: refAbility,
      modifier: modifier,
      targetValue: targetValue,
      method: method,
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-card.hbs",
      {
        checkName: checkName,
        message: message,
        difficulty: monsterName,
        targetValue: targetValue,
        mod: modifier,
      }
    );

    ChatMessage.create(chatData);
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
    const description = item.find(".spelllist-description");

    toggler.toggleClass("open", false);
    description.slideToggle();
  }

  async _showSpellDetails(event) {
    event.preventDefault();
    const toggler = $(event.currentTarget);
    const item = toggler.parents(".spell");
    const description = item.find(".spell-description");

    toggler.toggleClass("open", false);
    description.slideToggle();
  }

  async _showActionDetails(event) {
    event.preventDefault();
    const toggler = $(event.currentTarget);
    const item = toggler.parents(".action");
    const description = item.find(".action-description");

    toggler.toggleClass("open", false);
    description.slideToggle();
  }

  async _onAdjustmentButton(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const input = event.currentTarget.parentElement.querySelector("input");

    if (action === "decrease")
      isNaN(input.valueAsNumber) || !input.valueAsNumber
        ? (input.valueAsNumber = -1)
        : (input.valueAsNumber -= 1);
    else if (action === "increase")
      isNaN(input.valueAsNumber) || !input.valueAsNumber
        ? (input.valueAsNumber = 1)
        : (input.valueAsNumber += 1);

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

    // Check limit
    if (item.type == "resource") {
      if (item.system.qmax || item.system.qmax == 0) {
        /*
        if (quantity == item.system.qmax) {
          quantity = item.system.qmax;
          ui.notifications.warn(
            `"${item.name}"${game.i18n.localize("SW25.isMax")}`
          );
        }
        */
        if (item.system.qmax && quantity > item.system.qmax) {
          quantity = item.system.qmax;
          ui.notifications.warn(
            `"${item.name}"${game.i18n.localize("SW25.isAlreadyMax")}`
          );
        }
      }
      if (item.system.qmin || item.system.qmin == 0) {
        /*
        if (quantity == item.system.qmin) {
          quantity = item.system.qmin;
          ui.notifications.warn(
            `"${item.name}"${game.i18n.localize("SW25.isMin")}`
          );
        }
        */
        if (item.system.qmin && quantity < item.system.qmin) {
          quantity = item.system.qmin;
          ui.notifications.warn(
            `"${item.name}"${game.i18n.localize("SW25.isAlreadyMin")}`
          );
        }
      }
    }

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

  async _onActionTable(event) {
    event.preventDefault();
    const element = event.currentTarget;
    actionRoll(element, this.actor);
  }

  async _onActionTableDrag(event) {
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const data = JSON.parse(
      event.originalEvent.dataTransfer.getData("text/plain")
    );
    const item = await fromUuid(data.uuid);
    if (!item) return;
    if (item.type != "action") return;

    // set item data
    let updatedData = {};
    switch (dataset.area) {
      case "f17":
        updatedData = { "system.actiondice": "f1", "system.actionresult": "7" };
        break;
      case "f16":
        updatedData = { "system.actiondice": "f1", "system.actionresult": "6" };
        break;
      case "f38":
        updatedData = { "system.actiondice": "f3", "system.actionresult": "8" };
        break;
      case "f35":
        updatedData = { "system.actiondice": "f3", "system.actionresult": "5" };
        break;
      case "f59":
        updatedData = { "system.actiondice": "f5", "system.actionresult": "9" };
        break;
      case "f54":
        updatedData = { "system.actiondice": "f5", "system.actionresult": "4" };
        break;
      case "f610":
        updatedData = {
          "system.actiondice": "f6",
          "system.actionresult": "10",
        };
        break;
      case "f63":
        updatedData = { "system.actiondice": "f6", "system.actionresult": "3" };
        break;
      case "d18":
        updatedData = { "system.actiondice": "d1", "system.actionresult": "8" };
        break;
      case "d28":
        updatedData = { "system.actiondice": "d2", "system.actionresult": "8" };
        break;
      case "d49":
        updatedData = { "system.actiondice": "d4", "system.actionresult": "9" };
        break;
      case "d610":
        updatedData = {
          "system.actiondice": "d6",
          "system.actionresult": "10",
        };
        break;
      default:
        updatedData = {
          "system.actiondice": null,
          "system.actionresult": null,
        };
        break;
    }

    // update item data
    const ownedItem = this.actor.items.get(item.id);
    if (ownedItem) {
      await ownedItem.update(updatedData);
    } else {
      event.stopPropagation();
      const newItem = item.toObject();
      const createdItem = await this.actor.createEmbeddedDocuments("Item", [
        newItem,
      ]);
      await createdItem[0].update(updatedData);
    }
  }

  async _selectApplyTarget(event, item, targetEffects, orgActor, orgId) {
    const tokens = canvas.tokens.placeables;

    if (tokens.length === 0) {
      return ui.notifications.warn(game.i18n.localize("SW25.NotTokenwarn"));
    }

    const categories = {
      friendly: [],
      neutral: [],
      hostile: [],
    };

    tokens.forEach((token) => {
      switch (token.document.disposition) {
        case 1:
          categories.friendly.push(token);
          break;
        case 0:
          categories.neutral.push(token);
          break;
        case -1:
          categories.hostile.push(token);
          break;
      }
    });

    for (const key in categories) {
      categories[key].sort((a, b) => a.name.localeCompare(b.name));
    }

    const createCategoryBox = (category, title, categoryId) => {
      let box = `<fieldset class="target-select">
        <legend id="${categoryId}-toggle" style="cursor: pointer;">
          <span class="selectable">${title}</span>
        </legend>`;
      category.forEach((token) => {
        box += `
          <div>
            <input type="checkbox" id="token-${token.id}" name="${categoryId}" value="${token.id}" />
            <label for="token-${token.id}" style="font-weight: normal;">${token.name}</label>
          </div>`;
      });
      box += `</fieldset>`;
      return box;
    };

    const content = `
      <div style="width: 100%;">
        ${createCategoryBox(
          categories.friendly,
          game.i18n.localize("SW25.Disposition.Friendly"),
          "friendly"
        )}
        ${createCategoryBox(
          categories.neutral,
          game.i18n.localize("SW25.Disposition.Neutral"),
          "neutral"
        )}
        ${createCategoryBox(
          categories.hostile,
          game.i18n.localize("SW25.Disposition.Hostile"),
          "hostile"
        )}
      </div>`;

    const dialog = new Dialog({
      title: game.i18n.localize("SW25.TargetSelect") + `(${item.name})`,
      content: content,
      buttons: {
        process: {
          label: game.i18n.localize("SW25.Item.EffectB"),
          callback: (html) => {
            const selectedIds = html
              .find('input[type="checkbox"]:checked')
              .map((_, el) => el.value)
              .get();

            if (selectedIds.length === 0) {
              return ui.notifications.warn(
                game.i18n.localize("SW25.Notargetwarn")
              );
            }

            const selectedTokens = canvas.tokens.placeables.filter((token) =>
              selectedIds.includes(token.id)
            );
            const targetTokenId = Array.from(
              selectedTokens,
              (target) => target.id
            );

            if (game.user.isGM) {
              selectedTokens.forEach((targetActor) => {
                targetEffects.forEach((effect) => {
                  const transferEffect = duplicate(effect);
                  transferEffect.disabled = false;
                  transferEffect.sourceName = orgActor;
                  transferEffect.flags.sourceName = orgActor;
                  transferEffect.flags.sourceId = `Actor.${orgId}`;
                  targetActor.actor.createEmbeddedDocuments("ActiveEffect", [
                    transferEffect,
                  ]);
                });
              });
            } else {
              console.log(targetTokenId);
              console.log(targetEffects);
              game.socket.emit("system.sw25", {
                method: "applyEffect",
                targetTokens: targetTokenId,
                targetEffects: targetEffects,
                orgActor: orgActor,
                orgId: orgId,
              });
            }
          },
        },
        cancel: {
          label: game.i18n.localize("SW25.Item.Spell.Cancel"),
        },
      },
      default: "cancel",
    });

    dialog.render(true);

    Hooks.once("renderDialog", (app, html) => {
      const addToggleHandler = (categoryId) => {
        const toggle = html.find(`#${categoryId}-toggle`);
        const checkboxes = html.find(`input[name="${categoryId}"]`);

        toggle.on("click", () => {
          const allChecked = checkboxes.toArray().every((cb) => cb.checked);
          checkboxes.prop("checked", !allChecked).trigger("change");
        });

        checkboxes.on("change", (event) => {
          const checkbox = $(event.currentTarget);
          const label = checkbox.next("label");
          label.css("font-weight", checkbox.is(":checked") ? "bold" : "normal");
        });
      };

      addToggleHandler("friendly");
      addToggleHandler("neutral");
      addToggleHandler("hostile");

      html[0].style.width = "500px";
    });
  }

  async _onUsePhasearea(event) {
    event.preventDefault();
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );
    let cost = item.system.mincost ? item.system.mincost : 0;

    if (item.system.maxcost && item.system.mincost != item.system.maxcost) {
      this._inputUsePhaseareaCost(item);
    } else {
      this._applyPhasearea(item, cost);
    }
  }

  async _applyPhasearea(item, cost) {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }

    const orgActor = this.actor.name;
    const orgId = this.actor._id;
    const name =
      item.name +
      game.i18n.localize("SW25.Use") +
      " " +
      cost +
      game.i18n.localize("SW25.Item.Phasearea.Point");
    let effects = [
      {
        name: name,
        img: item.img,
        origin: "Item." + item._id,
        disabled: false,
        changes: [],
        description: item.system.description,
        transfer: false,
        statuses: [],
        flags: {
          sourceName: orgActor,
          sourceId: `Actor.${orgId}`,
        },
        tint: null,
      },
    ];

    let lifeline = "";
    if (item.system.type == "ten") {
      lifeline = "Ten";
    } else if (item.system.type == "chi") {
      lifeline = "Chi";
    } else if (item.system.type == "jin") {
      lifeline = "Jin";
    }

    let resource = this.actor.items.find(i =>
      i.type === "resource" &&
      i.system?.resource?.type === "lifeline" &&
      i.system?.resource?.lifelinetype === item.system.type
    );

    if (!resource) {
      ui.notifications.warn(game.i18n.localize("SW25.NotResource") + ":" + game.i18n.localize(`SW25.Item.Phasearea.${lifeline}`));
    } else {
      let oldVal = resource.system.quantity ? resource.system.quantity : 0;
      let newVal = oldVal - cost;

      await resource.update({ "system.quantity": newVal });
    }

    if (item.system.type == "ten") {
      let val = this.actor.system.attributes.qi.heaven.value - cost;
      this.actor.update({
        "system.attributes.qi.heaven.value": val,
      });
    } else if (item.system.type == "chi") {
      let val = this.actor.system.attributes.qi.earth.value - cost;
      this.actor.update({
        "system.attributes.qi.earth.value": val,
      });
    } else if (item.system.type == "jin") {
      let val = this.actor.system.attributes.qi.spirit.value - cost;
      this.actor.update({
        "system.attributes.qi.spirit.value": val,
      });
    }

    // Apply
    if (game.user.isGM) {
      selectedTokens[0].actor.createEmbeddedDocuments("ActiveEffect", effects);
    } else {
      const targetTokenId = Array.from(selectedTokens, (target) => target.id);
      game.socket.emit("system.sw25", {
        method: "applyEffect",
        targetTokens: targetTokenId,
        targetEffects: effects,
        orgActor: orgActor,
        orgId: orgId,
      });
    }

    // Chat message
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    let label = game.i18n.localize("SW25.Effectslong");
    let chatActorName = ">>> " + selectedTokens[0].actor.name + "<br>";
    let chatEffectName = effects[0].name + game.i18n.localize(`SW25.Item.Phasearea.${lifeline}`) + "<br>";

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

  async _inputUsePhaseareaCost(item) {
    const title = game.i18n.localize("SW25.InputPhaseareaPoint");
    new Dialog({
      title: `${title} (${item.name})`,
      content: `
        <form>
          <div class="form-group">
            <label for="number">${title} (${item.system.mincost}-${item.system.maxcost})</label>
          </div>
          <div class="form-group">
            <input id="number" name="number" type="number" value="0" />
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: game.i18n.localize("SW25.Use"),
          callback: (html) => {
            const cost = parseInt(html.find("#number").val());
            if (isNaN(cost)) {
              ui.notifications.error(
                game.i18n.localize("SW25.Item.Spell.Cancel")
              );
              return;
            }
            this._applyPhasearea(item, cost);
          },
        },
        cancel: {
          label: game.i18n.localize("SW25.Item.Spell.Cancel"),
        },
      },
      default: "ok",
    }).render(true);
  }

  async _onMaterialcardCost(event) {
    event.preventDefault();
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }

    const changeItem = $(event.currentTarget);
    const item = this.actor.items.get(
      changeItem.parents(".item")[0].dataset.itemId
    );

    const useRank = event.target.textContent.trim().toLowerCase();
    let update = {};
    const cards = [
      { color: "red", mark: "fa-paw" },
      { color: "green", mark: "fa-leaf" },
      { color: "black", mark: "fa-gem" },
      { color: "white", mark: "fa-heart" },
      { color: "gold", mark: "fa-sun" },
    ];
    let message = `${item.name}<br>`;
    
    for (let card of cards) {
      if(!isNaN(item.system[card.color]) && item.system[card.color] <= 0){
        continue;
      } 

      let resource = this.actor.items.find(i =>
          i.type === "resource" &&
          i.system?.resource?.type === "material" &&
          i.system?.resource?.materialtype === card.color &&
          i.system?.resource?.materialrank === useRank
      );

      let cardCap =
        card.color.charAt(0).toUpperCase() +
        card.color.slice(1).toLowerCase();
      if (!resource) {
        message +=
          `<div class="materialcard" style="text-align:center;"><div class="${card.color}"><i class="fa-solid ${card.mark}"></i>` +
          game.i18n.localize(`SW25.Item.Alchemytech.${cardCap}`) +
          event.target.textContent.trim() +
          `(${item.system[card.color]})` +
          ` ... <span style="font-size:1.5em">` +
          game.i18n.localize(`SW25.NotResource`) +
          `</span></div></div>`;
      } else {
        let oldVal = resource.system.quantity ? resource.system.quantity : 0;
        let newVal = oldVal - item.system[card.color];

        message +=
          `<div class="materialcard" style="text-align:center;"><div class="${card.color}"><i class="fa-solid ${card.mark}"></i>` +
          game.i18n.localize(`SW25.Item.Alchemytech.${cardCap}`) +
          event.target.textContent.trim() +
          `(${item.system[card.color]})` +
          ` ... <span style="font-size:1.5em">${oldVal} -> ${newVal}</span></div></div>`;

        await resource.update({ "system.quantity": newVal });
      }
    }

    this.actor.update(update);

    // Chat message
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    let label =
      game.i18n.localize("SW25.Item.Alchemytech.MaterialCard") +
      game.i18n.localize("SW25.Cost");

    let chatData = {
      speaker: speaker,
      flavor: label,
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/card-apply.hbs",
      {
        message: message,
      }
    );

    ChatMessage.create(chatData);
  }
}
