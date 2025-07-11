import { effectInitPC } from "../sw25.mjs";
import { PT } from "../helpers/powerroll.mjs";
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class SW25Actor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
    this._prepareMonsterData(actorData);
  }
  /**
   * Prepare Character type specific data
   */
  async _prepareCharacterData(actorData) {
    if (actorData.type !== "character") return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    await this.update({});

    //Calcurate Exp & AdvLevel & MgLevel
    this.items.forEach((item) => {
      if (item.type == "skill") {
        // Exp
        systemData.attributes.useexp += item.system.skillexp;
        // AdvLevel & MgLevel
        if (item.system.skilltype == "fighterskill") {
          if (item.system.skilllevel > systemData.attributes.advlevel.value)
            systemData.attributes.advlevel.value = item.system.skilllevel;
        }
        if (item.system.skilltype == "magicuserskill") {
          if (item.system.skilllevel > systemData.attributes.advlevel.value) {
            systemData.attributes.advlevel.value = item.system.skilllevel;
          }
          systemData.attributes.mglevel.value =
            Number(systemData.attributes.mglevel.value) +
            Number(item.system.skilllevel);
        }
        if (item.system.skilltype == "otherskill") {
          if (item.system.skilllevel > systemData.attributes.advlevel.value)
            systemData.attributes.advlevel.value = item.system.skilllevel;
        }
      }
    });

    // Calculate the abilities & modifier
    systemData.abilities.agi.racevalue = systemData.abilities.dex.racevalue;
    systemData.abilities.vit.racevalue = systemData.abilities.str.racevalue;
    systemData.abilities.mnd.racevalue = systemData.abilities.int.racevalue;
    if (!systemData.effect) systemData.efallskadvmod = 0;
    else if (systemData.effect.allsk)
      systemData.efallskadvmod = Number(systemData.effect.allsk);
    else systemData.efallskadvmod = 0;

    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.value =
        Number(ability.racevalue) +
        Number(ability.valuebase) +
        Number(ability.valuegrowth) +
        Number(ability.valuemodify) +
        Number(ability.efvaluemodify);
      ability.mod = Math.floor(ability.value / 6) + Number(ability.efmodify);
      ability.advbase =
        Number(ability.mod) +
        Number(systemData.attributes.advlevel.value) +
        Number(systemData.attributes.advlevel.mod) +
        Number(systemData.efallskadvmod);
    }

    //Calculate HP & MP & Move
    systemData.hp.max =
      Number(systemData.abilities.vit.value) +
      Number(systemData.attributes.advlevel.value) * 3 +
      Number(systemData.hp.hpmod) +
      Number(systemData.hp.efhpmod);
    systemData.mp.max =
      Number(systemData.abilities.mnd.value) +
      Number(systemData.attributes.mglevel.value) * 3 +
      Number(systemData.mp.mpmod) +
      Number(systemData.mp.efmpmod);
    systemData.attributes.move.limited = 3;
    systemData.armorDedicated = this.items.some(item =>
      item.type === "armor" &&
      item.system.equip === true &&
      item.system.dedicated === true &&
      (item.system.category === "nonmetalarmor" || item.system.category === "metalarmor")
    );
    systemData.attributes.move.normal =
      Number(systemData.abilities.agi.value) +
      Number(systemData.attributes.move.movemod) +
      Number(systemData.attributes.move.efmovemod) +
      (systemData.armorDedicated ? 2 : 0);
    systemData.attributes.move.max =
      Number(systemData.attributes.move.normal) * 3;
    if (systemData.attributes.move.normal < 3) {
      systemData.attributes.move.limited = Number(
        systemData.attributes.move.normal
      );
    }
    if(systemData.hp.max < systemData.hp.value){
      systemData.hp.value = systemData.hp.max;
    }
    if(systemData.mp.max < systemData.mp.value){
      systemData.mp.value = systemData.mp.max;
    }

    //Calculate Battle Data
    this.items.forEach((item) => {
      if (item.type == "weapon") {
        if (item.name == systemData.hitweapon) {
          systemData.itemname = item.name;
          systemData.itemhitformula = item.system.checkformula;
          systemData.itemhitbase = item.system.checkbase;
          systemData.itempowerformula = item.system.powerformula;
          systemData.itempower = item.system.power;
          systemData.itemapplycheck = item.system.applycheck;
          systemData.itemchecktype = item.system.checkTypesButton;
          systemData.itemapplypower = item.system.applypower;
          systemData.itempowertype = item.system.powerTypesButton;
          if (item.system.autouseres) {
            systemData.resuse = item.system.resuse;
            systemData.resusequantity = item.system.resusequantity;
          }
          if (item.system.cvalue == null || item.system.cvalue == 0)
            item.system.cvalue = 10;
          if (!systemData.effect) systemData.efcmod = 0;
          else if (systemData.effect.efcvalue)
            systemData.efcmod = Number(systemData.effect.efcvalue);
          else systemData.efcmod = 0;
          systemData.itemcvalue =
            Number(item.system.cvalue) + Number(systemData.efcmod);
          systemData.itempowerbase = item.system.powerbase;
          if (item.system.halfpowmod)
            systemData.itempowerbase += item.system.halfpowmod;
          if (systemData.attributes.efwphalfmod)
            systemData.itempowerbase += systemData.attributes.efwphalfmod;
          systemData.itempowertable = item.system.powertable;
          systemData.itempowertable[PT.LETHALTECH] += systemData.lt;
          systemData.itempowertable[PT.LETHALTECH] += Number(systemData?.attributes?.ltmod) || 0;
          if (!/^f\d+$/.test(systemData.itempowertable[PT.CRITICALRAY])) {
            systemData.itempowertable[PT.CRITICALRAY] =
              Number(systemData.itempowertable[PT.CRITICALRAY]) + systemData.cr
            systemData.itempowertable[PT.CRITICALRAY] += Number(systemData?.attributes?.crmod) || 0;
          }
          systemData.itemid = item.id;
        }
      }
    });

    systemData.itemdodge = 0;
    systemData.itempp = 0;
    systemData.barepp = 0;
    systemData.itemmpp = 0;
    systemData.barempp = 0;
    systemData.baredreduce = 0;
    systemData.skillagidodge = 0;
    systemData.shieldDedicated = this.items.some(item =>
      item.type === "armor" &&
      item.system.equip === true &&
      item.system.dedicated === true &&
      item.system.category === "shield"
    );
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.dodgeskill) {
          const dodgeAgimod = Math.floor(
            (systemData.abilities.dex.racevalue +
              systemData.abilities.agi.valuebase +
              systemData.abilities.agi.valuegrowth +
              systemData.abilities.agi.valuemodify +
              systemData.abilities.agi.efvaluemodify +
              (systemData.shieldDedicated ? 2 : 0)) /
              6 +
              Number(systemData.abilities.agi.efmodify)
          );
          systemData.skillagidodge = Number(item.system.skilllevel) +
            Number(dodgeAgimod) +
            Number(item.system.skillmod);
        }
      }
    });
    this.items.forEach((item) => {
      if (item.type == "armor") {
        if (item.system.equip == true) {
          systemData.itemdodge += Number(item.system.dodge);
          systemData.itempp += Number(item.system.pp);
          systemData.itemmpp += Number(item.system.mpp);
        }
      }
    });
    systemData.dodgebase =
      Number(systemData.skillagidodge) +
      Number(systemData.itemdodge) +
      Number(systemData.attributes.dodgemod) +
      Number(systemData.attributes.efdodgemod);
    systemData.attributes.protectionpoint =
      Number(systemData.itempp) +
      Number(systemData.attributes.ppmod) +
      Number(systemData.attributes.efppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);
    systemData.barepp =
      Number(systemData.itempp) +
      Number(systemData.attributes.ppmod) +
      Number(systemData.attributes.efppmod);
    systemData.attributes.magicprotection =
      Number(systemData.itemmpp) +
      Number(systemData.attributes.mppmod) +
      Number(systemData.attributes.efmppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);
    systemData.barempp =
      Number(systemData.itemmpp) +
      Number(systemData.attributes.mppmod) +
      Number(systemData.attributes.efmppmod);
    systemData.baredreduce =
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);

    //Calculate Spell Data
    if (!systemData.effect) systemData.efallmgpacmod = 0;
    else if (systemData.effect.allmgp)
      systemData.efallmgpacmod = Number(systemData.effect.allmgp);
    else systemData.efallmgpacmod = 0;

    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.scskill) {
          systemData.scbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.scpower =
      Number(systemData.scbase) +
      Number(systemData.attributes.scmod) +
      Number(systemData.attributes.efscmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.sccast =
      Number(systemData.attributes.scpower) +
      Number(systemData.attributes.efscckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.cnskill) {
          systemData.cnbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.cnpower =
      Number(systemData.cnbase) +
      Number(systemData.attributes.cnmod) +
      Number(systemData.attributes.efcnmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.cncast =
      Number(systemData.attributes.cnpower) +
      Number(systemData.attributes.efcnckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.wzskill) {
          systemData.wzbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.wzpower =
      Number(systemData.wzbase) +
      Number(systemData.attributes.wzmod) +
      Number(systemData.attributes.efwzmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.wzcast =
      Number(systemData.attributes.wzpower) +
      Number(systemData.attributes.efwzckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.prskill) {
          systemData.prbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.prpower =
      Number(systemData.prbase) +
      Number(systemData.attributes.prmod) +
      Number(systemData.attributes.efprmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.prcast =
      Number(systemData.attributes.prpower) +
      Number(systemData.attributes.efprckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.mtskill) {
          systemData.mtbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.mtpower =
      Number(systemData.mtbase) +
      Number(systemData.attributes.mtmod) +
      Number(systemData.attributes.efmtmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.mtcast =
      Number(systemData.attributes.mtpower) +
      Number(systemData.attributes.efmtckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.frskill) {
          systemData.frbase = item.system.skillbase.invoke;
          let skillLevel = item.system.skilllevel ? item.system.skilllevel : 0;

          let fairyCount = 0;
          if(systemData.attributes.fairy?.earth){
            fairyCount++;
          }
          if(systemData.attributes.fairy?.water){
            fairyCount++;
          }
          if(systemData.attributes.fairy?.fire){
            fairyCount++;
          }
          if(systemData.attributes.fairy?.wind){
            fairyCount++;
          }
          if(systemData.attributes.fairy?.light){
            fairyCount++;
          }
          if(systemData.attributes.fairy?.dark){
            fairyCount++;
          }

          const fairyRank = [0,1,2,4,5,6,8,9,10,12,13,14,15,15,15,15];
          const fairyAllRank = [0,0,0,2,3,4,4,5,6,6,7,8,8,9,10,10];
          const fairyExRank = [0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5];

          let fairyUseRank = "";
          if(fairyCount < 4) {
            fairyUseRank = fairyRank[skillLevel];
          } else if (fairyCount == 4){
            fairyUseRank = skillLevel;
          } else if (fairyCount == 5){
            fairyUseRank = fairyAllRank[skillLevel];
          } else {
            fairyUseRank = `${fairyAllRank[skillLevel]}/${fairyExRank[skillLevel]}`;
          }
          systemData.frRank = fairyUseRank;
        }
      }
    });
    systemData.attributes.frpower =
      Number(systemData.frbase) +
      Number(systemData.attributes.frmod) +
      Number(systemData.attributes.effrmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.frcast =
      Number(systemData.attributes.frpower) +
      Number(systemData.attributes.effrckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.drskill) {
          systemData.drbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.drpower =
      Number(systemData.drbase) +
      Number(systemData.attributes.drmod) +
      Number(systemData.attributes.efdrmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.drcast =
      Number(systemData.attributes.drpower) +
      Number(systemData.attributes.efdrckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.dmskill) {
          systemData.dmbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.dmpower =
      Number(systemData.dmbase) +
      Number(systemData.attributes.dmmod) +
      Number(systemData.attributes.efdmmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.dmcast =
      Number(systemData.attributes.dmpower) +
      Number(systemData.attributes.efdmckmod) +
      Number(systemData.attributes.efmckall);
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.abskill) {
          systemData.abbase = item.system.skillbase.invoke;
        }
      }
    });
    systemData.attributes.abpower =
      Number(systemData.abbase) +
      Number(systemData.attributes.abmod) +
      Number(systemData.attributes.efabmod) +
      Number(systemData.efallmgpacmod);
    systemData.attributes.abcast =
      Number(systemData.attributes.abpower) +
      Number(systemData.attributes.efabckmod) +
      Number(systemData.attributes.efmckall);

    // Calculate active effect
    let actorEffects = actorData.effects;
    let itemEffects = [];
    this.items.forEach((item) => {
      itemEffects.push(...item.effects);
    });
    let allEffects = [...actorEffects, ...itemEffects];

    let modParams = this._getModParams(allEffects);

    for (let [key, entry] of Object.entries(modParams)) {
      if (typeof entry.value === "number") {
        if (entry.value > 0) {
          entry.value = `+${entry.value}`;
        } else {
          entry.value = `${entry.value}`;
        }
      }
    }
    systemData.modParams = modParams;

    // Set initiative formula
    systemData.initiativeFormula = "2d6";
    this.items.forEach((item) => {
      if (item.name == effectInitPC) {
        systemData.initiativeFormula =
          item.system.formula + "+" + item.system.checkbase;
      }
    });

    // Polyglot support
    const languages = [];
    this.items.forEach((item) => {
      if (item.type == "language") {
        if (item.system.conversation) {
          systemData.attributes.languages.conv.push(`${item.name}`);
          languages.push(
            `${item.name}` +
              ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`
          );
        }
        if (item.system.reading) {
          systemData.attributes.languages.read.push(`${item.name}`);
          languages.push(
            `${item.name}` +
              ` (${game.i18n.localize("SW25.Item.Language.Reading")})`
          );
        }
      }
    });
    systemData.attributes.langlist = languages.join(", ");

    // Sheet refresh
    if (actorData.sheet.rendered)
      await actorData.sheet.render(true, { focus: false });
  }

  /**
   * Prepare NPC type specific data.
   */
  async _prepareNpcData(actorData) {
    if (actorData.type !== "npc") return;

    const systemData = actorData.system;
    await this.update({});

    // Visible data trigger
    const userId = game.user.id;
    if (
      actorData.ownership[userId] === 1 ||
      (typeof actorData.ownership[userId] === "undefined" &&
        actorData.ownership.default === 1)
    ) {
      systemData.limited = true;
      if (systemData.udname == null || systemData.udname == "") {
        systemData.udname = game.i18n.localize("SW25.Npc.Unidentifiednpc");
      }
      actorData.name = systemData.udname;
    } else systemData.limited = false;
    if (game.user.isGM === true) systemData.isgm = true;
    else systemData.isgm = false;

    // Make modifiy
    systemData.hp.max =
      Number(systemData.hpbase) +
      Number(systemData.hp.hpmod) +
      Number(systemData.hp.efhpmod);
    systemData.mp.max =
      Number(systemData.mpbase) +
      Number(systemData.mp.mpmod) +
      Number(systemData.mp.efmpmod);
    systemData.pp =
      Number(systemData.ppbase) +
      Number(systemData.attributes.ppmod) +
      Number(systemData.attributes.efppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);
    systemData.mpp =
      Number(systemData.mppbase) +
      Number(systemData.attributes.mppmod) +
      Number(systemData.attributes.efmppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);

    if(systemData.hp.max < systemData.hp.value){
      systemData.hp.value = systemData.hp.max;
    }
    if(systemData.mp.max < systemData.mp.value){
      systemData.mp.value = systemData.mp.max;
    }
    
    // Calculate active effect
    let actorEffects = actorData.effects;
    let itemEffects = [];
    this.items.forEach((item) => {
      itemEffects.push(...item.effects);
    });
    let allEffects = [...actorEffects, ...itemEffects];
    let activeEffects = allEffects.filter(
      (effect) => effect.disabled === false
    );

    let effectsChange = activeEffects.map((effect) => {
      return effect.changes.map((change) => {
        return {
          key: change.key,
          value: Number(change.value),
          mode: change.mode,
        };
      });
    }).flat();

    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalhpmod = null;
    let totalmpmod = null;
    const processingRules = [
      { key: "system.attributes.efppmod", target: "totalppmod" },
      { key: "system.attributes.efmppmod", target: "totalmppmod" },
      { key: "system.attributes.efdreduce", target: "totaldreduce" },
      { key: "system.hp.efhpmod", target: "totalhpmod" },
      { key: "system.mp.efmpmod", target: "totalmpmod" }
    ];
    let ruleMap = Object.fromEntries(
      processingRules.map((rule) => [rule.key, rule])
    );
    effectsChange.sort((a, b) => a.mode - b.mode);
    effectsChange.forEach((effects) => {

      let rule = ruleMap[effects.key];
      if (rule) {
        let value = Number(effects.value);
        switch (effects.mode) {
          case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
            eval(`${rule.target} *= ${value}`);
            break;

          case CONST.ACTIVE_EFFECT_MODES.ADD:
            eval(`${rule.target} += ${value}`);
            break;
  
          case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
            eval(`${rule.target} = ${value}`);
            break;
  
          case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
          case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
          case CONST.ACTIVE_EFFECT_MODES.CUSTOM:
            //未実装
            break;
  
          default:
            break;
        }
      }
    });
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalhpmod = totalhpmod;
    systemData.totalmpmod = totalmpmod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalhpmod > 0) systemData.totalhpmod = "+" + totalhpmod;
    if (totalmpmod > 0) systemData.totalmpmod = "+" + totalmpmod;

    // Set initiative formula
    systemData.initiativeFormula = "0";

    // Polyglot support
    if (systemData.language) {
      const lang = systemData.language
        .split(/[，,、\s　]+/)
        .map((item) => item.trim());
      systemData.attributes.languages.conv = lang;
      systemData.attributes.languages.read = lang;
    }
    systemData.attributes.langlist = systemData.language;

    // Sheet refresh
    if (actorData.sheet.rendered)
      await actorData.sheet.render(true, { focus: false });
  }

  /**
   * Prepare Monster type specific data.
   */
  async _prepareMonsterData(actorData) {
    if (actorData.type !== "monster") return;

    const systemData = actorData.system;
    await this.update({});

    // Visible data trigger
    const userId = game.user.id;
    if (
      actorData.ownership[userId] === 1 ||
      (typeof actorData.ownership[userId] === "undefined" &&
        actorData.ownership.default === 1)
    ) {
      systemData.limited = true;
      if (systemData.udname == null || systemData.udname == "") {
        systemData.udname = game.i18n.localize("SW25.Monster.Unidentifiedmon");
      }
      actorData.name = systemData.udname;
    } else systemData.limited = false;
    if (game.user.isGM === true) systemData.isgm = true;
    else systemData.isgm = false;

    // Make modifiy
    systemData.exp = systemData.monlevel * 10;

    systemData.hp.max =
      Number(systemData.hpbase) +
      Number(systemData.hp.hpmod) +
      Number(systemData.hp.efhpmod) +
      Math.floor((systemData.abilities?.vit?.efvaluemodify ?? 0));
    systemData.mp.max =
      Number(systemData.mpbase) +
      Number(systemData.mp.mpmod) +
      Number(systemData.mp.efmpmod) +
      Math.floor((systemData.abilities?.mnd?.efvaluemodify ?? 0));
    systemData.pp =
      Number(systemData.ppbase) +
      Number(systemData.attributes.ppmod) +
      Number(systemData.attributes.efppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);
    systemData.mpp =
      Number(systemData.mppbase) +
      Number(systemData.attributes.mppmod) +
      Number(systemData.attributes.efmppmod) +
      Number(systemData.attributes.dreduce) +
      Number(systemData.attributes.efdreduce);

    if(systemData.hp.max < systemData.hp.value){
      systemData.hp.value = systemData.hp.max;
    }
    if(systemData.mp.max < systemData.mp.value){
      systemData.mp.value = systemData.mp.max;
    }
  
    if (systemData.impurity == 0 || systemData.impurity == null)
      systemData.showimp = false;
    else systemData.showimp = true;
    if (systemData.part == 0 || systemData.part == null)
      systemData.showpt = false;
    else systemData.showpt = true;

    // Calculate active effect
    let actorEffects = actorData.effects;
    let itemEffects = [];
    this.items.forEach((item) => {
      itemEffects.push(...item.effects);
    });
    let allEffects = [...actorEffects, ...itemEffects];

    let modParams = this._getModParams(allEffects);

    // Convert Status Monster Parameter.
    // convert dex
    if (modParams.totaldex && typeof modParams.totaldex.value === "number") {
      const dex = modParams.totaldex.value;
      const bonus = Math.floor(dex / 6);

      if(modParams.totalhitmod)
        modParams.totalhitmod.value += bonus;
      else
        modParams.totalhitmod = {
          label: `${game.i18n.localize("SW25.Effect.HitMod")}`,
          value: bonus,
        };

      delete modParams.totaldex;
    }
    if (modParams.totaldexmod && typeof modParams.totaldexmod.value === "number") {
      const bonus = Number(modParams.totaldexmod.value);

      if(modParams.totalhitmod)
        modParams.totalhitmod.value += bonus;
      else
        modParams.totalhitmod = {
          label: `${game.i18n.localize("SW25.Effect.HitMod")}`,
          value: bonus,
        };

      delete modParams.totaldexmod;
    }

    // convert str
    if (modParams.totalstr && typeof modParams.totalstr.value === "number") {
      const param = modParams.totalstr.value;
      const bonus = Math.floor(param / 6);

      if(modParams.totaldmod)
        modParams.totaldmod.value += bonus;
      else
        modParams.totaldmod = {
          label: `${game.i18n.localize("SW25.Effect.DamageMod")}`,
          value: bonus,
        };

      delete modParams.totalstr;
    }
    if (modParams.totalstrmod && typeof modParams.totalstrmod.value === "number") {
      const bonus = Number(modParams.totalstrmod.value);

      if(modParams.totaldmod)
        modParams.totaldmod.value += bonus;
      else
        modParams.totaldmod = {
          label: `${game.i18n.localize("SW25.Effect.DamageMod")}`,
          value: bonus,
        };

      delete modParams.totalstrmod;
    }

    // convert agi
    if (modParams.totalagi && typeof modParams.totalagi.value === "number") {
      const param = modParams.totalagi.value;
      const bonus = Math.floor(param / 6);

      if(modParams.totaldodgemod)
        modParams.totaldodgemod.value += bonus;
      else
        modParams.totaldodgemod = {
          label: `${game.i18n.localize("SW25.Effect.DodgeMod")}`,
          value: bonus,
        };

      if(modParams.totalmovemod)
        modParams.totalmovemod.value += param;
      else
        modParams.totalmovemod = {
          label: `${game.i18n.localize("SW25.Effect.MoveMod")}`,
          value: param,
        };

      if(modParams.totalinit)
        modParams.totalinit.value += bonus;
      else
        modParams.totalinit = {
          label: `${game.i18n.localize("SW25.Config.Init")}`,
          value: bonus,
        };

      delete modParams.totalagi;
    }
    if (modParams.totalagimod && typeof modParams.totalagimod.value === "number") {
      const bonus = Number(modParams.totalagimod.value);

      if(modParams.totaldodgemod)
        modParams.totaldodgemod.value += bonus;
      else
        modParams.totaldodgemod = {
          label: `${game.i18n.localize("SW25.Effect.DodgeMod")}`,
          value: bonus,
        };

      if(modParams.totalmovemod)
        modParams.totalmovemod.value += bonus;
      else
        modParams.totalmovemod = {
          label: `${game.i18n.localize("SW25.Effect.MoveMod")}`,
          value: bonus,
        };

      if(modParams.totalinit)
        modParams.totalinit.value += bonus;
      else
        modParams.totalinit = {
          label: `${game.i18n.localize("SW25.Config.Init")}`,
          value: bonus,
        };

      delete modParams.totalagimod;
    }

    // convert vit
    if (modParams.totalvit && typeof modParams.totalvit.value === "number") {
      const param = modParams.totalvit.value;
      const bonus = Math.floor(param / 6);

      if(modParams.totalvitres)
        modParams.totalvitres.value += bonus;
      else
        modParams.totalvitres = {
          label: `${game.i18n.localize("SW25.Config.ResVit")}`,
          value: bonus,
        };

      if(modParams.totalhpmod)
        modParams.totalhpmod.value += param;
      else
        modParams.totalhpmod = {
          label: `${game.i18n.localize("SW25.Effect.HpMod")}`,
          value: param,
        };

      delete modParams.totalvit;
    }
    if (modParams.totalvitmod && typeof modParams.totalvitmod.value === "number") {
      const bonus = Number(modParams.totalvitmod.value);

      if(modParams.totalvitres)
        modParams.totalvitres.value += bonus;
      else
        modParams.totalvitres = {
          label: `${game.i18n.localize("SW25.Config.ResVit")}`,
          value: bonus,
        };

      delete modParams.totalvitmod;
    }

    // convert int
    if (modParams.totalint && typeof modParams.totalint.value === "number") {
      const param = modParams.totalint.value;
      const bonus = Math.floor(param / 6);

      if(modParams.totalallmgp)
        modParams.totalallmgp.value += bonus;
      else
        modParams.totalallmgp = {
          label: `${game.i18n.localize("SW25.Config.AllMgp")}`,
          value: bonus,
        };

      delete modParams.totalint;
    }
    if (modParams.totalintmod && typeof modParams.totalintmod.value === "number") {
      const bonus = Number(modParams.totalintmod.value);

      if(modParams.totalallmgp)
        modParams.totalallmgp.value += bonus;
      else
        modParams.totalallmgp = {
          label: `${game.i18n.localize("SW25.Config.AllMgp")}`,
          value: bonus,
        };

      delete modParams.totalintmod;
    }

    // convert mnd
    if (modParams.totalmnd && typeof modParams.totalmnd.value === "number") {
      const param = modParams.totalmnd.value;
      const bonus = Math.floor(param / 6);

      if(modParams.totalmndres)
        modParams.totalmndres.value += bonus;
      else
        modParams.totalmndres = {
          label: `${game.i18n.localize("SW25.Config.ResMnd")}`,
          value: bonus,
        };
      if(modParams.totalmpmod)
        modParams.totalmpmod.value += param;
      else
        modParams.totalmpmod = {
          label: `${game.i18n.localize("SW25.Effect.MpMod")}`,
          value: param,
        };

      delete modParams.totalmnd;
    }
    if (modParams.totalmndmod && typeof modParams.totalmndmod.value === "number") {
      const bonus = Number(modParams.totalmndmod.value);

      if(modParams.totalmndres)
        modParams.totalmndres.value += bonus;
      else
        modParams.totalmndres = {
          label: `${game.i18n.localize("SW25.Config.ResMnd")}`,
          value: bonus,
        };

      delete modParams.totalmndmod;
    }

    // normalize
    for (let [key, entry] of Object.entries(modParams)) {
      if (typeof entry.value === "number") {
        if (entry.value > 0) {
          entry.value = `+${entry.value}`;
        } else {
          entry.value = `${entry.value}`;
        }
      }
    }
    systemData.modParams = modParams;

    // Set initiative formula
    systemData.initiativeFormula = String(systemData.preemptive);

    // Polyglot support
    if (systemData.language) {
      const lang = systemData.language
        .split(/[，,、\s　]+/)
        .map((item) => item.trim());
      systemData.attributes.languages.conv = lang;
      systemData.attributes.languages.read = lang;
    }

    // Sheet refresh
    if (actorData.sheet.rendered)
      await actorData.sheet.render(true, { focus: false });
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const data = { ...super.getRollData() };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);
    this._getMonsterRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== "character") return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.advlevel) {
      data.advlvl = data.attributes.advlevel.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== "npc") return;

    // Process additional NPC data here.
  }

  /**
   * Prepare Monster roll data.
   */
  _getMonsterRollData(data) {
    if (this.type !== "monster") return;

    // Add level for easier access, or fall back to 0.
    if (data.monlevel) {
      data.monlvl = data.monlevel ?? 0;
    }

    // Process additional Monster data here.
  }

  _splitEffectKey(effectKey) {
    const keyPrefixes = [
      "system.attributes.damage.physical.classType.",
      "system.attributes.decay.physical.classType.",
      "system.attributes.damage.physical.element.",
      "system.attributes.decay.physical.element.",
      "system.attributes.damage.magic.classType.",
      "system.attributes.decay.magic.classType.",
      "system.attributes.damage.magic.element.",
      "system.attributes.decay.magic.element.",
      "system.effect.checkinputmod.",
    ];
    for (const prefix of keyPrefixes) {
      if (effectKey.startsWith(prefix)) {
        return {
          keyA: prefix,
          keyB: effectKey.slice(prefix.length)
        };
      }
    }
    return null;
  }

  _getModParams(allEffects){
    let activeEffects = allEffects.filter(
      (effect) => effect.disabled === false
    );
    let effectsChange = activeEffects.map((effect) => {
      return effect.changes.map((change) => {
        return {
          key: change.key,
          value: Number(change.value),
          mode: change.mode,
        };
      });
    }).flat();

    const processingRules = [
      { key: "system.attributes.efhitmod", target: "totalhitmod", localize: "overview" },
      { key: "system.attributes.efdmod", target: "totaldmod", localize: "overview" },
      { key: "system.effect.efcvalue", target: "totalcmod", localize: "overview" },
      { key: "system.effect.efspellcvalue", target: "totalspcmod", localize: "overview" },
      { key: "system.lt", target: "totallt", localize: "overview" },
      { key: "system.cr", target: "totalcr", localize: "overview" },
      { key: "system.attributes.efwphalfmod", target: "totalwphalfmod", localize: "overview" },
      { key: "system.attributes.efsphalfmod", target: "totalsphalfmod", localize: "overview" },
      { key: "system.attributes.efdodgemod", target: "totaldodgemod", localize: "overview" },
      { key: "system.attributes.efppmod", target: "totalppmod", localize: "overview" },
      { key: "system.attributes.efmppmod", target: "totalmppmod", localize: "overview" },
      { key: "system.attributes.efdreduce", target: "totaldreduce", localize: "overview" },
      { key: "system.attributes.move.efmovemod", target: "totalmovemod", localize: "overview" },
      { key: "system.attributes.turnend.hpregenmod", target: "totalhpregenmod", localize: "overview" },
      { key: "system.attributes.turnend.mpregenmod", target: "totalmpregenmod", localize: "overview" },
      { key: "system.effect.vitres", target: "totalvitres", localize: "overview" },
      { key: "system.effect.mndres", target: "totalmndres", localize: "overview" },
      { key: "system.effect.init", target: "totalinit", localize: "overview" },
      { key: "system.effect.mknow", target: "totalmknow", localize: "overview" },
      { key: "system.effect.allck", target: "totalallck", localize: "overview" },
      { key: "system.effect.allsk", target: "totalallsk", localize: "overview" },
      { key: "system.hp.efhpmod", target: "totalhpmod", localize: "overview" },
      { key: "system.mp.efmpmod", target: "totalmpmod", localize: "overview" },
      { key: "system.abilities.dex.efvaluemodify", target: "totaldex", localize: "overview" },
      { key: "system.abilities.agi.efvaluemodify", target: "totalagi", localize: "overview" },
      { key: "system.abilities.str.efvaluemodify", target: "totalstr", localize: "overview" },
      { key: "system.abilities.vit.efvaluemodify", target: "totalvit", localize: "overview" },
      { key: "system.abilities.int.efvaluemodify", target: "totalint", localize: "overview" },
      { key: "system.abilities.mnd.efvaluemodify", target: "totalmnd", localize: "overview" },
      { key: "system.abilities.dex.efmodify", target: "totaldexmod", localize: "overview" },
      { key: "system.abilities.agi.efmodify", target: "totalagimod", localize: "overview" },
      { key: "system.abilities.str.efmodify", target: "totalstrmod", localize: "overview" },
      { key: "system.abilities.vit.efmodify", target: "totalvitmod", localize: "overview" },
      { key: "system.abilities.int.efmodify", target: "totalintmod", localize: "overview" },
      { key: "system.abilities.mnd.efmodify", target: "totalmndmod", localize: "overview" },
      { key: "system.attributes.efscmod", target: "totalscmod", localize: "overview" },
      { key: "system.attributes.efcnmod", target: "totalcnmod", localize: "overview" },
      { key: "system.attributes.efwzmod", target: "totalwzmod", localize: "overview" },
      { key: "system.attributes.efprmod", target: "totalprmod", localize: "overview" },
      { key: "system.attributes.efmtmod", target: "totalmtmod", localize: "overview" },
      { key: "system.attributes.effrmod", target: "totalfrmod", localize: "overview" },
      { key: "system.attributes.efdrmod", target: "totaldrmod", localize: "overview" },
      { key: "system.attributes.efdmmod", target: "totaldmmod", localize: "overview" },
      { key: "system.attributes.efabmod", target: "totalabmod", localize: "overview" },
      { key: "system.attributes.efscckmod", target: "totalscckmod", localize: "overview" },
      { key: "system.attributes.efcnckmod", target: "totalcnckmod", localize: "overview" },
      { key: "system.attributes.efwzckmod", target: "totalwzckmod", localize: "overview" },
      { key: "system.attributes.efprckmod", target: "totalprckmod", localize: "overview" },
      { key: "system.attributes.efmtckmod", target: "totalmtckmod", localize: "overview" },
      { key: "system.attributes.effrckmod", target: "totalfrckmod", localize: "overview" },
      { key: "system.attributes.efdrckmod", target: "totaldrckmod", localize: "overview" },
      { key: "system.attributes.efdmckmod", target: "totaldmckmod", localize: "overview" },
      { key: "system.attributes.efabckmod", target: "totalabckmod", localize: "overview" },
      { key: "system.attributes.efscpwmod", target: "totalscpwmod", localize: "overview" },
      { key: "system.attributes.efcnpwmod", target: "totalcnpwmod", localize: "overview" },
      { key: "system.attributes.efwzpwmod", target: "totalwzpwmod", localize: "overview" },
      { key: "system.attributes.efprpwmod", target: "totalprpwmod", localize: "overview" },
      { key: "system.attributes.efmtpwmod", target: "totalmtpwmod", localize: "overview" },
      { key: "system.attributes.effrpwmod", target: "totalfrpwmod", localize: "overview" },
      { key: "system.attributes.efdrpwmod", target: "totaldrpwmod", localize: "overview" },
      { key: "system.attributes.efdmpwmod", target: "totaldmpwmod", localize: "overview" },
      { key: "system.attributes.efabpwmod", target: "totalabpwmod", localize: "overview" },
      { key: "system.effect.allmgp", target: "totalallmgp", localize: "overview" },
      { key: "system.attributes.efmpsc", target: "totalmpsc", localize: "overview" },
      { key: "system.attributes.efmpcn", target: "totalmpcn", localize: "overview" },
      { key: "system.attributes.efmpwz", target: "totalmpwz", localize: "overview" },
      { key: "system.attributes.efmppr", target: "totalmppr", localize: "overview" },
      { key: "system.attributes.efmpmt", target: "totalmpmt", localize: "overview" },
      { key: "system.attributes.efmpfr", target: "totalmpfr", localize: "overview" },
      { key: "system.attributes.efmpdr", target: "totalmpdr", localize: "overview" },
      { key: "system.attributes.efmpdm", target: "totalmpdm", localize: "overview" },
      { key: "system.attributes.efmpab", target: "totalmpab", localize: "overview" },
      { key: "system.attributes.efmpall", target: "totalmpall", localize: "overview" },
      { key: "system.attributes.efmckall", target: "totalallmck", localize: "overview" },
      { key: "system.attributes.efmpwall", target: "totalallmpw", localize: "overview" },
      { key: "system.attributes.efmsckmod", target: "totalmsckmod", localize: "overview" },
      { key: "system.attributes.efmspwmod", target: "totalmspwmod", localize: "overview" },
      { key: "system.attributes.efatckmod", target: "totalatckmod", localize: "overview" },
      { key: "system.attributes.efewckmod", target: "totalewckmod", localize: "overview" },
      { key: "system.attributes.efewpwmod", target: "totalewpwmod", localize: "overview" },
      { key: "system.eflootmod", target: "totallootmod", localize: "overview" },
      { key: "system.effect.package.fine", target: "totalfinechkmod", localize: "overview" },
      { key: "system.effect.package.move", target: "totalmovechkmod", localize: "overview" },
      { key: "system.effect.package.obse", target: "totalobsechkmod", localize: "overview" },
      { key: "system.effect.package.know", target: "totalknowchkmod", localize: "overview" },
      { key: "system.attributes.powertablemod.weapon", target: "ptmodweapon", localize: "overview" },
      { key: "system.attributes.powertablemod.armor", target: "ptmodarmor", localize: "overview" },
      { key: "system.attributes.powertablemod.accessory", target: "ptmodaccessory", localize: "overview" },
      { key: "system.attributes.powertablemod.item", target: "ptmoditem", localize: "overview" },
      { key: "system.attributes.powertablemod.spell", target: "ptmodspell", localize: "overview" },
      { key: "system.attributes.powertablemod.enhancearts", target: "ptmodenhancearts", localize: "overview" },
      { key: "system.attributes.powertablemod.magicalsong", target: "ptmodmagicalsong", localize: "overview" },
      { key: "system.attributes.powertablemod.ridingtrick", target: "ptmodridingtrick", localize: "overview" },
      { key: "system.attributes.powertablemod.alchemytech", target: "ptmodalchemytech", localize: "overview" },
      { key: "system.attributes.powertablemod.phasearea", target: "ptmodphasearea", localize: "overview" },
      { key: "system.attributes.powertablemod.tactics", target: "ptmodtactics", localize: "overview" },
      { key: "system.attributes.powertablemod.infusion", target: "ptmodinfusion", localize: "overview" },
      { key: "system.attributes.powertablemod.barbarousskill", target: "ptmodbarbarousskill", localize: "overview" },
      { key: "system.attributes.powertablemod.essenceweave", target: "ptmodessenceweave", localize: "overview" },
      { key: "system.attributes.powertablemod.skill", target: "ptmodskill", localize: "overview" },
      { key: "system.attributes.powertablemod.raceability", target: "ptmodraceability", localize: "overview" },
      { key: "system.attributes.powertablemod.otherfeature", target: "ptmodotherfeature", localize: "overview" },
      { key: "system.attributes.powertablemod.monsterability", target: "ptmodmonsterability", localize: "overview" },
      { key: "system.attributes.powertablemod.action", target: "ptmodaction", localize: "overview" },
      { key: "system.attributes.powertablemod.all", target: "ptmodall", localize: "overview" },
      { key: "system.attributes.damage.physical.classType.", target: "classPdamage", localize: "key-overview" },
      { key: "system.attributes.decay.physical.classType.", target: "classPdecay", localize: "key-overview" },
      { key: "system.attributes.damage.physical.element.", target: "elementPdamage", localize: "key-overview" },
      { key: "system.attributes.decay.physical.element.", target: "elementPdecay", localize: "key-overview" },
      { key: "system.attributes.damage.magic.classType.", target: "classMdamage", localize: "key-overview" },
      { key: "system.attributes.decay.magic.classType.", target: "classMdecay", localize: "key-overview" },
      { key: "system.attributes.damage.magic.element.", target: "elementMdamage", localize: "key-overview" },
      { key: "system.attributes.decay.magic.element.", target: "elementMDecay", localize: "key-overview" },
      { key: "system.effect.checkinputmod.", target: "checkinputmod", localize: "key" },
    ];

    let modParams = {};
    let ruleMap = Object.fromEntries(
      processingRules.map((rule) => [rule.key, rule])
    );

    effectsChange.sort((a, b) => a.mode - b.mode);
    effectsChange.forEach((effects) => {
      const keys = this._splitEffectKey(effects.key);
      let rule = keys != null ? ruleMap[keys.keyA] : ruleMap[effects.key];
      if (rule) {
        let value = Number(effects.value);
        let path = keys ? rule.target + keys.keyB.replaceAll(".", "") : rule.target;
        let currentValue = foundry.utils.getProperty(modParams, `${path}.value`);
        if (currentValue === undefined) {
          currentValue = 0;
        }

        let newValue = currentValue;
        switch (effects.mode) {
          case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
            newValue = Number(currentValue) * value;
            break;

          case CONST.ACTIVE_EFFECT_MODES.ADD:
            newValue = Number(currentValue) + value;
            break;
  
          case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
            newValue = value;
            break;
  
          case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
          case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
          case CONST.ACTIVE_EFFECT_MODES.CUSTOM:
            //未実装
            break;
  
          default:
            break;
        }
        foundry.utils.setProperty(modParams, `${path}.value`, newValue);
        
        if (rule.localize) {
          let label;
          if( rule.localize === "key" )
            label = keys.keyB
          else if( rule.localize === "key-overview" )
            label = game.i18n.localize("SW25.Effect.Overview." + rule.key + keys.keyB);
          else
            label = game.i18n.localize("SW25.Effect.Overview." + rule.key);
          foundry.utils.setProperty(modParams, `${path}.label`, label);
        }
      }
    });

    return modParams;
  }
}
