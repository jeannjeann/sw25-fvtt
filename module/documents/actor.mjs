import { effectInitPC } from "../sw25.mjs";
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
    const flags = actorData.flags.sw25 || {};

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
        ability.racevalue +
        ability.valuebase +
        ability.valuegrowth +
        ability.valuemodify +
        ability.efvaluemodify;
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
    systemData.attributes.move.normal =
      Number(systemData.abilities.agi.value) +
      Number(systemData.attributes.move.movemod) +
      Number(systemData.attributes.move.efmovemod);
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
          systemData.itempowertable[16] += systemData.lt;
          if (!/^f\d+$/.test(systemData.itempowertable[17])) {
            systemData.itempowertable[17] =
              Number(systemData.itempowertable[17]) + systemData.cr;
          }
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
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.dodgeskill) {
          systemData.skillagidodge = Number(item.system.skillbase.aginef);
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
          systemData.scbase = item.system.skillbase.intnef;
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
          systemData.cnbase = item.system.skillbase.intnef;
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
          systemData.wzbase = item.system.skillbase.intnef;
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
          systemData.prbase = item.system.skillbase.intnef;
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
          systemData.mtbase = item.system.skillbase.intnef;
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
          systemData.frbase = item.system.skillbase.intnef;
          let skillLevel = item.system.skilllevel ? item.system.skilllevel : 0;

          let fairyCount = 0;
          if(systemData.attributes.fairy.earth){
            fairyCount++;
          }
          if(systemData.attributes.fairy.water){
            fairyCount++;
          }
          if(systemData.attributes.fairy.fire){
            fairyCount++;
          }
          if(systemData.attributes.fairy.wind){
            fairyCount++;
          }
          if(systemData.attributes.fairy.light){
            fairyCount++;
          }
          if(systemData.attributes.fairy.dark){
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
          systemData.drbase = item.system.skillbase.intnef;
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
          systemData.dmbase = item.system.skillbase.intnef;
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
          systemData.abbase = item.system.skillbase.intnef;
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

    let totalhitmod = null;
    let totaldmod = null;
    let totalcmod = null;
    let totalspcmod = null;
    let totallt = null;
    let totalcr = null;
    let totalwphalfmod = null;
    let totalsphalfmod = null;
    let totaldodgemod = null;
    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalmovemod = null;
    let totalhpregenmod = null;
    let totalmpregenmod = null;
    let totalvitres = null;
    let totalmndres = null;
    let totalinit = null;
    let totalmknow = null;
    let totalallck = null;
    let totalallsk = null;
    let totalhpmod = null;
    let totalmpmod = null;
    let totaldex = null;
    let totalagi = null;
    let totalstr = null;
    let totalvit = null;
    let totalint = null;
    let totalmnd = null;
    let totaldexmod = null;
    let totalagimod = null;
    let totalstrmod = null;
    let totalvitmod = null;
    let totalintmod = null;
    let totalmndmod = null;
    let totalscmod = null;
    let totalcnmod = null;
    let totalwzmod = null;
    let totalprmod = null;
    let totalmtmod = null;
    let totalfrmod = null;
    let totaldrmod = null;
    let totaldmmod = null;
    let totalabmod = null;
    let totalscckmod = null;
    let totalcnckmod = null;
    let totalwzckmod = null;
    let totalprckmod = null;
    let totalmtckmod = null;
    let totalfrckmod = null;
    let totaldrckmod = null;
    let totaldmckmod = null;
    let totalabckmod = null;
    let totalscpwmod = null;
    let totalcnpwmod = null;
    let totalwzpwmod = null;
    let totalprpwmod = null;
    let totalmtpwmod = null;
    let totalfrpwmod = null;
    let totaldrpwmod = null;
    let totaldmpwmod = null;
    let totalabpwmod = null;
    let totalallmgp = null;
    let totalallmck = null;
    let totalallmpw = null;
    let totalmpsc = null;
    let totalmpcn = null;
    let totalmpwz = null;
    let totalmppr = null;
    let totalmpmt = null;
    let totalmpfr = null;
    let totalmpdr = null;
    let totalmpdm = null;
    let totalmpab = null;
    let totalmpall = null;
    let totalmsckmod = null;
    let totalmspwmod = null;
    let totalatckmod = null;
    let totalewckmod = null;
    let totalewpwmod = null;
    let totallootmod = null;
    let totalfinechkmod = null;
    let totalmovechkmod = null;
    let totalobsechkmod = null;
    let totalknowchkmod = null;
    
    const processingRules = [
      { key:"system.attributes.efhitmod", target:"totalhitmod" },
      { key:"system.attributes.efdmod", target:"totaldmod" },
      { key:"system.effect.efcvalue", target:"totalcmod" },
      { key:"system.effect.efspellcvalue", target:"totalspcmod" },
      { key:"system.lt", target:"totallt" },
      { key:"system.cr", target:"totalcr" },
      { key:"system.attributes.efwphalfmod", target:"totalwphalfmod" },
      { key:"system.attributes.efsphalfmod", target:"totalsphalfmod" },
      { key:"system.attributes.efdodgemod", target:"totaldodgemod" },
      { key:"system.attributes.efppmod", target:"totalppmod" },
      { key:"system.attributes.efmppmod", target:"totalmppmod" },
      { key:"system.attributes.efdreduce", target:"totaldreduce" },
      { key:"system.attributes.move.efmovemod", target:"totalmovemod" },
      { key:"system.attributes.turnend.hpregenmod", target:"totalhpregenmod" },
      { key:"system.attributes.turnend.mpregenmod", target:"totalmpregenmod" },
      { key:"system.effect.vitres", target:"totalvitres" },
      { key:"system.effect.mndres", target:"totalmndres" },
      { key:"system.effect.init", target:"totalinit" },
      { key:"system.effect.mknow", target:"totalmknow" },
      { key:"system.effect.allck", target:"totalallck" },
      { key:"system.effect.allsk", target:"totalallsk" },
      { key:"system.hp.efhpmod", target:"totalhpmod" },
      { key:"system.mp.efmpmod", target:"totalmpmod" },
      { key:"system.abilities.dex.efvaluemodify", target:"totaldex" },
      { key:"system.abilities.agi.efvaluemodify", target:"totalagi" },
      { key:"system.abilities.str.efvaluemodify", target:"totalstr" },
      { key:"system.abilities.vit.efvaluemodify", target:"totalvit" },
      { key:"system.abilities.int.efvaluemodify", target:"totalint" },
      { key:"system.abilities.mnd.efvaluemodify", target:"totalmnd" },
      { key:"system.abilities.dex.efmodify", target:"totaldexmod" },
      { key:"system.abilities.agi.efmodify", target:"totalagimod" },
      { key:"system.abilities.str.efmodify", target:"totalstrmod" },
      { key:"system.abilities.vit.efmodify", target:"totalvitmod" },
      { key:"system.abilities.int.efmodify", target:"totalintmod" },
      { key:"system.abilities.mnd.efmodify", target:"totalmndmod" },
      { key:"system.attributes.efscmod", target:"totalscmod" },
      { key:"system.attributes.efcnmod", target:"totalcnmod" },
      { key:"system.attributes.efwzmod", target:"totalwzmod" },
      { key:"system.attributes.efprmod", target:"totalprmod" },
      { key:"system.attributes.efmtmod", target:"totalmtmod" },
      { key:"system.attributes.effrmod", target:"totalfrmod" },
      { key:"system.attributes.efdrmod", target:"totaldrmod" },
      { key:"system.attributes.efdmmod", target:"totaldmmod" },
      { key:"system.attributes.efabmod", target:"totalabmod" },
      { key:"system.attributes.efscckmod", target:"totalscckmod" },
      { key:"system.attributes.efcnckmod", target:"totalcnckmod" },
      { key:"system.attributes.efwzckmod", target:"totalwzckmod" },
      { key:"system.attributes.efprckmod", target:"totalprckmod" },
      { key:"system.attributes.efmtckmod", target:"totalmtckmod" },
      { key:"system.attributes.effrckmod", target:"totalfrckmod" },
      { key:"system.attributes.efdrckmod", target:"totaldrckmod" },
      { key:"system.attributes.efdmckmod", target:"totaldmckmod" },
      { key:"system.attributes.efabckmod", target:"totalabckmod" },
      { key:"system.attributes.efscpwmod", target:"totalscpwmod" },
      { key:"system.attributes.efcnpwmod", target:"totalcnpwmod" },
      { key:"system.attributes.efwzpwmod", target:"totalwzpwmod" },
      { key:"system.attributes.efprpwmod", target:"totalprpwmod" },
      { key:"system.attributes.efmtpwmod", target:"totalmtpwmod" },
      { key:"system.attributes.effrpwmod", target:"totalfrpwmod" },
      { key:"system.attributes.efdrpwmod", target:"totaldrpwmod" },
      { key:"system.attributes.efdmpwmod", target:"totaldmpwmod" },
      { key:"system.attributes.efabpwmod", target:"totalabpwmod" },
      { key:"system.effect.allmgp", target:"totalallmgp" },
      { key:"system.attributes.efmpsc", target:"totalmpsc" },
      { key:"system.attributes.efmpcn", target:"totalmpcn" },
      { key:"system.attributes.efmpwz", target:"totalmpwz" },
      { key:"system.attributes.efmppr", target:"totalmppr" },
      { key:"system.attributes.efmpmt", target:"totalmpmt" },
      { key:"system.attributes.efmpfr", target:"totalmpfr" },
      { key:"system.attributes.efmpdr", target:"totalmpdr" },
      { key:"system.attributes.efmpdm", target:"totalmpdm" },
      { key:"system.attributes.efmpab", target:"totalmpab" },
      { key:"system.attributes.efmpall", target:"totalmpall" },
      { key:"system.attributes.efmckall", target:"totalallmck" },
      { key:"system.attributes.efmpwall", target:"totalallmpw" },
      { key:"system.attributes.efmsckmod", target:"totalmsckmod" },
      { key:"system.attributes.efmspwmod", target:"totalmspwmod" },
      { key:"system.attributes.efatckmod", target:"totalatckmod" },
      { key:"system.attributes.efewckmod", target:"totalewckmod" },
      { key:"system.attributes.efewpwmod", target:"totalewpwmod" },
      { key:"system.eflootmod", target:"totallootmod" },
      { key:"system.effect.package.fine", target:"totalfinechkmod" },
      { key:"system.effect.package.move", target:"totalmovechkmod" },
      { key:"system.effect.package.obse", target:"totalobsechkmod" },
      { key:"system.effect.package.know", target:"totalknowchkmod" }
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

    systemData.totalhitmod = totalhitmod;
    systemData.totaldmod = totaldmod;
    systemData.totalcmod = totalcmod;
    systemData.totalspcmod = totalspcmod;
    systemData.totallt = totallt;
    systemData.totalcr = totalcr;
    systemData.totalwphalfmod = totalwphalfmod;
    systemData.totalsphalfmod = totalsphalfmod;
    systemData.totaldodgemod = totaldodgemod;
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalmovemod = totalmovemod;
    systemData.totalhpregenmod = totalhpregenmod;
    systemData.totalmpregenmod = totalmpregenmod;
    systemData.totalvitres = totalvitres;
    systemData.totalmndres = totalmndres;
    systemData.totalinit = totalinit;
    systemData.totalmknow = totalmknow;
    systemData.totalallck = totalallck;
    systemData.totalallsk = totalallsk;
    systemData.totalhpmod = totalhpmod;
    systemData.totalmpmod = totalmpmod;
    systemData.totaldex = totaldex;
    systemData.totalagi = totalagi;
    systemData.totalstr = totalstr;
    systemData.totalvit = totalvit;
    systemData.totalint = totalint;
    systemData.totalmnd = totalmnd;
    systemData.totaldexmod = totaldexmod;
    systemData.totalagimod = totalagimod;
    systemData.totalstrmod = totalstrmod;
    systemData.totalvitmod = totalvitmod;
    systemData.totalintmod = totalintmod;
    systemData.totalmndmod = totalmndmod;
    systemData.totalscmod = totalscmod;
    systemData.totalcnmod = totalcnmod;
    systemData.totalwzmod = totalwzmod;
    systemData.totalprmod = totalprmod;
    systemData.totalmtmod = totalmtmod;
    systemData.totalfrmod = totalfrmod;
    systemData.totaldrmod = totaldrmod;
    systemData.totaldmmod = totaldmmod;
    systemData.totalabmod = totalabmod;
    systemData.totalscckmod = totalscckmod;
    systemData.totalcnckmod = totalcnckmod;
    systemData.totalwzckmod = totalwzckmod;
    systemData.totalprckmod = totalprckmod;
    systemData.totalmtckmod = totalmtckmod;
    systemData.totalfrckmod = totalfrckmod;
    systemData.totaldrckmod = totaldrckmod;
    systemData.totaldmckmod = totaldmckmod;
    systemData.totalabckmod = totalabckmod;
    systemData.totalscpwmod = totalscpwmod;
    systemData.totalcnpwmod = totalcnpwmod;
    systemData.totalwzpwmod = totalwzpwmod;
    systemData.totalprpwmod = totalprpwmod;
    systemData.totalmtpwmod = totalmtpwmod;
    systemData.totalfrpwmod = totalfrpwmod;
    systemData.totaldrpwmod = totaldrpwmod;
    systemData.totaldmpwmod = totaldmpwmod;
    systemData.totalabpwmod = totalabpwmod;
    systemData.totalallmgp = totalallmgp;
    systemData.totalallmck = totalallmck;
    systemData.totalallmpw = totalallmpw;
    systemData.totalmpsc = totalmpsc;
    systemData.totalmpcn = totalmpcn;
    systemData.totalmpwz = totalmpwz;
    systemData.totalmppr = totalmppr;
    systemData.totalmpmt = totalmpmt;
    systemData.totalmpfr = totalmpfr;
    systemData.totalmpdr = totalmpdr;
    systemData.totalmpdm = totalmpdm;
    systemData.totalmpab = totalmpab;
    systemData.totalmpall = totalmpall;
    systemData.totalmsckmod = totalmsckmod;
    systemData.totalmspwmod = totalmspwmod;
    systemData.totalatckmod = totalatckmod;
    systemData.totalewckmod = totalewckmod;
    systemData.totalewpwmod = totalewpwmod;
    systemData.totallootmod = totallootmod;
    systemData.totalfinechkmod = totalfinechkmod;
    systemData.totalmovechkmod = totalmovechkmod;
    systemData.totalobsechkmod = totalobsechkmod;
    systemData.totalknowchkmod = totalknowchkmod;
    if (totalhitmod > 0) systemData.totalhitmod = "+" + totalhitmod;
    if (totaldmod > 0) systemData.totaldmod = "+" + totaldmod;
    if (totalcmod > 0) systemData.totalcmod = "+" + totalcmod;
    if (totalspcmod > 0) systemData.totalspcmod = "+" + totalspcmod;
    if (totallt > 0) systemData.totallt = "+" + totallt;
    if (totalcr > 0) systemData.totalcr = "+" + totalcr;
    if (totalwphalfmod > 0) systemData.totalwphalfmod = "+" + totalwphalfmod;
    if (totalsphalfmod > 0) systemData.totalsphalfmod = "+" + totalsphalfmod;
    if (totaldodgemod > 0) systemData.totaldodgemod = "+" + totaldodgemod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalmovemod > 0) systemData.totalmovemod = "+" + totalmovemod;
    if (totalhpregenmod > 0) systemData.totalhpregenmod = "+" + totalhpregenmod;
    if (totalmpregenmod > 0) systemData.totalmpregenmod = "+" + totalmpregenmod;
    if (totalvitres > 0) systemData.totalvitres = "+" + totalvitres;
    if (totalmndres > 0) systemData.totalmndres = "+" + totalmndres;
    if (totalinit > 0) systemData.totalinit = "+" + totalinit;
    if (totalmknow > 0) systemData.totalmknow = "+" + totalmknow;
    if (totalallck > 0) systemData.totalallck = "+" + totalallck;
    if (totalallsk > 0) systemData.totalallsk = "+" + totalallsk;
    if (totalhpmod > 0) systemData.totalhpmod = "+" + totalhpmod;
    if (totalmpmod > 0) systemData.totalmpmod = "+" + totalmpmod;
    if (totaldex > 0) systemData.totaldex = "+" + totaldex;
    if (totalagi > 0) systemData.totalagi = "+" + totalagi;
    if (totalstr > 0) systemData.totalstr = "+" + totalstr;
    if (totalvit > 0) systemData.totalvit = "+" + totalvit;
    if (totalint > 0) systemData.totalint = "+" + totalint;
    if (totalmnd > 0) systemData.totalmnd = "+" + totalmnd;
    if (totaldexmod > 0) systemData.totaldexmod = "+" + totaldexmod;
    if (totalagimod > 0) systemData.totalagimod = "+" + totalagimod;
    if (totalstrmod > 0) systemData.totalstrmod = "+" + totalstrmod;
    if (totalvitmod > 0) systemData.totalvitmod = "+" + totalvitmod;
    if (totalintmod > 0) systemData.totalintmod = "+" + totalintmod;
    if (totalmndmod > 0) systemData.totalmndmod = "+" + totalmndmod;
    if (totalscmod > 0) systemData.totalscmod = "+" + totalscmod;
    if (totalcnmod > 0) systemData.totalcnmod = "+" + totalcnmod;
    if (totalwzmod > 0) systemData.totalwzmod = "+" + totalwzmod;
    if (totalprmod > 0) systemData.totalprmod = "+" + totalprmod;
    if (totalmtmod > 0) systemData.totalmtmod = "+" + totalmtmod;
    if (totalfrmod > 0) systemData.totalfrmod = "+" + totalfrmod;
    if (totaldrmod > 0) systemData.totaldrmod = "+" + totaldrmod;
    if (totaldmmod > 0) systemData.totaldmmod = "+" + totaldmmod;
    if (totalabmod > 0) systemData.totalabmod = "+" + totalabmod;
    if (totalscckmod > 0) systemData.totalscckmod = "+" + totalscckmod;
    if (totalcnckmod > 0) systemData.totalcnckmod = "+" + totalcnckmod;
    if (totalwzckmod > 0) systemData.totalwzckmod = "+" + totalwzckmod;
    if (totalprckmod > 0) systemData.totalprckmod = "+" + totalprckmod;
    if (totalmtckmod > 0) systemData.totalmtckmod = "+" + totalmtckmod;
    if (totalfrckmod > 0) systemData.totalfrckmod = "+" + totalfrckmod;
    if (totaldrckmod > 0) systemData.totaldrckmod = "+" + totaldrckmod;
    if (totaldmckmod > 0) systemData.totaldmckmod = "+" + totaldmckmod;
    if (totalabckmod > 0) systemData.totalabckmod = "+" + totalabckmod;
    if (totalscpwmod > 0) systemData.totalscpwmod = "+" + totalscpwmod;
    if (totalcnpwmod > 0) systemData.totalcnpwmod = "+" + totalcnpwmod;
    if (totalwzpwmod > 0) systemData.totalwzpwmod = "+" + totalwzpwmod;
    if (totalprpwmod > 0) systemData.totalprpwmod = "+" + totalprpwmod;
    if (totalmtpwmod > 0) systemData.totalmtpwmod = "+" + totalmtpwmod;
    if (totalfrpwmod > 0) systemData.totalfrpwmod = "+" + totalfrpwmod;
    if (totaldrpwmod > 0) systemData.totaldrpwmod = "+" + totaldrpwmod;
    if (totaldmpwmod > 0) systemData.totaldmpwmod = "+" + totaldmpwmod;
    if (totalabpwmod > 0) systemData.totalabpwmod = "+" + totalabpwmod;
    if (totalallmgp > 0) systemData.totalallmgp = "+" + totalallmgp;
    if (totalallmck > 0) systemData.totalallmck = "+" + totalallmck;
    if (totalallmpw > 0) systemData.totalallmpw = "+" + totalallmpw;
    if (totalmsckmod > 0) systemData.totalmsckmod = "+" + totalmsckmod;
    if (totalmspwmod > 0) systemData.totalmspwmod = "+" + totalmspwmod;
    if (totalatckmod > 0) systemData.totalatckmod = "+" + totalatckmod;
    if (totalewckmod > 0) systemData.totalewckmod = "+" + totalewckmod;
    if (totalewpwmod > 0) systemData.totalewpwmod = "+" + totalewpwmod;
    if (totallootmod > 0) systemData.totallootmod = "+" + totallootmod;
    if (totalfinechkmod > 0) systemData.totalfinechkmod = "+" + totalfinechkmod;
    if (totalmovechkmod > 0) systemData.totalmovechkmod = "+" + totalmovechkmod;
    if (totalobsechkmod > 0) systemData.totalobsechkmod = "+" + totalobsechkmod;
    if (totalknowchkmod > 0) systemData.totalknowchkmod = "+" + totalknowchkmod;

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
      Math.floor((systemData.abilities?.vit?.efvaluemodify ?? 0) / 6);
    systemData.mp.max =
      Number(systemData.mpbase) +
      Number(systemData.mp.mpmod) +
      Number(systemData.mp.efmpmod) +
      Math.floor((systemData.abilities?.mnd?.efvaluemodify ?? 0) / 6);
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

    let totalhitmod = null;
    let totaldmod = null;
    let totalcmod = null;
    let totalspcmod = null;
    let totallt = null;
    let totalcr = null;
    let totalwphalfmod = null;
    let totalsphalfmod = null;
    let totaldodgemod = null;
    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalmovemod = null;
    let totalhpregenmod = null;
    let totalmpregenmod = null;
    let totalvitres = null;
    let totalmndres = null;
    let totalinit = null;
    let totalmknow = null;
    let totalallck = null;
    let totalallsk = null;
    let totalhpmod = null;
    let totalmpmod = null;
    let totaldex = null;
    let totalagi = null;
    let totalstr = null;
    let totalvit = null;
    let totalint = null;
    let totalmnd = null;
    let totaldexmod = null;
    let totalagimod = null;
    let totalstrmod = null;
    let totalvitmod = null;
    let totalintmod = null;
    let totalmndmod = null;
    let totalscmod = null;
    let totalcnmod = null;
    let totalwzmod = null;
    let totalprmod = null;
    let totalmtmod = null;
    let totalfrmod = null;
    let totaldrmod = null;
    let totaldmmod = null;
    let totalabmod = null;
    let totalscckmod = null;
    let totalcnckmod = null;
    let totalwzckmod = null;
    let totalprckmod = null;
    let totalmtckmod = null;
    let totalfrckmod = null;
    let totaldrckmod = null;
    let totaldmckmod = null;
    let totalabckmod = null;
    let totalscpwmod = null;
    let totalcnpwmod = null;
    let totalwzpwmod = null;
    let totalprpwmod = null;
    let totalmtpwmod = null;
    let totalfrpwmod = null;
    let totaldrpwmod = null;
    let totaldmpwmod = null;
    let totalabpwmod = null;
    let totalallmgp = null;
    let totalallmck = null;
    let totalallmpw = null;
    let totalmpsc = null;
    let totalmpcn = null;
    let totalmpwz = null;
    let totalmppr = null;
    let totalmpmt = null;
    let totalmpfr = null;
    let totalmpdr = null;
    let totalmpdm = null;
    let totalmpab = null;
    let totalmpall = null;
    let totalmsckmod = null;
    let totalmspwmod = null;
    let totalatckmod = null;
    let totalewckmod = null;
    let totalewpwmod = null;
    let totallootmod = null;
    const processingRules = [
      { key: "system.attributes.efhitmod", target: "totalhitmod" },
      { key: "system.attributes.efdmod", target: "totaldmod" },
      { key: "system.effect.efcvalue", target: "totalcmod" },
      { key: "system.effect.efspellcvalue", target: "totalspcmod" },
      { key: "system.lt", target: "totallt" },
      { key: "system.cr", target: "totalcr" },
      { key: "system.attributes.efwphalfmod", target: "totalwphalfmod" },
      { key: "system.attributes.efsphalfmod", target: "totalsphalfmod" },
      { key: "system.attributes.efdodgemod", target: "totaldodgemod" },
      { key: "system.attributes.efppmod", target: "totalppmod" },
      { key: "system.attributes.efmppmod", target: "totalmppmod" },
      { key: "system.attributes.efdreduce", target: "totaldreduce" },
      { key: "system.attributes.move.efmovemod", target: "totalmovemod" },
      { key: "system.attributes.turnend.hpregenmod", target: "totalhpregenmod" },
      { key: "system.attributes.turnend.mpregenmod", target: "totalmpregenmod" },
      { key: "system.effect.vitres", target: "totalvitres" },
      { key: "system.effect.mndres", target: "totalmndres" },
      { key: "system.effect.init", target: "totalinit" },
      { key: "system.effect.mknow", target: "totalmknow" },
      { key: "system.effect.allck", target: "totalallck" },
      { key: "system.effect.allsk", target: "totalallsk" },
      { key: "system.hp.efhpmod", target: "totalhpmod" },
      { key: "system.mp.efmpmod", target: "totalmpmod" },
      { key: "system.abilities.dex.efvaluemodify", target: "totaldex" },
      { key: "system.abilities.agi.efvaluemodify", target: "totalagi" },
      { key: "system.abilities.str.efvaluemodify", target: "totalstr" },
      { key: "system.abilities.vit.efvaluemodify", target: "totalvit" },
      { key: "system.abilities.int.efvaluemodify", target: "totalint" },
      { key: "system.abilities.mnd.efvaluemodify", target: "totalmnd" },
      { key: "system.abilities.dex.efmodify", target: "totaldexmod" },
      { key: "system.abilities.agi.efmodify", target: "totalagimod" },
      { key: "system.abilities.str.efmodify", target: "totalstrmod" },
      { key: "system.abilities.vit.efmodify", target: "totalvitmod" },
      { key: "system.abilities.int.efmodify", target: "totalintmod" },
      { key: "system.abilities.mnd.efmodify", target: "totalmndmod" },
      { key: "system.attributes.efscmod", target: "totalscmod" },
      { key: "system.attributes.efcnmod", target: "totalcnmod" },
      { key: "system.attributes.efwzmod", target: "totalwzmod" },
      { key: "system.attributes.efprmod", target: "totalprmod" },
      { key: "system.attributes.efmtmod", target: "totalmtmod" },
      { key: "system.attributes.effrmod", target: "totalfrmod" },
      { key: "system.attributes.efdrmod", target: "totaldrmod" },
      { key: "system.attributes.efdmmod", target: "totaldmmod" },
      { key: "system.attributes.efabmod", target: "totalabmod" },
      { key: "system.attributes.efscckmod", target: "totalscckmod" },
      { key: "system.attributes.efcnckmod", target: "totalcnckmod" },
      { key: "system.attributes.efwzckmod", target: "totalwzckmod" },
      { key: "system.attributes.efprckmod", target: "totalprckmod" },
      { key: "system.attributes.efmtckmod", target: "totalmtckmod" },
      { key: "system.attributes.effrckmod", target: "totalfrckmod" },
      { key: "system.attributes.efdrckmod", target: "totaldrckmod" },
      { key: "system.attributes.efdmckmod", target: "totaldmckmod" },
      { key: "system.attributes.efabckmod", target: "totalabckmod" },
      { key: "system.attributes.efscpwmod", target: "totalscpwmod" },
      { key: "system.attributes.efcnpwmod", target: "totalcnpwmod" },
      { key: "system.attributes.efwzpwmod", target: "totalwzpwmod" },
      { key: "system.attributes.efprpwmod", target: "totalprpwmod" },
      { key: "system.attributes.efmtpwmod", target: "totalmtpwmod" },
      { key: "system.attributes.effrpwmod", target: "totalfrpwmod" },
      { key: "system.attributes.efdrpwmod", target: "totaldrpwmod" },
      { key: "system.attributes.efdmpwmod", target: "totaldmpwmod" },
      { key: "system.attributes.efabpwmod", target: "totalabpwmod" },
      { key: "system.effect.allmgp", target: "totalallmgp" },
      { key: "system.attributes.efmpsc", target: "totalmpsc" },
      { key: "system.attributes.efmpcn", target: "totalmpcn" },
      { key: "system.attributes.efmpwz", target: "totalmpwz" },
      { key: "system.attributes.efmppr", target: "totalmppr" },
      { key: "system.attributes.efmpmt", target: "totalmpmt" },
      { key: "system.attributes.efmpfr", target: "totalmpfr" },
      { key: "system.attributes.efmpdr", target: "totalmpdr" },
      { key: "system.attributes.efmpdm", target: "totalmpdm" },
      { key: "system.attributes.efmpab", target: "totalmpab" },
      { key: "system.attributes.efmpall", target: "totalmpall" },
      { key: "system.attributes.efmckall", target: "totalallmck" },
      { key: "system.attributes.efmpwall", target: "totalallmpw" },
      { key: "system.attributes.efmsckmod", target: "totalmsckmod" },
      { key: "system.attributes.efmspwmod", target: "totalmspwmod" },
      { key: "system.attributes.efatckmod", target: "totalatckmod" },
      { key: "system.attributes.efewckmod", target: "totalewckmod" },
      { key: "system.attributes.efewpwmod", target: "totalewpwmod" },
      { key: "system.eflootmod", target: "totallootmod" }
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

    // Convert Status Monster Parameter.
    totalhitmod += Math.floor((totaldex ?? 0) / 6) + (totaldexmod ?? 0);
    totaldmod += Math.floor((totalstr ?? 0) / 6) + (totalstrmod ?? 0);
    totaldodgemod += Math.floor((totalagi ?? 0) / 6) + (totalagimod ?? 0);
    totalvitres += Math.floor((totalvit ?? 0) / 6) + (totalvitmod ?? 0);
    totalmndres += Math.floor((totalmnd ?? 0) / 6) + (totalmndmod ?? 0);
    totalmovemod += (totalagi ?? 0);
    totalinit += Math.floor((totalagi ?? 0) / 6) + (totalagimod ?? 0);
    totalhpmod += (totalvit ?? 0);
    totalmpmod += (totalmnd ?? 0);
    totalallmgp += Math.floor((totalint ?? 0) / 6) + (totalintmod ?? 0);
    
    systemData.totalhitmod = totalhitmod;
    systemData.totaldmod = totaldmod;
    systemData.totalcmod = totalcmod;
    systemData.totalspcmod = totalspcmod;
    systemData.totallt = totallt;
    systemData.totalcr = totalcr;
    systemData.totalwphalfmod = totalwphalfmod;
    systemData.totalsphalfmod = totalsphalfmod;
    systemData.totaldodgemod = totaldodgemod;
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalmovemod = totalmovemod;
    systemData.totalhpregenmod = totalhpregenmod;
    systemData.totalmpregenmod = totalmpregenmod;
    systemData.totalvitres = totalvitres;
    systemData.totalmndres = totalmndres;
    systemData.totalinit = totalinit;
    systemData.totalmknow = totalmknow;
    systemData.totalallck = totalallck;
    systemData.totalallsk = totalallsk;
    systemData.totalhpmod = totalhpmod;
    systemData.totalmpmod = totalmpmod;
    systemData.totaldex = totaldex;
    systemData.totalagi = totalagi;
    systemData.totalstr = totalstr;
    systemData.totalvit = totalvit;
    systemData.totalint = totalint;
    systemData.totalmnd = totalmnd;
    systemData.totaldexmod = totaldexmod;
    systemData.totalagimod = totalagimod;
    systemData.totalstrmod = totalstrmod;
    systemData.totalvitmod = totalvitmod;
    systemData.totalintmod = totalintmod;
    systemData.totalmndmod = totalmndmod;
    systemData.totalscmod = totalscmod;
    systemData.totalcnmod = totalcnmod;
    systemData.totalwzmod = totalwzmod;
    systemData.totalprmod = totalprmod;
    systemData.totalmtmod = totalmtmod;
    systemData.totalfrmod = totalfrmod;
    systemData.totaldrmod = totaldrmod;
    systemData.totaldmmod = totaldmmod;
    systemData.totalabmod = totalabmod;
    systemData.totalscckmod = totalscckmod;
    systemData.totalcnckmod = totalcnckmod;
    systemData.totalwzckmod = totalwzckmod;
    systemData.totalprckmod = totalprckmod;
    systemData.totalmtckmod = totalmtckmod;
    systemData.totalfrckmod = totalfrckmod;
    systemData.totaldrckmod = totaldrckmod;
    systemData.totaldmckmod = totaldmckmod;
    systemData.totalabckmod = totalabckmod;
    systemData.totalscpwmod = totalscpwmod;
    systemData.totalcnpwmod = totalcnpwmod;
    systemData.totalwzpwmod = totalwzpwmod;
    systemData.totalprpwmod = totalprpwmod;
    systemData.totalmtpwmod = totalmtpwmod;
    systemData.totalfrpwmod = totalfrpwmod;
    systemData.totaldrpwmod = totaldrpwmod;
    systemData.totaldmpwmod = totaldmpwmod;
    systemData.totalabpwmod = totalabpwmod;
    systemData.totalallmgp = totalallmgp;
    systemData.totalallmck = totalallmck;
    systemData.totalallmpw = totalallmpw;
    systemData.totalmpsc = totalmpsc;
    systemData.totalmpcn = totalmpcn;
    systemData.totalmpwz = totalmpwz;
    systemData.totalmppr = totalmppr;
    systemData.totalmpmt = totalmpmt;
    systemData.totalmpfr = totalmpfr;
    systemData.totalmpdr = totalmpdr;
    systemData.totalmpdm = totalmpdm;
    systemData.totalmpab = totalmpab;
    systemData.totalmpall = totalmpall;
    systemData.totalmsckmod = totalmsckmod;
    systemData.totalmspwmod = totalmspwmod;
    systemData.totalatckmod = totalatckmod;
    systemData.totalewckmod = totalewckmod;
    systemData.totalewpwmod = totalewpwmod;
    systemData.totallootmod = totallootmod;
    if (totalhitmod > 0) systemData.totalhitmod = "+" + totalhitmod;
    if (totaldmod > 0) systemData.totaldmod = "+" + totaldmod;
    if (totalcmod > 0) systemData.totalcmod = "+" + totalcmod;
    if (totalspcmod > 0) systemData.totalspcmod = "+" + totalspcmod;
    if (totallt > 0) systemData.totallt = "+" + totallt;
    if (totalcr > 0) systemData.totalcr = "+" + totalcr;
    if (totalwphalfmod > 0) systemData.totalwphalfmod = "+" + totalwphalfmod;
    if (totalsphalfmod > 0) systemData.totalsphalfmod = "+" + totalsphalfmod;
    if (totaldodgemod > 0) systemData.totaldodgemod = "+" + totaldodgemod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalmovemod > 0) systemData.totalmovemod = "+" + totalmovemod;
    if (totalhpregenmod > 0) systemData.totalhpregenmod = "+" + totalhpregenmod;
    if (totalmpregenmod > 0) systemData.totalmpregenmod = "+" + totalmpregenmod;
    if (totalvitres > 0) systemData.totalvitres = "+" + totalvitres;
    if (totalmndres > 0) systemData.totalmndres = "+" + totalmndres;
    if (totalinit > 0) systemData.totalinit = "+" + totalinit;
    if (totalmknow > 0) systemData.totalmknow = "+" + totalmknow;
    if (totalallck > 0) systemData.totalallck = "+" + totalallck;
    if (totalallsk > 0) systemData.totalallsk = "+" + totalallsk;
    if (totalhpmod > 0) systemData.totalhpmod = "+" + totalhpmod;
    if (totalmpmod > 0) systemData.totalmpmod = "+" + totalmpmod;
    if (totaldex > 0) systemData.totaldex = "+" + totaldex;
    if (totalagi > 0) systemData.totalagi = "+" + totalagi;
    if (totalstr > 0) systemData.totalstr = "+" + totalstr;
    if (totalvit > 0) systemData.totalvit = "+" + totalvit;
    if (totalint > 0) systemData.totalint = "+" + totalint;
    if (totalmnd > 0) systemData.totalmnd = "+" + totalmnd;
    if (totaldexmod > 0) systemData.totaldexmod = "+" + totaldexmod;
    if (totalagimod > 0) systemData.totalagimod = "+" + totalagimod;
    if (totalstrmod > 0) systemData.totalstrmod = "+" + totalstrmod;
    if (totalvitmod > 0) systemData.totalvitmod = "+" + totalvitmod;
    if (totalintmod > 0) systemData.totalintmod = "+" + totalintmod;
    if (totalmndmod > 0) systemData.totalmndmod = "+" + totalmndmod;
    if (totalscmod > 0) systemData.totalscmod = "+" + totalscmod;
    if (totalcnmod > 0) systemData.totalcnmod = "+" + totalcnmod;
    if (totalwzmod > 0) systemData.totalwzmod = "+" + totalwzmod;
    if (totalprmod > 0) systemData.totalprmod = "+" + totalprmod;
    if (totalmtmod > 0) systemData.totalmtmod = "+" + totalmtmod;
    if (totalfrmod > 0) systemData.totalfrmod = "+" + totalfrmod;
    if (totaldrmod > 0) systemData.totaldrmod = "+" + totaldrmod;
    if (totaldmmod > 0) systemData.totaldmmod = "+" + totaldmmod;
    if (totalabmod > 0) systemData.totalabmod = "+" + totalabmod;
    if (totalscckmod > 0) systemData.totalscckmod = "+" + totalscckmod;
    if (totalcnckmod > 0) systemData.totalcnckmod = "+" + totalcnckmod;
    if (totalwzckmod > 0) systemData.totalwzckmod = "+" + totalwzckmod;
    if (totalprckmod > 0) systemData.totalprckmod = "+" + totalprckmod;
    if (totalmtckmod > 0) systemData.totalmtckmod = "+" + totalmtckmod;
    if (totalfrckmod > 0) systemData.totalfrckmod = "+" + totalfrckmod;
    if (totaldrckmod > 0) systemData.totaldrckmod = "+" + totaldrckmod;
    if (totaldmckmod > 0) systemData.totaldmckmod = "+" + totaldmckmod;
    if (totalabckmod > 0) systemData.totalabckmod = "+" + totalabckmod;
    if (totalscpwmod > 0) systemData.totalscpwmod = "+" + totalscpwmod;
    if (totalcnpwmod > 0) systemData.totalcnpwmod = "+" + totalcnpwmod;
    if (totalwzpwmod > 0) systemData.totalwzpwmod = "+" + totalwzpwmod;
    if (totalprpwmod > 0) systemData.totalprpwmod = "+" + totalprpwmod;
    if (totalmtpwmod > 0) systemData.totalmtpwmod = "+" + totalmtpwmod;
    if (totalfrpwmod > 0) systemData.totalfrpwmod = "+" + totalfrpwmod;
    if (totaldrpwmod > 0) systemData.totaldrpwmod = "+" + totaldrpwmod;
    if (totaldmpwmod > 0) systemData.totaldmpwmod = "+" + totaldmpwmod;
    if (totalabpwmod > 0) systemData.totalabpwmod = "+" + totalabpwmod;
    if (totalallmgp > 0) systemData.totalallmgp = "+" + totalallmgp;
    if (totalallmck > 0) systemData.totalallmck = "+" + totalallmck;
    if (totalallmpw > 0) systemData.totalallmpw = "+" + totalallmpw;
    if (totalmsckmod > 0) systemData.totalmsckmod = "+" + totalmsckmod;
    if (totalmspwmod > 0) systemData.totalmspwmod = "+" + totalmspwmod;
    if (totalatckmod > 0) systemData.totalatckmod = "+" + totalatckmod;
    if (totalewckmod > 0) systemData.totalewckmod = "+" + totalewckmod;
    if (totalewpwmod > 0) systemData.totalewpwmod = "+" + totalewpwmod;
    if (totallootmod > 0) systemData.totallootmod = "+" + totallootmod;

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
}
