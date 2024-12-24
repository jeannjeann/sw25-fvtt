// Chat button handler
import { powerRoll } from "./powerroll.mjs";
import { mpCost, hpCost } from "./mpcost.mjs";
import { targetRollDialog } from "../helpers/dialogs.mjs";

/**
 * Execute  chat button click event and return the result.
 */
export async function chatButton(chatMessage, buttonType) {
  const actorId = chatMessage.speaker.actor;
  const actor = game.actors.get(actorId);
  const itemId = chatMessage.flags.itemid;
  const item = actor ? actor.items.get(itemId) : null;

  // Item roll button
  if (
    buttonType == "buttoncheck" ||
    buttonType == "buttoncheck1" ||
    buttonType == "buttoncheck2" ||
    buttonType == "buttoncheck3" ||
    buttonType == "buttonpower"
  ) {
    const targetTokens = game.user.targets;

    let apply = "-";
    if (buttonType == "buttoncheck") apply = item.system.applycheck;
    if (buttonType == "buttoncheck1") apply = item.system.applycheck1;
    if (buttonType == "buttoncheck2") apply = item.system.applycheck2;
    if (buttonType == "buttoncheck3") apply = item.system.applycheck3;
    if (buttonType == "buttonpower") apply = item.system.applypower;
    if (apply == "-" || targetTokens.size === 0) {
      await chatRoll();
      return;
    } else {
      let label = `${item.name}`;
      const label0 = game.i18n.localize("SW25.Check");
      const label1 = item.system.label1;
      const label2 = item.system.label2;
      const label3 = item.system.label3;
      const labelmonpow = item.system.labelmonpow;
      if (buttonType == "buttoncheck") label = label + " (" + label0 + ")";
      if (buttonType == "buttoncheck1") label = label + " (" + label1 + ")";
      if (buttonType == "buttoncheck2") label = label + " (" + label2 + ")";
      if (buttonType == "buttoncheck3") label = label + " (" + label3 + ")";
      let powlabel = game.i18n.localize("SW25.Item.Power");
      if (item.type == "monsterability") powlabel = labelmonpow;
      if (buttonType == "buttonpower") label = label + " (" + powlabel + ")";

      const targetRoll = await targetRollDialog(targetTokens, label);
      if (targetRoll == "cancel") {
        return;
      } else if (targetRoll == "once") {
        await chatRoll(targetTokens);
        return;
      } else if (targetRoll == "individual") {
        let chatMessageId = [];
        for (const [index, token] of Array.from(targetTokens).entries()) {
          const targetToken = new Set([token]);
          await chatRoll(targetToken).then((result) => {
            chatMessageId.push(result.chatMessageId);
          });
        }

        // rendar apply all message
        const speaker = ChatMessage.getSpeaker({ actor: actor });
        let chatapply = "-";
        let checktype = null;
        let powertype = null;
        if (buttonType == "buttoncheck") {
          chatapply = item.system.applycheck;
          checktype = item.system.checkTypesButton;
        }
        if (buttonType == "buttoncheck1") {
          chatapply = item.system.applycheck1;
          checktype = item.system.checkTypesButton1;
        }
        if (buttonType == "buttoncheck2") {
          chatapply = item.system.applycheck2;
          checktype = item.system.checkTypesButton2;
        }
        if (buttonType == "buttoncheck3") {
          chatapply = item.system.applycheck3;
          checktype = item.system.checkTypesButton3;
        }
        if (buttonType == "buttonpower") {
          chatapply = item.system.applypower;
          powertype = item.system.powerTypesButton;
        }

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
            apply: chatapply,
            checktype: checktype,
            powertype: powertype,
          }
        );

        ChatMessage.create(chatData);
        return;
      }
    }

    await chatRoll();
  }
  async function chatRoll(targetTokens) {
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
      if (item.type == "weapon" && actor.system.attributes.efwphalfmod)
        halfpowmod =
          Number(halfpowmod) + Number(actor.system.attributes.efwphalfmod);
      if (item.type == "spell" && actor.system.attributes.efsphalfmod)
        halfpowmod =
          Number(halfpowmod) + Number(actor.system.attributes.efsphalfmod);
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
    let chatresuse = "";
    let chatapply = "-";
    let checktype = item.system.checkTypesButton;
    let baseformula = item.system.formula;

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
        checktype = item.system.checkTypesButton1;
        baseformula = item.system.checkformula1;
      } else if (buttonType == "buttoncheck2") {
        label = label + " (" + label2 + ")";
        chatapply = item.system.applycheck2;
        checktype = item.system.checkTypesButton2;
        baseformula = item.system.checkformula2;
      } else if (buttonType == "buttoncheck3") {
        label = label + " (" + label3 + ")";
        chatapply = item.system.applycheck3;
        checktype = item.system.checkTypesButton3;
        baseformula = item.system.checkformula3;
      } else {
        label = label + " (" + game.i18n.localize("SW25.Check") + ")";
        chatapply = item.system.applycheck;
        checktype = item.system.checkTypesButton;
      }

      let resuse = item.system.resuse;
      if (resuse !== "-" && item.system.autouseres) {
        let actoritem = actor.items.get(resuse);
        let resusequantity = item.system.resusequantity;
        let actoritemquantity = actoritem.system.quantity;
        let remainingquantity = actoritemquantity - resusequantity;
        let min = actoritem.system.qmin;

        if (actoritemquantity < resusequantity) {
          ui.notifications.warn(
            game.i18n.localize("SW25.Item.Noresquantitiywarn") + actoritem.name
          );
          return;
        } else if (remainingquantity < min) {
          ui.notifications.warn(
            game.i18n.localize("SW25.Item.Noresquantitiywarn") + actoritem.name
          );
          return;
        } else {
          actoritem.update({ "system.quantity": remainingquantity });
          chatresuse = `<div style="text-align: right;">${actoritem.name}: ${actoritemquantity} >>> ${remainingquantity}</div>`;
        }
      }

      let formula = baseformula + "+" + item.system.checkbase;

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
        total: chatTotal,
        apply: chatapply,
        rolls: roll,
        checktype: checktype,
        target,
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
      else if (roll.halfPowMod && roll.halfPowMod != 0)
        halfFormula = "+" + roll.halfPowMod;
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
      let powertype = item.system.powerTypesButton;

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
  }
  if (buttonType == "buttonhalf") {
    let halftotal =
      Math.ceil((chatMessage.flags.result[0] + chatMessage.flags.mod) / 2) +
      chatMessage.flags.orghalf;
    let newextraRoll = null;
    let aftermod = chatMessage.flags.aftermod ?? 0;

    if (chatMessage.flags.dohalf == false || chatMessage.flags.dohalf == null) {
      let newtotal = halftotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${halftotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: true,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: newtotal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
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
            total: newtotaltext,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: true,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
            targetName: chatMessage.flags.targetName,
          }
        ),
      };

      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      const html = $(`.message[data-message-id="${chatMessage.id}"]`);
      html.find(".dice-tooltip").removeClass("expanded");

      return;
    }
    if (chatMessage.flags.dohalf == true) {
      let newtotal = chatMessage.flags.orgtotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${chatMessage.flags.orgtotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
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
            mod: chatMessage.flags.modTotal,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: newtotaltext,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: false,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
            targetName: chatMessage.flags.targetName,
          }
        ),
      };

      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      const html = $(`.message[data-message-id="${chatMessage.id}"]`);
      html.find(".dice-tooltip").removeClass("expanded");

      return;
    }
  }
  if (buttonType == "buttonhalfc") {
    let halfctoal =
      Math.ceil((chatMessage.flags.results + chatMessage.flags.mod) / 2) +
      chatMessage.flags.orghalf;
    let newextraRoll = chatMessage.flags.extraRoll;
    let aftermod = chatMessage.flags.aftermod ?? 0;

    if (
      chatMessage.flags.dohalfc == false ||
      chatMessage.flags.dohalfc == null
    ) {
      let newtotal = halfctoal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${halfctoal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: true,
          noc: false,
          apply: chatMessage.flags.apply,
          total: halfctoal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
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
            total: newtotaltext,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfcdone: true,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
            targetName: chatMessage.flags.targetName,
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
      let newtotal = chatMessage.flags.orgtotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${chatMessage.flags.orgtotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
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
            mod: chatMessage.flags.modTotal,
            half: chatMessage.flags.half,
            results: chatMessage.flags.results,
            total: newtotaltext,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfcdone: false,
            showhalf: chatMessage.flags.showhalf,
            nocdone: chatMessage.flags.nocdone,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
            targetName: chatMessage.flags.targetName,
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
    let noctotal = chatMessage.flags.result[0] + chatMessage.flags.mod;
    let newextraRoll = null;
    let aftermod = chatMessage.flags.aftermod ?? 0;

    if (chatMessage.flags.noc == false || chatMessage.flags.noc == null) {
      let newtotal = noctotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${noctotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: true,
          apply: chatMessage.flags.apply,
          total: noctotal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
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
            total: newtotaltext,
            extraRoll: newextraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: chatMessage.flags.halfdone,
            showhalf: chatMessage.flags.showhalf,
            nocdone: true,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
            targetName: chatMessage.flags.targetName,
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
      let newtotal = chatMessage.flags.orgtotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${chatMessage.flags.orgtotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          dohalfc: false,
          noc: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
          aftermod: aftermod,
          powertype: chatMessage.flags.powertype,
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
            total: newtotaltext,
            extraRoll: chatMessage.flags.extraRoll,
            fumble: chatMessage.flags.fumble,
            halfdone: chatMessage.flags.halfdone,
            showhalf: chatMessage.flags.showhalf,
            nocdone: false,
            shownoc: chatMessage.flags.shownoc,
            apply: chatMessage.flags.apply,
            powertype: chatMessage.flags.powertype,
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

  if (buttonType == "buttondecrease") {
    let aftermod = -1;
    if (chatMessage.flags.aftermod)
      aftermod = Number(chatMessage.flags.aftermod) - 1;
    if (aftermod > 0) aftermod = `+${aftermod}`;

    let orgtotal = chatMessage.flags.orgtotal;
    let halfdone = false;
    let halfcdone = false;
    let nocdone = false;
    let newextraRoll = chatMessage.flags.extraRoll;
    if (chatMessage.flags.dohalf) {
      orgtotal =
        Math.ceil((chatMessage.flags.result[0] + chatMessage.flags.mod) / 2) +
        chatMessage.flags.orghalf;
      halfdone = true;
      newextraRoll = null;
    }
    if (chatMessage.flags.dohalfc) {
      orgtotal =
        Math.ceil((chatMessage.flags.results + chatMessage.flags.mod) / 2) +
        chatMessage.flags.orghalf;
      halfcdone = true;
    }
    if (chatMessage.flags.noc) {
      orgtotal = chatMessage.flags.result[0] + chatMessage.flags.mod;
      nocdone = true;
      newextraRoll = null;
    }

    let newtotal = Number(orgtotal) + Number(aftermod);
    let newtotaltext = newtotal;
    if (aftermod != 0)
      newtotaltext = `
          ${newtotal}<span style="font-size: 0.6em;"> (${orgtotal}${aftermod})</span>
        `;

    let chatData = {
      flags: {
        total: newtotal,
        aftermod: aftermod,
        powertype: chatMessage.flags.powertype,
        targetName: chatMessage.flags.targetName,
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
          total: newtotaltext,
          extraRoll: newextraRoll,
          fumble: chatMessage.flags.fumble,
          halfdone: halfdone,
          halfcdone: halfcdone,
          nocdone: nocdone,
          showhalf: chatMessage.flags.showhalf,
          shownoc: chatMessage.flags.shownoc,
          apply: chatMessage.flags.apply,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
        }
      ),
    };

    await chatMessage.update({
      content: chatData.content,
      flags: chatData.flags,
    });
    const html = $(`.message[data-message-id="${chatMessage.id}"]`);
    html.find(".dice-tooltip").removeClass("expanded");

    return;
  }

  if (buttonType == "buttonincrease") {
    let aftermod = 1;
    if (chatMessage.flags.aftermod)
      aftermod = Number(chatMessage.flags.aftermod) + 1;
    if (aftermod > 0) aftermod = `+${aftermod}`;

    let orgtotal = chatMessage.flags.orgtotal;
    let halfdone = false;
    let halfcdone = false;
    let nocdone = false;
    let newextraRoll = chatMessage.flags.extraRoll;
    if (chatMessage.flags.dohalf) {
      orgtotal =
        Math.ceil((chatMessage.flags.result[0] + chatMessage.flags.mod) / 2) +
        chatMessage.flags.orghalf;
      halfdone = true;
      newextraRoll = null;
    }
    if (chatMessage.flags.dohalfc) {
      orgtotal =
        Math.ceil((chatMessage.flags.results + chatMessage.flags.mod) / 2) +
        chatMessage.flags.orghalf;
      halfcdone = true;
    }
    if (chatMessage.flags.noc) {
      orgtotal = chatMessage.flags.result[0] + chatMessage.flags.mod;
      nocdone = true;
      newextraRoll = null;
    }

    let newtotal = Number(orgtotal) + Number(aftermod);
    let newtotaltext = newtotal;
    if (aftermod != 0)
      newtotaltext = `
          ${newtotal}<span style="font-size: 0.6em;"> (${orgtotal}${aftermod})</span>
        `;

    let chatData = {
      flags: {
        total: newtotal,
        aftermod: aftermod,
        powertype: chatMessage.flags.powertype,
        targetName: chatMessage.flags.targetName,
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
          total: newtotaltext,
          extraRoll: newextraRoll,
          fumble: chatMessage.flags.fumble,
          halfdone: halfdone,
          halfcdone: halfcdone,
          nocdone: nocdone,
          showhalf: chatMessage.flags.showhalf,
          shownoc: chatMessage.flags.shownoc,
          apply: chatMessage.flags.apply,
          powertype: chatMessage.flags.powertype,
          targetName: chatMessage.flags.targetName,
        }
      ),
    };

    await chatMessage.update({
      content: chatData.content,
      flags: chatData.flags,
    });
    const html = $(`.message[data-message-id="${chatMessage.id}"]`);
    html.find(".dice-tooltip").removeClass("expanded");

    return;
  }

  if (buttonType == "checkhalf") {
    let halftotal = Math.ceil(chatMessage.flags.orgtotal / 2);
    let aftermod = chatMessage.flags.aftermod ?? 0;
    let roll = chatMessage.flags.rolls;
    let rollTotal =
      roll.terms[0].results[0].result + roll.terms[0].results[1].result;
    let chatCritical = null;
    let chatFumble = null;
    if (rollTotal == 12) chatCritical = 1;
    if (rollTotal == 2) chatFumble = 1;

    if (chatMessage.flags.dohalf == false || chatMessage.flags.dohalf == null) {
      let newtotal = halftotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${halftotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: true,
          apply: chatMessage.flags.apply,
          total: newtotal,
          aftermod: aftermod,
          critical: chatCritical,
          fumble: chatFumble,
          checktype: chatMessage.flags.checktype,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-check.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            result: chatMessage.flags.result,
            total: newtotaltext,
            critical: chatCritical,
            fumble: chatFumble,
            halfdone: true,
            apply: chatMessage.flags.apply,
            checktype: chatMessage.flags.checktype,
          }
        ),
      };

      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      const html = $(`.message[data-message-id="${chatMessage.id}"]`);
      html.find(".dice-tooltip").removeClass("expanded");

      return;
    }
    if (chatMessage.flags.dohalf == true) {
      let newtotal = chatMessage.flags.orgtotal + Number(aftermod);
      let newtotaltext = newtotal;
      if (aftermod != 0)
        newtotaltext = `
            ${newtotal}<span style="font-size: 0.6em;"> (${chatMessage.flags.orgtotal}${aftermod})</span>
          `;
      let chatData = {
        flags: {
          dohalf: false,
          apply: chatMessage.flags.apply,
          total: chatMessage.flags.orgtotal,
          aftermod: aftermod,
          critical: chatCritical,
          fumble: chatFumble,
          checktype: chatMessage.flags.checktype,
        },
        content: await renderTemplate(
          "systems/sw25/templates/roll/roll-check.hbs",
          {
            formula: chatMessage.flags.formula,
            tooltip: chatMessage.flags.tooltip,
            result: chatMessage.flags.result,
            total: newtotaltext,
            critical: chatCritical,
            fumble: chatFumble,
            halfdone: false,
            apply: chatMessage.flags.apply,
            checktype: chatMessage.flags.checktype,
          }
        ),
      };

      await chatMessage.update({
        content: chatData.content,
        flags: chatData.flags,
      });
      const html = $(`.message[data-message-id="${chatMessage.id}"]`);
      html.find(".dice-tooltip").removeClass("expanded");

      return;
    }
  }

  if (buttonType == "checkdecrease" || buttonType == "checkincrease") {
    let aftermod = 0;
    if (buttonType == "checkdecrease") aftermod = -1;
    if (buttonType == "checkincrease") aftermod = 1;

    if (chatMessage.flags.aftermod)
      aftermod = Number(chatMessage.flags.aftermod) + aftermod;
    if (aftermod > 0) aftermod = `+${aftermod}`;

    let orgtotal = chatMessage.flags.orgtotal;
    if (chatMessage.flags.dohalf)
      orgtotal = Math.ceil(chatMessage.flags.orgtotal / 2);

    let newtotal = Number(orgtotal) + Number(aftermod);
    let newtotaltext = newtotal;
    if (aftermod != 0)
      newtotaltext = `
          ${newtotal}<span style="font-size: 0.6em;"> (${orgtotal}${aftermod})</span>
        `;

    let roll = chatMessage.flags.rolls;
    let rollTotal =
      roll.terms[0].results[0].result + roll.terms[0].results[1].result;
    let chatCritical = null;
    let chatFumble = null;
    if (rollTotal == 12) chatCritical = 1;
    if (rollTotal == 2) chatFumble = 1;
    let halfdone = chatMessage.flags.dohalf ? chatMessage.flags.dohalf : false;

    let chatData = {
      flags: {
        total: newtotal,
        apply: chatMessage.flags.apply,
        spell: chatMessage.flags.spell,
        rolls: chatMessage.flags.rolls,
        formula: chatMessage.flags.formula,
        tooltip: chatMessage.flags.tooltip,
        orgtotal: chatMessage.flags.orgtotal,
        critical: chatCritical,
        fumble: chatFumble,
        dohalf: halfdone,
        aftermod: aftermod,
        checktype: chatMessage.flags.checktype,
        targetName: chatMessage.flags.targetName,
      },
      content: await renderTemplate(
        "systems/sw25/templates/roll/roll-check.hbs",
        {
          formula: chatMessage.flags.formula,
          tooltip: chatMessage.flags.tooltip,
          critical: chatCritical,
          fumble: chatFumble,
          result: chatMessage.flags.result,
          total: newtotaltext,
          halfdone: halfdone,
          apply: chatMessage.flags.apply,
          spell: chatMessage.flags.spell,
          checktype: chatMessage.flags.checktype,
          targetName: chatMessage.flags.targetName,
        }
      ),
    };

    await chatMessage.update({
      content: chatData.content,
      flags: chatData.flags,
    });
    const html = $(`.message[data-message-id="${chatMessage.id}"]`);
    html.find(".dice-tooltip").removeClass("expanded");

    return;
  }

  if (
    buttonType == "buttonpd" ||
    buttonType == "buttonmd" ||
    buttonType == "buttoncd" ||
    buttonType == "buttonhr" ||
    buttonType == "buttonmr"
  ) {
    let targetTokenId;
    if (!chatMessage.flags.target) {
      const targetTokens = game.user.targets;
      if (targetTokens.size === 0) {
        ui.notifications.warn(game.i18n.localize("SW25.Notargetwarn"));
        return;
        /*
      } else if (targetTokens.size > 1) {
        ui.notifications.warn(game.i18n.localize("SW25.Multitargetwarn"));
        return;
      */
      } else {
        const targetTokenIds = [];
        targetTokens.forEach((token) => {
          targetTokenIds.push(token.id);
        });
        for (let i = 0; i < targetTokenIds.length; i++) {
          targetTokenId = targetTokenIds[i];
          await applyExec(targetTokenId);
        }
      }
    } else {
      for (let i = 0; i < chatMessage.flags.target.length; i++) {
        const targetToken = canvas.tokens.get(chatMessage.flags.target[i]);
        targetTokenId = targetToken.id;
        await applyExec(targetTokenId);
      }
    }

    async function applyExec(targetTokenId) {
      const targetToken = canvas.tokens.get(targetTokenId);
      const targetActor = targetToken.actor;
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
      } else if (targetActor.type == "npc") {
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

      if (game.user.isGM) {
        targetActor.update({
          "system.hp.value": resultHP,
          "system.mp.value": resultMP,
        });
      } else {
        game.socket.emit("system.sw25", {
          method: "applyRoll",
          targetToken: targetTokenId,
          resultHP: resultHP,
          resultMP: resultMP,
        });
      }

      let isView = false;
      let beforeValue = null;
      let afterValue = null;
      if(CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER <= targetActor.ownership.default){
        isView = true;
        if(buttonType == "buttonmr"){
          beforeValue = targetMP;
          afterValue = resultMP;
        } else {
          beforeValue = targetHP;
          afterValue = resultHP;
        }
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
          target: targetToken.document.name,
          type: buttonType,
          beforeValue: beforeValue,
          afterValue: afterValue,
          isView: isView,
        }
      );

      ChatMessage.create(chatData);
    }
  }

  if (buttonType == "buttoneffect") {
    const orgActor = actor.name;
    const orgId = actor._id;
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

  if (
    buttonType == "buttonpdall" ||
    buttonType == "buttonmdall" ||
    buttonType == "buttoncdall" ||
    buttonType == "buttonhrall" ||
    buttonType == "buttonmrall"
  ) {
    const targetMessages = chatMessage.flags.targetMessage;
    let type = "";
    switch (buttonType) {
      case "buttonpdall":
        type = "buttonpd";
        break;
      case "buttonmdall":
        type = "buttonmd";
        break;
      case "buttoncdall":
        type = "buttoncd";
        break;
      case "buttonhrall":
        type = "buttonhr";
        break;
      case "buttonmrall":
        type = "buttonmr";
        break;
      default:
        break;
    }
    for (let i = 0; i < targetMessages.length; i++) {
      const targetMessage = game.messages.get(targetMessages[i]);
      chatButton(targetMessage, type);
    }
    return;
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

  if (buttonType == "buttonhp") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const token = selectedTokens[0];
    const cost = item.system.hpcost;
    const max = item.system.maxhpcost;
    const name = item.name;
    const type = item.type;
    hpCost(token, cost, max, name, type);
  }

  if (buttonType == "buttonresource") {
    const speaker = ChatMessage.getSpeaker({ actor: actor });
    let resuse = item.system.resuse;
    let resusequantity = item.system.resusequantity;
    let actoritem = actor.items.get(resuse);
    let actoritemquantity = actoritem.system.quantity;
    let remainingquantity = actoritemquantity - resusequantity;
    let min = actoritem.system.qmin;

    if (actoritemquantity < resusequantity) {
      ui.notifications.warn(
        game.i18n.localize("SW25.Item.Noresquantitiywarn") + actoritem.name
      );
      return;
    } else if (remainingquantity < min) {
      ui.notifications.warn(
        game.i18n.localize("SW25.Item.Noresquantitiywarn") + actoritem.name
      );
      return;
    } else {
      actoritem.update({ "system.quantity": remainingquantity });

      let chatData = {
        speaker: speaker,
      };

      chatData.content = `<div style="text-align: right;">${actoritem.name}: ${actoritemquantity} >>> ${remainingquantity}</div>`;

      ChatMessage.create(chatData);
    }
  }

  if (buttonType == "buttonmeta") {
    let token = canvas.tokens.get(chatMessage.flags.tokenId);
    let cost = chatMessage.flags.cost;
    let name = chatMessage.flags.name;
    let type = chatMessage.flags.type;
    let meta;
    if (chatMessage.flags.meta == false) meta = 1;
    else meta = Number(chatMessage.flags.meta) + 1;
    let chat = chatMessage;
    let base = chatMessage.flags.base;

    mpCost(token, cost, name, type, meta, chat, base);
  }
  
  if (buttonType == "buttonmpcancel") {
    let token = canvas.tokens.get(chatMessage.flags.tokenId);
    let cost = chatMessage.flags.cost;
    let name = chatMessage.flags.name;
    let type = chatMessage.flags.type;
    let meta = 0;
    let chat = chatMessage;
    let base = chatMessage.flags.base;

    
    // Apply MP cost
    if (game.user.isGM) {
      actor.update({
        "system.mp.value": base,
      });
    } else {
      game.socket.emit("system.sw25", {
        method: "applyMp",
        targetToken: chatMessage.flags.tokenId,
        resultMP: base,
      });
    }

    // Apply ChatMessage
    let label =
      name + " (" + cost + " " + game.i18n.localize("SW25.Item.Spell.Cancel") + ")";
    let metaB = false;
    if (type == "spell") metaB = true;

    let chatData = {
      flavor: label,
      flags: {
        meta: meta,
        type: type,
      },
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/mp-apply.hbs",
      {
        targetMP: base,
        resultMP: base,
        metaB: metaB,
      }
    );
    await chat.update(chatData);    
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

  if (buttonType == "buttonrollreq") {
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
      ui.notifications.warn(game.i18n.localize("SW25.Noselectwarn"));
      return;
    } else if (selectedTokens.length > 1) {
      ui.notifications.warn(game.i18n.localize("SW25.Multiselectwarn"));
      return;
    }
    const selectActor = selectedTokens[0].actor;
    const rollData = selectActor.getRollData();
    const flags = chatMessage.flags;

    let checkItem = "";
    let checkName = flags.checkName;
    if (checkName == "di") checkName = flags.inputName;

    for (const item of selectActor.items) {
      if (item.type == flags.method && checkName == item.name) {
        checkItem = item;
        break;
      }
    }

    const item = checkItem;
    const itemData = item.system;
    let checkbase;

    if (flags.method == "skill") {
      let skillbase;
      if (checkName == "adv") {
        checkName = `${game.i18n.localize("SW25.Attributes.Advlevel")}`;
        skillbase = selectActor.system.abilities[flags.refAbility].advbase;
      } else if (itemData) {
        skillbase = itemData.skillbase[flags.refAbility];
      } else checkbase = 0;
      if (skillbase >= 0) checkbase = `+ ${skillbase}`;
      if (skillbase < 0) checkbase = `${skillbase}`;
      if (flags.refAbility != "-") {
        let i18ncat =
          flags.refAbility.charAt(0).toUpperCase() + flags.refAbility.slice(1);
        let abi = " + " + game.i18n.localize(`SW25.Ability.${i18ncat}.abbr`);
        checkName = `${checkName}${abi}`;
      }
    }
    if (flags.method == "check") {
      if (itemData) {
        if (itemData.checkbase >= 0) checkbase = `+ ${itemData.checkbase}`;
        if (itemData.checkbase < 0) checkbase = `${itemData.checkbase}`;
      } else checkbase = 0;
    }

    let flagMod = parseInt(flags.modifier, 10);
    if (0 < flagMod) {
      checkbase += `+ ${flagMod}`;
    } else if (flagMod < 0) {
      checkbase += `${flagMod}`;
    }

    let formula = item ? itemData.formula + checkbase : "2d6";
    if (flags.checkName == "adv") formula = "2d6" + checkbase;

    let roll = new Roll(formula, rollData);
    await roll.evaluate();

    const speaker = ChatMessage.getSpeaker({ actor: selectActor });
    const rollMode = game.settings.get("core", "rollMode");
    let label = `${game.i18n.localize("SW25.Check")}`;
    if (checkName) label = `${checkName} (${game.i18n.localize("SW25.Check")})`;
    if (checkName && !item && flags.checkName != "adv")
      label = `${game.i18n.localize(
        "SW25.StraightRoll"
      )} - ${checkName} (${game.i18n.localize("SW25.Check")})`;

    let judge = false;
    let resultText = "";
    let fumble =
      roll.terms[0].results[0].result == 1 &&
      roll.terms[0].results[1].result == 1;
    let critical =
      roll.terms[0].results[0].result == 6 &&
      roll.terms[0].results[1].result == 6;
    if (flags.targetValue) {
      if (roll.total >= parseInt(flags.targetValue, 10)) judge = true;
      if (judge) {
        resultText = `<span class="success"> ${game.i18n.localize(
          "SW25.Success"
        )} ▶ </span>`;
      } else {
        resultText = `<span class="failed"> ${game.i18n.localize(
          "SW25.Failed"
        )} ▶ </span>`;
      }
    }
    if (critical) {
      resultText = `<span class="success">${game.i18n.localize(
        "SW25.Auto"
      )}${game.i18n.localize("SW25.Success")} ▶ </span>`;
    }
    if (fumble) {
      resultText = `<span class="failed"> ${game.i18n.localize(
        "SW25.Auto"
      )}${game.i18n.localize("SW25.Failed")} ▶ </span>`;
    }

    let chatData = {
      speaker: speaker,
      flavor: label,
      rollMode: rollMode,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll],
    };

    let chatFormula = roll.formula;
    if (flags.targetValue)
      chatFormula = roll.formula + ` >= ${parseInt(flags.targetValue, 10)}`;
    let chatTotal = roll.total;
    if (critical)
      chatTotal = `${Number(
        roll.total + 5
      )} <span style="font-size:0.7em;"> ( ${roll.total} + 5 )</span>`;

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/roll-check.hbs",
      {
        formula: chatFormula,
        tooltip: await roll.getTooltip(),
        total: chatTotal,
        resultText,
      }
    );

    ChatMessage.create(chatData);

    return roll;
  }

  if (buttonType.endsWith("-buttonaction")) {
    const itemId = buttonType.replace(/-buttonaction$/, "");
    const item = actor.items.get(itemId);

    // cancel message
    if (itemId == "cancel") {
      const content = actor.system.canceldialog;
      let chatData = {
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        type: CONST.CHAT_MESSAGE_TYPES.IC,
        content: content,
      };
      ChatMessage.create(chatData);
    } else {
      if (item.system.dialog) {
        const content = item.system.dialog;
        let chatData = {
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          type: CONST.CHAT_MESSAGE_TYPES.IC,
          content: content,
        };
        ChatMessage.create(chatData);
      }
      // action item
      item.roll();
    }
  }
}
