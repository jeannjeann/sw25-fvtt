// Chat button handler
import { powerRoll } from "./powerroll.mjs";
import { mpCost } from "./mpcost.mjs";
/**
 * Execute  chat button click event and return the result.
 */
export async function chatButton(chatMessage, buttonType) {
  const actorId = chatMessage.speaker.actor;
  const actor = game.actors.get(actorId);
  const itemId = chatMessage.flags.itemid;
  const item = actor.items.get(itemId);

  // Item roll button
  if (
    buttonType == "buttoncheck" ||
    buttonType == "buttoncheck1" ||
    buttonType == "buttoncheck2" ||
    buttonType == "buttoncheck3" ||
    buttonType == "buttonpower"
  ) {
    const label1 = item.system.label1;
    const label2 = item.system.label2;
    const label3 = item.system.label3;
    const labelmonpow = item.system.labelmonpow;

    // Roll Setting
    if (buttonType == "buttoncheck1") {
      item.system.checkbase = item.system.checkbase1;
      if (item.system.usefix1 == true) {
        item.system.formula = 7;
      } else if (item.system.customdice1 == true)
        item.system.formula = item.system.customformula1;
      else item.system.formula = "2d6";
    }
    if (buttonType == "buttoncheck2") {
      item.system.checkbase = item.system.checkbase2;
      if (item.system.usefix2 == true) {
        item.system.formula = 7;
      } else if (item.system.customdice2 == true)
        item.system.formula = item.system.customformula2;
      else item.system.formula = "2d6";
    }
    if (buttonType == "buttoncheck3") {
      item.system.checkbase = item.system.checkbase3;
      if (item.system.usefix2 == true) {
        item.system.formula = 7;
      } else if (item.system.customdice3 == true)
        item.system.formula = item.system.customformula3;
      else item.system.formula = "2d6";
    }
    if (buttonType == "buttonpower") {
      item.system.formula = "2d6";

      if (item.system.cvalue == null || item.system.cvalue == 0)
        item.system.cvalue = 10;
      if (!actor.system.effect) actor.system.efcmod = 0;
      else if (actor.system.effect.efcvalue)
        actor.system.efcmod = Number(actor.system.effect.efcvalue);
      else actor.system.efcmod = 0;
      if (item.type == "spell") {
        if (!actor.system.effect) actor.system.efcmod = 0;
        else if (actor.system.effect.efspellcvalue)
          actor.system.efcmod = Number(actor.system.effect.efspellcvalue);
        else actor.system.efcmod = 0;
      }
      item.system.totalcvalue =
        Number(item.system.cvalue) + Number(actor.system.efcmod);

      let halfpow, halfpowmod, lethaltech, criticalray, pharmtool, powup;
      if (item.system.halfpow == true) halfpow = 1;
      else halfpow = 0;
      if (item.system.halfpowmod == null || item.system.halfpowmod == 0)
        halfpowmod = 0;
      else halfpowmod = item.system.halfpowmod;
      if (item.system.lethaltech == null || item.system.lethaltech == 0)
        lethaltech = 0;
      else lethaltech = item.system.lethaltech;
      if (item.system.criticalray == null || item.system.criticalray == 0)
        criticalray = 0;
      else criticalray = item.system.criticalray;
      if (item.system.pharmtool == null || item.system.pharmtool == 0)
        pharmtool = 0;
      else pharmtool = item.system.pharmtool;
      if (item.system.powup == null || item.system.powup == 0) powup = 0;
      else powup = item.system.powup;

      item.system.powertable = [
        item.system.power,
        item.system.totalcvalue,
        0,
        item.system.pt3,
        item.system.pt4,
        item.system.pt5,
        item.system.pt6,
        item.system.pt7,
        item.system.pt8,
        item.system.pt9,
        item.system.pt10,
        item.system.pt11,
        item.system.pt12,
        item.system.powerbase,
        halfpow,
        halfpowmod,
        lethaltech,
        criticalray,
        pharmtool,
        powup,
      ];
    }

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: actor });
    const rollMode = game.settings.get("core", "rollMode");
    let label = `${item.name}`;
    let chatapply = "-";

    if (
      buttonType == "buttoncheck" ||
      buttonType == "buttoncheck1" ||
      buttonType == "buttoncheck2" ||
      buttonType == "buttoncheck3"
    ) {
      const rollData = item.getRollData();

      if (buttonType == "buttoncheck1") {
        label = label + " (" + label1 + ")";
        chatapply = item.system.applycheck1;
      } else if (buttonType == "buttoncheck2") {
        label = label + " (" + label2 + ")";
        chatapply = item.system.applycheck2;
      } else if (buttonType == "buttoncheck3") {
        label = label + " (" + label3 + ")";
        chatapply = item.system.applycheck3;
      } else {
        label = label + " (" + game.i18n.localize("SW25.Check") + ")";
        chatapply = item.system.applycheck;
      }

      let formula = item.system.formula + "+" + item.system.checkbase;

      let roll = new Roll(formula, rollData);
      await roll.evaluate();

      let chatData = {
        speaker: speaker,
        flavor: label,
        rollMode: rollMode,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls: [roll],
      };

      let chatFormula = roll.formula;
      let chatCritical = null;
      let chatFumble = null;
      let chatTotal = roll.total;
      if (roll.terms[0].total == 12) chatCritical = 1;
      if (roll.terms[0].total == 2) chatFumble = 1;

      chatData.flags = {
        total: chatTotal,
        apply: chatapply,
      };

      chatData.content = await renderTemplate(
        "systems/sw25/templates/roll/roll-check.hbs",
        {
          formula: chatFormula,
          tooltip: await roll.getTooltip(),
          critical: chatCritical,
          fumble: chatFumble,
          total: chatTotal,
          apply: chatapply,
        }
      );

      ChatMessage.create(chatData);

      return roll;
    }

    if (buttonType == "buttonpower") {
      if (item.type == "monsterability")
        label = label + " (" + labelmonpow + ")";
      else label = label + " (" + game.i18n.localize("SW25.Item.Power") + ")";
      const formula = item.system.formula;
      const powertable = item.system.powertable;

      let roll = await powerRoll(formula, powertable);

      let cValueFormula = "@" + roll.cValue;
      let halfFormula = "";
      let lethalTechFormula = "";
      let criticalRayFormula = "";
      let pharmToolFormula = "";
      let powupFormula = "";
      if (roll.cValue == 100) cValueFormula = "@13";
      if (roll.halfPow == 1) halfFormula = "h+" + roll.halfPowMod;
      if (roll.lethalTech != 0) lethalTechFormula = "#" + roll.lethalTech;
      if (roll.criticalRay > 0) criticalRayFormula = "$+" + roll.criticalRay;
      else if (roll.criticalRay != 0)
        criticalRayFormula = "$" + roll.criticalRay;
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
        speaker: speaker,
        flavor: label,
        rollMode: rollMode,
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
      let chatapply = item.system.applypower;

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
          mod: chatMod,
          half: chatHalf,
          results: chatResults,
          total: chatTotal,
          extraRoll: chatExtraRoll,
          fumble: chatFumble,
          showhalf: showhalf,
          shownoc: shownoc,
          apply: chatapply,
        }
      );

      ChatMessage.create(chatData);

      return roll;
    }
  }
  if (buttonType == "buttonhalf") {
    let newtotal =
      Math.ceil((chatMessage.flags.result[0] + chatMessage.flags.mod) / 2) +
      chatMessage.flags.orghalf;
    let newextraRoll = null;
    if (chatMessage.flags.dohalf == false || chatMessage.flags.dohalf == null) {
      let chatData = {
        flags: {
          dohalf: true,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: newtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.orghalf,
            results: chatMessage.flags.results,
            total: newtotal,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: true,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
    if (chatMessage.flags.dohalf == true) {
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: chatMessage.flags.orgtotal,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: false,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
  }
  if (buttonType == "buttonhalfc") {
    let newtotal =
      Math.ceil((chatMessage.flags.results + chatMessage.flags.mod) / 2) +
      chatMessage.flags.orghalf;
    let newextraRoll = null;
    if (
      chatMessage.flags.dohalfc == false ||
      chatMessage.flags.dohalfc == null
    ) {
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: true,
          noc: false,
          apply: chatMessage.flags.apply,
          total: newtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.orghalf,
            results: chatMessage.flags.results,
            total: newtotal,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfcdone: true,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
    if (chatMessage.flags.dohalfc == true) {
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: chatMessage.flags.orgtotal,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfcdone: false,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
  }
  if (buttonType == "buttonnoc") {
    let newtotal = chatMessage.flags.result[0] + chatMessage.flags.mod;
    let newextraRoll = null;
    if (chatMessage.flags.noc == false || chatMessage.flags.noc == null) {
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: true,
          apply: chatMessage.flags.apply,
          total: newtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: newtotal,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: chatMessage.flags.halfdone,
            showhalf: chatMessage.flags.showhalf,
            nocdone: true,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
    if (chatMessage.flags.noc == true) {
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-power.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            power: chatMessage.flags.power,
            lethalTech: chatMessage.flags.lethalTech,
            criticalRay: chatMessage.flags.criticalRay,
            pharmTool: chatMessage.flags.pharmTool,
            result: chatMessage.flags.result,
            mod: chatMessage.flags.mod,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: chatMessage.flags.orgtotal,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: chatMessage.flags.halfdone,
            showhalf: chatMessage.flags.showhalf,
            nocdone: false,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
          }
        ),
      };
      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      return;
    }
  }
  if (
    buttonType == "buttonpd" ||
    buttonType == "buttonmd" ||
    buttonType == "buttoncd" ||
    buttonType == "buttonhr" ||
    buttonType == "buttonmr"
  ) {
    const targetTokens = game.user.targets;
    if (targetTokens.size === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Notargetwarn"));
      return;
    } else if (targetTokens.size > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multitargetwarn"));
      return;
    }
    const targetActors = [];
    targetTokens.forEach((token) => {
      targetActors.push(token.actor);
    });
    const targetActor = targetActors[0];
    let targetHP = targetActor.system.hp.value;
    let targetMP = targetActor.system.mp.value;
    let targetMaxHP = targetActor.system.hp.max;
    let targetMaxMP = targetActor.system.mp.max;
    let targetPP = 0;
    let targetMPP = 0;
    if (targetActor.type == "character") {
      targetPP = targetActor.system.attributes.protectionpoint;
      targetMPP = targetActor.system.attributes.magicprotection;
    } else if (targetActor.type == "monster") {
      targetPP = targetActor.system.pp;
      targetMPP = targetActor.system.mpp;
    }
    let resultHP = targetHP;
    let resultMP = targetMP;

    let resultValue = chatMessage.flags.total;
    let differenceValue = 0;

    if (buttonType == "buttonpd") {
      resultHP = targetHP - Math.max(0, resultValue - targetPP);
      differenceValue = targetHP - resultHP;
    }
    if (buttonType == "buttonmd") {
      resultHP = targetHP - Math.max(0, resultValue - targetMPP);
      differenceValue = targetHP - resultHP;
    }
    if (buttonType == "buttoncd") {
      resultHP = targetHP - resultValue;
      differenceValue = targetHP - resultHP;
    }
    if (buttonType == "buttonhr") {
      if (targetHP + resultValue < targetMaxHP) {
        resultHP = targetHP + resultValue;
      } else resultHP = targetMaxHP;
      differenceValue = resultHP - targetHP;
    }
    if (buttonType == "buttonmr") {
      if (targetMP + resultValue < targetMaxMP) {
        resultMP = targetMP + resultValue;
      } else resultMP = targetMaxMP;
      differenceValue = resultMP - targetMP;
    }

    const targetTokenId = Array.from(targetTokens, (target) => target.id);
    if (game.user.isGM) {
      const targetToken = canvas.tokens.get(targetTokenId[0]);
      const target = targetToken.actor;
      target.update({
        "system.hp.value": resultHP,
        "system.mp.value": resultMP,
      });
    } else {
      game.socket.emit("system.sw25", {
        method: "applyRoll",
        targetToken: targetTokenId[0],
        resultHP: resultHP,
        resultMP: resultMP,
      });
    }

    const speaker = ChatMessage.getSpeaker({ actor: actor });
    const rollMode = game.settings.get("core", "rollMode");
    let label = `${chatMessage.flavor}`;

    let chatData = {
      speaker: speaker,
      flavor: label,
      rollMode: rollMode,
    };

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/roll-apply.hbs",
      {
        value: differenceValue,
        target: targetActor.name,
        type: buttonType,
      }
    );

    ChatMessage.create(chatData);
  }

  if (buttonType == "buttoneffect") {
    const orgActor = actor.name;
    const targetEffects = item.effects;
    const targetActorName = [];
    const transferEffectName = [];
    const targetTokens = game.user.targets;
    if (targetTokens.size === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Notargetwarn"));
      return;
    }

    // Target Actor
    const targetActors = [];
    targetTokens.forEach((token) => {
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
    const targetTokenId = Array.from(targetTokens, (target) => target.id);
    if (game.user.isGM) {
      targetActors.forEach((targetActor) => {
        targetEffects.forEach((effect) => {
          const transferEffect = duplicate(effect);
          transferEffect.disabled = false;
          transferEffect.sourceName = orgActor;
          targetActor.createEmbeddedDocuments("ActiveEffect", [transferEffect]);
        });
      });
    } else {
      game.socket.emit("system.sw25", {
        method: "applyEffect",
        targetTokens: targetTokenId,
        targetEffects: targetEffects,
        orgActor: orgActor,
      });
    }

    // Chat message
    const speaker = ChatMessage.getSpeaker({ actor: actor });
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
  if (buttonType == "buttonmp") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const token = selectedTokens[0];
    const cost = item.system.mpcost;
    const name = item.name;
    const type = item.type;
    const meta = 1;
    mpCost(token, cost, name, type, meta);
  }

  if (buttonType == "buttonmeta") {
    let token = canvas.tokens.get(chatMessage.flags.tokenId);
    let cost = chatMessage.flags.cost;
    let name = chatMessage.flags.name;
    let type = chatMessage.flags.type;
    let meta;
    if (chatMessage.flags.meta == false) meta = 2;
    else meta = Number(chatMessage.flags.meta) + 1;
    let chat = chatMessage;
    let base = chatMessage.flags.base;

    mpCost(token, cost, name, type, meta, chat, base);
  }

  if (buttonType == "buttonloot") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const lootActor = selectedTokens[0].actor;
    const lootItems = chatMessage.flags.loot;
    const speaker = ChatMessage.getSpeaker({ actor: lootActor });
    const rollMode = game.settings.get("core", "rollMode");
    const rollData = lootActor.getRollData();
    let label =
      `${chatMessage.speaker.alias}` +
      " (" +
      game.i18n.localize("SW25.Monster.Loot") +
      ")";
    let formula = "2d6";
    let lootmod =
      Number(lootActor.system.lootmod) + Number(lootActor.system.eflootmod);
    if (lootmod && lootmod != 0) formula = formula + "+" + lootmod;

    let roll = new Roll(formula, rollData);
    await roll.evaluate();

    let chatData = {
      speaker: speaker,
      flavor: label,
      rollMode: rollMode,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll],
    };

    let chatFormula = roll.formula;
    let chatTotal = roll.total;
    let chatLootItem = null;

    for (let i = 0; i < lootItems.length; i++) {
      let min = lootItems[i].range.min;
      let max = lootItems[i].range.max;
      if (min == "etc" || max == "etc") continue;
      if (chatTotal >= min && chatTotal <= max)
        chatLootItem = lootItems[i].item;
    }

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/roll-check.hbs",
      {
        formula: chatFormula,
        tooltip: await roll.getTooltip(),
        total: chatTotal,
        chatLootItem,
      }
    );

    ChatMessage.create(chatData);

    return roll;
  }
<<<<<<< HEAD

  if (buttonType == "buttongeneralcheck") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const selectActor = selectedTokens[0].actor;
    const flags = chatMessage.flags;
    
    let checkItem = "";
    let lvMod = 0;
    let stMod = 0;
    for( const item of selectActor.items ){
      if( item.type == "check" && item.name == flags.checkName){
        checkItem = item;
        break;
      }
    }
    if( checkItem ){
      for( const item of selectActor.items ){
        if( item.type == "skill"){
          if( checkItem.system.checkskill == "adv" &&
             (item.system.skilltype == "fighterskill" ||
              item.system.skilltype == "magicuserskill" ||
              item.system.skilltype == "otherskill") ){
              if( lvMod < parseInt(item.system.skilllevel,10) ){
                lvMod = parseInt(item.system.skilllevel,10);
              }
          } else if ( checkItem.system.checkskill == item.name ){
            lvMod = parseInt(item.system.skilllevel,10);
          }
        }
      }
      
      if( checkItem.system.checkabi == "agi" ){
        stMod = selectActor.system.abilities.agi.mod;
      } else if( checkItem.system.checkabi == "dex" ){
        stMod = selectActor.system.abilities.dex.mod;
      } else if( checkItem.system.checkabi == "str" ){
        stMod = selectActor.system.abilities.str.mod;
      } else if( checkItem.system.checkabi == "vit" ){
        stMod = selectActor.system.abilities.vit.mod;
      } else if( checkItem.system.checkabi == "int" ){
        stMod = selectActor.system.abilities.int.mod;
      } else if( checkItem.system.checkabi == "mnd" ){
        stMod = selectActor.system.abilities.mnd.mod;
      }
    }
    
    const speaker = ChatMessage.getSpeaker({ actor: selectActor });
    const rollMode = game.settings.get("core", "rollMode");
    const rollData = selectActor.getRollData();
    
    let label =
      `${chatMessage.speaker.alias}(${checkItem.name}${game.i18n.localize("SW25.Check")})`;
    let formula = checkItem ? checkItem.system.formula : "2d6";

    // 修正値（Lv、能力値、固定値）の設定
    if( 0 < lvMod ){
      formula += `+ ${lvMod}`;
    } else if( lvMod < 0 ){
      formula += `- ${lvMod}`;
    }
    
    if( 0 < stMod ){
      formula += `+ ${stMod}`;
    } else if( stMod < 0 ){
      formula += `- ${stMod}`;
    }
    
    let flagMod = parseInt(flags.modifier,10);
    if( 0 < flagMod ){
      formula += `+ ${flagMod}`;
    } else if( flagMod < 0 ){
      formula += `- ${flagMod}`;
    }

    let roll = new Roll(formula, rollData);
    await roll.evaluate();

    // 目標値の判定
    let flagTargetVal = parseInt(flags.targetValue,10);
    let content = "";
    let result = "";
    if( 0 < flagTargetVal ){
      content = `${game.i18n.localize("SW25.Difficulty")}${game.i18n.localize("SW25.Value")}: ${flagTargetVal}`;

      if( roll.terms[0].results[0].result == 1 && roll.terms[0].results[1].result == 1 ){
        result = `<span class="failed">${game.i18n.localize("SW25.Auto")}${game.i18n.localize("SW25.Failed")}(${game.i18n.localize("SW25.Fumble")})</span>`;
      } else if( roll.terms[0].results[0].result == 6 && roll.terms[0].results[1].result == 6 ){
        result = `<span class="success">${game.i18n.localize("SW25.Auto")}${game.i18n.localize("SW25.Success")} or ${game.i18n.localize("SW25.PlusFive")} (${game.i18n.localize("SW25.Critical")})</span>`;
      } else if( flagTargetVal <= roll.total ){
        result = `<span class="success">${game.i18n.localize("SW25.Success")}</span>`;
      } else {
        result = `<span class="failed">${game.i18n.localize("SW25.Failed")}</span>`;
      }
    }

    let chatData = {
      speaker: speaker,
      flavor: label,
      content: content,
      rollMode: rollMode,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll],
    };

    let chatFormula = roll.formula;
    let chatTotal = roll.total;

    chatData.content += await renderTemplate(
      "systems/sw25/templates/roll/roll-check.hbs",
      {
        formula: chatFormula,
        tooltip: await roll.getTooltip(),
        total: chatTotal
      }
    );

    if( result ) {
      chatData.content += `<div class="check-result">${result}</div>`;
    }

    ChatMessage.create(chatData);

    return roll;
  }

  if (buttonType == "buttonskillcheck") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const selectActor = selectedTokens[0].actor;
    const flags = chatMessage.flags;
    
    let checkItem = [];
    let lvMod = 0;
    let stMod = 0;
    let checkskill = "";
    let checkabi = "";
    if( flags.checkName ){
      checkItem = flags.checkName.split(",");
    }
      console.log(selectActor.items);
    for( const item of selectActor.items ){

      if( item.type == "skill" ){
        if( checkItem.includes("adv") &&
           (item.system.skilltype == "fighterskill" ||
            item.system.skilltype == "magicuserskill" ||
            item.system.skilltype == "otherskill") ){
            if( lvMod < parseInt(item.system.skilllevel,10) ){
              lvMod = parseInt(item.system.skilllevel,10);
              checkskill = `${game.i18n.localize("SW25.Attributes.Advlevel")}`;
            }
        } else if ( checkItem.includes(item.name) ){
          lvMod = parseInt(item.system.skilllevel,10);
          checkskill = `${item.name}`;
        }
      }
    }
    
    if( flags.refAbility == "agi" ){
      stMod = selectActor.system.abilities.agi.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Agi.long")}`;
    } else if( flags.refAbility == "dex" ){
      stMod = selectActor.system.abilities.dex.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Dex.long")}`;
    } else if( flags.refAbility == "str" ){
      stMod = selectActor.system.abilities.str.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Str.long")}`;
    } else if( flags.refAbility == "vit" ){
      stMod = selectActor.system.abilities.vit.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Vit.long")}`;
    } else if( flags.refAbility == "int" ){
      stMod = selectActor.system.abilities.int.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Int.long")}`;
    } else if( flags.refAbility == "mnd" ){
      stMod = selectActor.system.abilities.mnd.mod;
      checkabi = ` + ${game.i18n.localize("SW25.Ability.Mnd.long")}`;
    }
    
    const speaker = ChatMessage.getSpeaker({ actor: selectActor });
    const rollMode = game.settings.get("core", "rollMode");
    const rollData = selectActor.getRollData();
    
    let label =
      `${chatMessage.speaker.alias}(${checkskill}${checkabi})`;
    let formula = "2d6";

    // 修正値（Lv、能力値、固定値）の設定
    if( 0 < lvMod ){
      formula += `+ ${lvMod}`;
    } else if( lvMod < 0 ){
      formula += `- ${lvMod}`;
    }
    
    if( 0 < stMod ){
      formula += `+ ${stMod}`;
    } else if( stMod < 0 ){
      formula += `- ${stMod}`;
    }
    
    let flagMod = parseInt(flags.modifier,10);
    if( 0 < flagMod ){
      formula += `+ ${flagMod}`;
    } else if( flagMod < 0 ){
      formula += `- ${flagMod}`;
    }

    let roll = new Roll(formula, rollData);
    await roll.evaluate();

    // 目標値の判定
    let flagTargetVal = parseInt(flags.targetValue,10);
    let content = "";
    let result = "";
    if( 0 < flagTargetVal ){
      content = `${game.i18n.localize("SW25.Difficulty")}${game.i18n.localize("SW25.Value")}: ${flagTargetVal}`;

      if( roll.terms[0].results[0].result == 1 && roll.terms[0].results[1].result == 1 ){
        result = `<span class="failed">${game.i18n.localize("SW25.Auto")}${game.i18n.localize("SW25.Failed")}(${game.i18n.localize("SW25.Fumble")})</span>`;
      } else if( roll.terms[0].results[0].result == 6 && roll.terms[0].results[1].result == 6 ){
        result = `<span class="success">${game.i18n.localize("SW25.Auto")}${game.i18n.localize("SW25.Success")} or ${game.i18n.localize("SW25.PlusFive")} (${game.i18n.localize("SW25.Critical")})</span>`;
      } else if( flagTargetVal <= roll.total ){
        result = `<span class="success">${game.i18n.localize("SW25.Success")}</span>`;
      } else {
        result = `<span class="failed">${game.i18n.localize("SW25.Failed")}</span>`;
      }
    }

    let chatData = {
      speaker: speaker,
      flavor: label,
      content: content,
      rollMode: rollMode,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll],
    };

    let chatFormula = roll.formula;
    let chatTotal = roll.total;

    chatData.content += await renderTemplate(
      "systems/sw25/templates/roll/roll-check.hbs",
      {
        formula: chatFormula,
        tooltip: await roll.getTooltip(),
        total: chatTotal
      }
    );

    if( result ) {
      chatData.content += `<div class="check-result">${result}</div>`;
    }

    ChatMessage.create(chatData);

    return roll;
  }

}
