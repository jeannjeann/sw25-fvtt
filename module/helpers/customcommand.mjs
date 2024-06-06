// Chat button handler
import { powerRoll } from "./powerroll.mjs";
/**
 * Execute custom chat comannds.
 */
export async function customCommand(command, messageData, parameters) {
  switch (command) {
    case "/powerroll":
      let formula = "2d6";
      let index = parameters.search(/\s+/);
      let powformula = parameters.slice(0, index).toLowerCase();
      let comment = parameters.slice(index).trim();
      if (index == -1) {
        powformula = parameters.toLowerCase();
        comment = "";
      }
      let powertable = [];
      let power,
        cValue,
        halfpow,
        halfpowmod,
        lethalTech,
        criticalRay,
        pharmTool,
        powup;

      power = powformula
        .match(/(k\d+)/g)
        .map((match) => match.replace("k", ""));
      powformula = powformula.replace(/k\d+/g, "");
      let cValueOn = powformula.includes("@");
      if (cValueOn) {
        cValue = powformula
          .match(/(@\d+)/g)
          .map((match) => match.replace("@", ""));
        powformula = powformula.replace(/@\d+/g, "");
      } else cValue = 10;
      let halfpowOn = powformula.includes("h");
      if (halfpowOn) {
        halfpow = 1;
        let halfpowmodOn = /h[+-]/.test(powformula);
        if (halfpowmodOn) {
          halfpowmod = powformula
            .match(/(h\+|h-)(\d+)/g)
            .map((match) => match.replace("h", ""));
          powformula = powformula.replace(/(h\+|h-)(\d+)/g, "");
        } else {
          halfpowmod = 0;
          powformula = powformula.replace(/h/g, "");
        }
      } else {
        halfpow = 0;
        halfpowmod = 0;
      }
      let lethalTechOn = powformula.includes("#");
      if (lethalTechOn) {
        lethalTech = powformula
          .match(/(#\d+)/g)
          .map((match) => match.replace("#", ""));
        powformula = powformula.replace(/#\d+/g, "");
      } else lethalTech = 0;
      let criticalRayOn = powformula.includes("$");
      if (criticalRayOn) {
        let cr = powformula.match(/(\$\+|\$-|\$f)(\d+)/);
        criticalRay = cr ? cr[0].replace("$", "") : "";
        powformula = powformula.replace(/(\$\+|\$-|\$f)(\d+)/g, "");
      } else criticalRay = 0;
      let pharmToolOn = powformula.includes("tf");
      if (pharmToolOn) {
        pharmTool = powformula
          .match(/(tf\d+)/g)
          .map((match) => match.replace("tf", ""));
        powformula = powformula.replace(/tf\d+/g, "");
      } else pharmTool = 0;
      let powupOn = powformula.includes("r");
      if (powupOn) {
        powup = powformula
          .match(/(r\d+)/g)
          .map((match) => match.replace("r", ""));
        powformula = powformula.replace(/r\d+/g, "");
      } else powup = 0;

      // Set power table
      powertable[0] = Number(power);
      powertable[1] = Number(cValue);
      for (let i = 2; i <= 12; i++) {
        powertable[i] = 0;
      }
      powertable[13] = Number(powformula);
      powertable[14] = Number(halfpow);
      powertable[15] = Number(halfpowmod);
      powertable[16] = Number(lethalTech);
      powertable[17] = criticalRay;
      powertable[18] = Number(pharmTool);
      powertable[19] = Number(powup);

      // Power roll
      let roll = powerRoll(formula, powertable);

      const chatLabel = comment;
      let cValueFormula = "@" + roll.cValue;
      let halfFormula = "";
      let lethalTechFormula = "";
      let criticalRayFormula = "";
      let pharmToolFormula = "";
      let powupFormula = "";
      if (roll.cValue == 100) cValueFormula = "@13";
      if (roll.halfPow == 1) halfFormula = "h+" + roll.halfPowMod;
      if (roll.lethalTech != 0) lethalTechFormula = "#" + roll.lethalTech;
      if (roll.criticalRay != 0) criticalRayFormula = "$" + roll.criticalRay;
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
        speaker: ChatMessage.getSpeaker({ actor: messageData.speaker.actor }),
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
      let chatapply = "on";

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

    default:
      break;
  }
}
