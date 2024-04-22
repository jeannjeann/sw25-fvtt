// Chat button handler
import { powerRoll } from "./powerroll.mjs";
/**
 * Execute  chat button click event and return the result.
 */
export async function chatButton(chatMessage, buttonType) {
  const actorId = chatMessage.speaker.actor;
  const actor = game.actors.get(actorId);
  const itemId = chatMessage.flags.itemid;
  const item = actor.items.get(itemId);

  const label1 = item.system.label1;
  const label2 = item.system.label2;
  const label3 = item.system.label3;
  const labelmonpow = item.system.labelmonpow;

  // Item roll button
  if (
    buttonType == "buttoncheck" ||
    buttonType == "buttoncheck1" ||
    buttonType == "buttoncheck2" ||
    buttonType == "buttoncheck3" ||
    buttonType == "buttonpower"
  ) {
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
      let halfpow, halfpowmod, lethaltech, criticalray, pharmtool;
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

      item.system.powertable = [
        item.system.power,
        item.system.cvalue,
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
      ];
    }

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: actor });
    const rollMode = game.settings.get("core", "rollMode");
    let label = `${item.name}`;

    if (
      buttonType == "buttoncheck" ||
      buttonType == "buttoncheck1" ||
      buttonType == "buttoncheck2" ||
      buttonType == "buttoncheck3"
    ) {
      const rollData = item.getRollData();

      console.log(rollData);

      if (buttonType == "buttoncheck1") label = label + " (" + label1 + ")";
      else if (buttonType == "buttoncheck2")
        label = label + " (" + label2 + ")";
      else if (buttonType == "buttoncheck3")
        label = label + " (" + label3 + ")";
      else label = label + " (" + game.i18n.localize("SW25.Check") + ")";

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

      chatData.content = await renderTemplate(
        "systems/sw25/templates/roll/roll-check.hbs",
        {
          formula: chatFormula,
          tooltip: await roll.getTooltip(),
          critical: chatCritical,
          fumble: chatFumble,
          total: chatTotal,
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
      //const powertable = this.system.powertable.split(",").map(Number);
      const powertable = item.system.powertable;

      let roll = powerRoll(formula, powertable);

      let cValueFormula = "@" + roll.cValue;
      let halfFormula = "";
      let lethalTechFormula = "";
      let criticalRayFormula = "";
      let pharmToolFormula = "";
      if (roll.cValue == 100) cValueFormula = "@13";
      if (roll.halfPow == 1) halfFormula = "h+" + roll.halfPowMod;
      if (roll.lethalTech != 0) lethalTechFormula = "#" + roll.lethalTech;
      if (roll.criticalRay != 0) criticalRayFormula = "$+" + roll.criticalRay;
      if (roll.pharmTool != 0) pharmToolFormula = "tf" + roll.pharmTool;

      let chatFormula =
        "k" +
        roll.power +
        cValueFormula +
        "+" +
        roll.powMod +
        lethalTechFormula +
        criticalRayFormula +
        pharmToolFormula +
        halfFormula;

      let chatPower = roll.power;
      let chatLethalTech = null;
      let chatCriticalRay = null;
      let chatPharmTool = null;
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
      if (roll.rollCount > 0) chatExtraRoll = roll.rollCount;
      if (roll.fumble == 1) chatFumble = roll.fumble;

      let chatData = {
        speaker: speaker,
        flavor: label,
        rollMode: rollMode,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls: [roll.fakeResult],
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
          result: chatResult,
          mod: chatMod,
          half: chatHalf,
          results: chatResults,
          total: chatTotal,
          extraRoll: chatExtraRoll,
          fumble: chatFumble,
        }
      );

      ChatMessage.create(chatData);

      return roll;
    }
  }
}
