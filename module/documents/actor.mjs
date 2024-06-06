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

    //Calculate Battle Data
    this.items.forEach((item) => {
      if (item.type == "weapon") {
        if (item.name == systemData.hitweapon) {
          systemData.itemname = item.name;
          systemData.itemhitformula = item.system.checkformula;
          systemData.itemhitbase = item.system.checkbase;
          systemData.itempowerformula = item.system.powerformula;
          systemData.itempower = item.system.power;
          if (item.system.cvalue == null || item.system.cvalue == 0)
            item.system.cvalue = 10;
          if (!systemData.effect) systemData.efcmod = 0;
          else if (systemData.effect.efcvalue)
            systemData.efcmod = Number(systemData.effect.efcvalue);
          else systemData.efcmod = 0;
          systemData.itemcvalue =
            Number(item.system.cvalue) + Number(systemData.efcmod);
          systemData.itempowerbase = item.system.powerbase;
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
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.frskill) {
          systemData.frbase = item.system.skillbase.intnef;
        }
      }
    });
    systemData.attributes.frpower =
      Number(systemData.frbase) +
      Number(systemData.attributes.frmod) +
      Number(systemData.attributes.effrmod) +
      Number(systemData.efallmgpacmod);
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
        };
      });
    });

    let totalhitmod = null;
    let totaldmod = null;
    let totalcmod = null;
    let totalspcmod = null;
    let totallt = null;
    let totalcr = null;
    let totaldodgemod = null;
    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalmovemod = null;
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
    let totalallmgp = null;
    effectsChange.forEach((effectList) => {
      effectList.forEach((effects) => {
        if (effects.key == "system.attributes.efhitmod")
          totalhitmod += Number(effects.value);
        if (effects.key == "system.attributes.efdmod")
          totaldmod += Number(effects.value);
        if (effects.key == "system.effect.efcvalue")
          totalcmod += Number(effects.value);
        if (effects.key == "system.effect.efspellcvalue")
          totalspcmod += Number(effects.value);
        if (effects.key == "system.lt") totallt += Number(effects.value);
        if (effects.key == "system.cr") totalcr += Number(effects.value);
        if (effects.key == "system.attributes.efdodgemod")
          totaldodgemod += Number(effects.value);
        if (effects.key == "system.attributes.efppmod")
          totalppmod += Number(effects.value);
        if (effects.key == "system.attributes.efmppmod")
          totalmppmod += Number(effects.value);
        if (effects.key == "system.attributes.efdreduce")
          totaldreduce += Number(effects.value);
        if (effects.key == "system.attributes.move.efmovemod")
          totalmovemod += Number(effects.value);
        if (effects.key == "system.effect.vitres")
          totalvitres += Number(effects.value);
        if (effects.key == "system.effect.mndres")
          totalmndres += Number(effects.value);
        if (effects.key == "system.effect.init")
          totalinit += Number(effects.value);
        if (effects.key == "system.effect.mknow")
          totalmknow += Number(effects.value);
        if (effects.key == "system.effect.allck")
          totalallck += Number(effects.value);
        if (effects.key == "system.effect.allsk")
          totalallsk += Number(effects.value);
        if (effects.key == "system.hp.efhpmod")
          totalhpmod += Number(effects.value);
        if (effects.key == "system.mp.efmpmod")
          totalmpmod += Number(effects.value);
        if (effects.key == "system.abilities.dex.efvaluemodify")
          totaldex += Number(effects.value);
        if (effects.key == "system.abilities.agi.efvaluemodify")
          totalagi += Number(effects.value);
        if (effects.key == "system.abilities.str.efvaluemodify")
          totalstr += Number(effects.value);
        if (effects.key == "system.abilities.vit.efvaluemodify")
          totalvit += Number(effects.value);
        if (effects.key == "system.abilities.int.efvaluemodify")
          totalint += Number(effects.value);
        if (effects.key == "system.abilities.mnd.efvaluemodify")
          totalmnd += Number(effects.value);
        if (effects.key == "system.abilities.dex.efmodify")
          totaldexmod += Number(effects.value);
        if (effects.key == "system.abilities.agi.efmodify")
          totalagimod += Number(effects.value);
        if (effects.key == "system.abilities.str.efmodify")
          totalstrmod += Number(effects.value);
        if (effects.key == "system.abilities.vit.efmodify")
          totalvitmod += Number(effects.value);
        if (effects.key == "system.abilities.int.efmodify")
          totalintmod += Number(effects.value);
        if (effects.key == "system.abilities.mnd.efmodify")
          totalmndmod += Number(effects.value);
        if (effects.key == "system.attributes.efscmod")
          totalscmod += Number(effects.value);
        if (effects.key == "system.attributes.efcnmod")
          totalcnmod += Number(effects.value);
        if (effects.key == "system.attributes.efwzmod")
          totalwzmod += Number(effects.value);
        if (effects.key == "system.attributes.efprmod")
          totalprmod += Number(effects.value);
        if (effects.key == "system.attributes.efmtmod")
          totalmtmod += Number(effects.value);
        if (effects.key == "system.attributes.effrmod")
          totalfrmod += Number(effects.value);
        if (effects.key == "system.attributes.efdrmod")
          totaldrmod += Number(effects.value);
        if (effects.key == "system.attributes.efdmmod")
          totaldmmod += Number(effects.value);
        if (effects.key == "system.effect.allmgp")
          totalallmgp += Number(effects.value);
      });
    });

    systemData.totalhitmod = totalhitmod;
    systemData.totaldmod = totaldmod;
    systemData.totalcmod = totalcmod;
    systemData.totalspcmod = totalspcmod;
    systemData.totallt = totallt;
    systemData.totalcr = totalcr;
    systemData.totaldodgemod = totaldodgemod;
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalmovemod = totalmovemod;
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
    systemData.totalallmgp = totalallmgp;
    if (totalhitmod > 0) systemData.totalhitmod = "+" + totalhitmod;
    if (totaldmod > 0) systemData.totaldmod = "+" + totaldmod;
    if (totalcmod > 0) systemData.totalcmod = "+" + totalcmod;
    if (totalspcmod > 0) systemData.totalspcmod = "+" + totalspcmod;
    if (totallt > 0) systemData.totallt = "+" + totallt;
    if (totalcr > 0) systemData.totalcr = "+" + totalcr;
    if (totaldodgemod > 0) systemData.totaldodgemod = "+" + totaldodgemod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalmovemod > 0) systemData.totalmovemod = "+" + totalmovemod;
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
    if (totalallmgp > 0) systemData.totalallmgp = "+" + totalallmgp;

    // Sheet refresh
    if (actorData.sheet.rendered)
      await actorData.sheet.render(true, { focus: false });
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== "npc") return;

    const systemData = actorData.system;

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
        };
      });
    });

    let totalhitmod = null;
    let totaldmod = null;
    let totalcmod = null;
    let totalspcmod = null;
    let totallt = null;
    let totalcr = null;
    let totaldodgemod = null;
    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalmovemod = null;
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
    let totalallmgp = null;
    effectsChange.forEach((effectList) => {
      effectList.forEach((effects) => {
        if (effects.key == "system.attributes.efhitmod")
          totalhitmod += Number(effects.value);
        if (effects.key == "system.attributes.efdmod")
          totaldmod += Number(effects.value);
        if (effects.key == "system.effect.efcvalue")
          totalcmod += Number(effects.value);
        if (effects.key == "system.effect.efspellcvalue")
          totalspcmod += Number(effects.value);
        if (effects.key == "system.lt") totallt += Number(effects.value);
        if (effects.key == "system.cr") totalcr += Number(effects.value);
        if (effects.key == "system.attributes.efdodgemod")
          totaldodgemod += Number(effects.value);
        if (effects.key == "system.attributes.efppmod")
          totalppmod += Number(effects.value);
        if (effects.key == "system.attributes.efmppmod")
          totalmppmod += Number(effects.value);
        if (effects.key == "system.attributes.efdreduce")
          totaldreduce += Number(effects.value);
        if (effects.key == "system.attributes.move.efmovemod")
          totalmovemod += Number(effects.value);
        if (effects.key == "system.effect.vitres")
          totalvitres += Number(effects.value);
        if (effects.key == "system.effect.mndres")
          totalmndres += Number(effects.value);
        if (effects.key == "system.effect.init")
          totalinit += Number(effects.value);
        if (effects.key == "system.effect.mknow")
          totalmknow += Number(effects.value);
        if (effects.key == "system.effect.allck")
          totalallck += Number(effects.value);
        if (effects.key == "system.effect.allsk")
          totalallsk += Number(effects.value);
        if (effects.key == "system.hp.efhpmod")
          totalhpmod += Number(effects.value);
        if (effects.key == "system.mp.efmpmod")
          totalmpmod += Number(effects.value);
        if (effects.key == "system.abilities.dex.efvaluemodify")
          totaldex += Number(effects.value);
        if (effects.key == "system.abilities.agi.efvaluemodify")
          totalagi += Number(effects.value);
        if (effects.key == "system.abilities.str.efvaluemodify")
          totalstr += Number(effects.value);
        if (effects.key == "system.abilities.vit.efvaluemodify")
          totalvit += Number(effects.value);
        if (effects.key == "system.abilities.int.efvaluemodify")
          totalint += Number(effects.value);
        if (effects.key == "system.abilities.mnd.efvaluemodify")
          totalmnd += Number(effects.value);
        if (effects.key == "system.abilities.dex.efmodify")
          totaldexmod += Number(effects.value);
        if (effects.key == "system.abilities.agi.efmodify")
          totalagimod += Number(effects.value);
        if (effects.key == "system.abilities.str.efmodify")
          totalstrmod += Number(effects.value);
        if (effects.key == "system.abilities.vit.efmodify")
          totalvitmod += Number(effects.value);
        if (effects.key == "system.abilities.int.efmodify")
          totalintmod += Number(effects.value);
        if (effects.key == "system.abilities.mnd.efmodify")
          totalmndmod += Number(effects.value);
        if (effects.key == "system.attributes.efscmod")
          totalscmod += Number(effects.value);
        if (effects.key == "system.attributes.efcnmod")
          totalcnmod += Number(effects.value);
        if (effects.key == "system.attributes.efwzmod")
          totalwzmod += Number(effects.value);
        if (effects.key == "system.attributes.efprmod")
          totalprmod += Number(effects.value);
        if (effects.key == "system.attributes.efmtmod")
          totalmtmod += Number(effects.value);
        if (effects.key == "system.attributes.effrmod")
          totalfrmod += Number(effects.value);
        if (effects.key == "system.attributes.efdrmod")
          totaldrmod += Number(effects.value);
        if (effects.key == "system.attributes.efdmmod")
          totaldmmod += Number(effects.value);
        if (effects.key == "system.effect.allmgp")
          totalallmgp += Number(effects.value);
      });
    });

    systemData.totalhitmod = totalhitmod;
    systemData.totaldmod = totaldmod;
    systemData.totalcmod = totalcmod;
    systemData.totalspcmod = totalspcmod;
    systemData.totallt = totallt;
    systemData.totalcr = totalcr;
    systemData.totaldodgemod = totaldodgemod;
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalmovemod = totalmovemod;
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
    systemData.totalallmgp = totalallmgp;
    if (totalhitmod > 0) systemData.totalhitmod = "+" + totalhitmod;
    if (totaldmod > 0) systemData.totaldmod = "+" + totaldmod;
    if (totalcmod > 0) systemData.totalcmod = "+" + totalcmod;
    if (totalspcmod > 0) systemData.totalspcmod = "+" + totalspcmod;
    if (totallt > 0) systemData.totallt = "+" + totallt;
    if (totalcr > 0) systemData.totalcr = "+" + totalcr;
    if (totaldodgemod > 0) systemData.totaldodgemod = "+" + totaldodgemod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalmovemod > 0) systemData.totalmovemod = "+" + totalmovemod;
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
    if (totalallmgp > 0) systemData.totalallmgp = "+" + totalallmgp;

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
