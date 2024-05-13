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
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.value =
        ability.racevalue +
        ability.valuebase +
        ability.valuegrowth +
        ability.valuemodify;
      ability.mod = Math.floor(ability.value / 6);
      ability.advbase =
        ability.mod +
        systemData.attributes.advlevel.value +
        Number(systemData.attributes.advlevel.mod);
    }

    //Calculate HP & MP & Move
    systemData.hp.max =
      systemData.abilities.vit.value +
      systemData.attributes.advlevel.value * 3 +
      Number(systemData.hp.hpmod);
    systemData.mp.max =
      systemData.abilities.mnd.value +
      systemData.attributes.mglevel.value * 3 +
      Number(systemData.mp.mpmod);
    systemData.attributes.move.limited = 3;
    systemData.attributes.move.normal =
      systemData.abilities.agi.value +
      Number(systemData.attributes.move.movemod);
    systemData.attributes.move.max = systemData.attributes.move.normal * 3;
    if (systemData.attributes.move.normal < 3) {
      systemData.attributes.move.limited = systemData.attributes.move.normal;
    }

    //Calculate Battle Data
    await this.update({});
    this.items.forEach((item) => {
      if (item.type == "weapon") {
        if (item.name == systemData.hitweapon) {
          systemData.itemname = item.name;
          systemData.itemhitformula = item.system.checkformula;
          systemData.itemhitbase = item.system.checkbase;
          systemData.itempowerformula = item.system.powerformula;
          systemData.itempower = item.system.power;
          systemData.itemcvalue = item.system.cvalue;
          systemData.itempowerbase = item.system.powerbase;
          systemData.itempowertable = item.system.powertable;
        }
      }
    });
    systemData.itempowertable[16] += systemData.lt;
    systemData.itempowertable[17] += systemData.cr;

    systemData.itemdodge = 0;
    systemData.itempp = 0;
    systemData.barepp = 0;
    systemData.itemmpp = 0;
    systemData.barempp = 0;
    systemData.skillagidodge = 0;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.dodgeskill) {
          systemData.skillagidodge = Number(item.system.skillbase.agi);
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
      Number(systemData.attributes.dodgemod);
    systemData.attributes.protectionpoint =
      Number(systemData.itempp) +
      Number(systemData.attributes.ppmod) +
      Number(systemData.attributes.dreduce);
    systemData.barepp =
      Number(systemData.itempp) + Number(systemData.attributes.ppmod);
    systemData.attributes.magicprotection =
      Number(systemData.itemmpp) +
      Number(systemData.attributes.mppmod) +
      Number(systemData.attributes.dreduce);
    systemData.barempp =
      Number(systemData.itemmpp) + Number(systemData.attributes.mppmod);

    //Calculate Spell Data
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.scskill) {
          systemData.scbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.scpower =
      systemData.scbase + systemData.attributes.scmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.cnskill) {
          systemData.cnbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.cnpower =
      systemData.cnbase + systemData.attributes.cnmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.wzskill) {
          systemData.wzbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.wzpower =
      systemData.wzbase + systemData.attributes.wzmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.prskill) {
          systemData.prbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.prpower =
      systemData.prbase + systemData.attributes.prmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.mtskill) {
          systemData.mtbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.mtpower =
      systemData.mtbase + systemData.attributes.mtmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.frskill) {
          systemData.frbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.frpower =
      systemData.frbase + systemData.attributes.frmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.drskill) {
          systemData.drbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.drpower =
      systemData.drbase + systemData.attributes.drmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.drskill) {
          systemData.drbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.drpower =
      systemData.drbase + systemData.attributes.drmod;
    this.items.forEach((item) => {
      if (item.type == "skill") {
        if (item.name == systemData.dmskill) {
          systemData.dmbase = item.system.skillbase.int;
        }
      }
    });
    systemData.attributes.dmpower =
      systemData.dmbase + systemData.attributes.dmmod;

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
    let totallt = null;
    let totalcr = null;
    let totaldodgemod = null;
    let totalppmod = null;
    let totalmppmod = null;
    let totaldreduce = null;
    let totalhpmod = null;
    let totalmpmod = null;
    let totaldex = null;
    let totalagi = null;
    let totalstr = null;
    let totalvit = null;
    let totalint = null;
    let totalmnd = null;
    let totalmovemod = null;
    effectsChange.forEach((effectList) => {
      effectList.forEach((effects) => {
        if (effects.key == "system.attributes.hitmod")
          totalhitmod += Number(effects.value);
        if (effects.key == "system.attributes.dmod")
          totaldmod += Number(effects.value);
        if (effects.key == "system.lt") totallt += Number(effects.value);
        if (effects.key == "system.cr") totalcr += Number(effects.value);
        if (effects.key == "system.attributes.dodgemod")
          totaldodgemod += Number(effects.value);
        if (effects.key == "system.attributes.ppmod")
          totalppmod += Number(effects.value);
        if (effects.key == "system.attributes.mppmod")
          totalmppmod += Number(effects.value);
        if (effects.key == "system.attributes.dreduce")
          totaldreduce += Number(effects.value);
        if (effects.key == "system.hp.hpmod")
          totalhpmod += Number(effects.value);
        if (effects.key == "system.mp.mpmod")
          totalmpmod += Number(effects.value);
        if (effects.key == "system.abilities.dex.valuemodify")
          totaldex += Number(effects.value);
        if (effects.key == "system.abilities.agi.valuemodify")
          totalagi += Number(effects.value);
        if (effects.key == "system.abilities.str.valuemodify")
          totalstr += Number(effects.value);
        if (effects.key == "system.abilities.vit.valuemodify")
          totalvit += Number(effects.value);
        if (effects.key == "system.abilities.int.valuemodify")
          totalint += Number(effects.value);
        if (effects.key == "system.abilities.mnd.valuemodify")
          totalmnd += Number(effects.value);
        if (effects.key == "system.attributes.move.movemod")
          totalmovemod += Number(effects.value);
      });
    });

    systemData.totalhitmod = totalhitmod;
    systemData.totaldmod = totaldmod;
    systemData.totallt = totallt;
    systemData.totalcr = totalcr;
    systemData.totaldodgemod = totaldodgemod;
    systemData.totalppmod = totalppmod;
    systemData.totalmppmod = totalmppmod;
    systemData.totaldreduce = totaldreduce;
    systemData.totalhpmod = totalhpmod;
    systemData.totalmpmod = totalmpmod;
    systemData.totaldex = totaldex;
    systemData.totalagi = totalagi;
    systemData.totalstr = totalstr;
    systemData.totalvit = totalvit;
    systemData.totalint = totalint;
    systemData.totalmnd = totalmnd;
    systemData.totalmovemod = totalmovemod;
    if (totalhitmod > 0) systemData.totalhitmod = "+" + totalhitmod;
    if (totaldmod > 0) systemData.totaldmod = "+" + totaldmod;
    if (totallt > 0) systemData.totallt = "+" + totallt;
    if (totalcr > 0) systemData.totalcr = "+" + totalcr;
    if (totaldodgemod > 0) systemData.totaldodgemod = "+" + totaldodgemod;
    if (totalppmod > 0) systemData.totalppmod = "+" + totalppmod;
    if (totalmppmod > 0) systemData.totalmppmod = "+" + totalmppmod;
    if (totaldreduce > 0) systemData.totaldreduce = "+" + totaldreduce;
    if (totalhpmod > 0) systemData.totalhpmod = "+" + totalhpmod;
    if (totalmpmod > 0) systemData.totalmpmod = "+" + totalmpmod;
    if (totaldex > 0) systemData.totaldex = "+" + totaldex;
    if (totalagi > 0) systemData.totalagi = "+" + totalagi;
    if (totalstr > 0) systemData.totalstr = "+" + totalstr;
    if (totalvit > 0) systemData.totalvit = "+" + totalvit;
    if (totalint > 0) systemData.totalint = "+" + totalint;
    if (totalmnd > 0) systemData.totalmnd = "+" + totalmnd;
    if (totalmovemod > 0) systemData.totalmovemod = "+" + totalmovemod;

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
  _prepareMonsterData(actorData) {
    if (actorData.type !== "monster") return;

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
        systemData.udname = game.i18n.localize("SW25.Monster.Unidentifiedmon");
      }
      actorData.name = systemData.udname;
    } else systemData.limited = false;
    if (game.user.isGM === true) systemData.isgm = true;
    else systemData.isgm = false;

    // Make modifiy
    systemData.exp = systemData.monlevel * 10;

    if (systemData.impurity == 0 || systemData.impurity == null)
      systemData.showimp = false;
    else systemData.showimp = true;
    if (systemData.part == 0 || systemData.part == null)
      systemData.showpt = false;
    else systemData.showpt = true;
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
