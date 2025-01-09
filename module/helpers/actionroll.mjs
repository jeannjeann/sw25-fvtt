/**
 * Execute Fellow and Daemon Action roll.
 */
export async function actionRoll(element, actor) {
  const actorId = actor.id;
  const actorData = actor.system;
  const dataset = element.dataset;
  const formula = "1d6";
  const actionType = actorData.tabletype;
  const actions = [];
  for (const item of actor.items) {
    if (item.type == "action") {
      actions.push(item);
    }
  }

  // roll setting
  let label = game.i18n.localize("SW25.ActionRoll") + `:${actor.name}`;
  let roll, result, total;
  let chatData = {
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    flavor: label,
    rollMode: game.settings.get("core", "rollMode"),
  };

  if (!dataset.result) {
    roll = new Roll(formula);
    await roll.evaluate();

    result = Number(roll.result);
    total = result;
    chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;
    chatData.rolls = [roll];
  } else {
    result = dataset.result;
    chatData.type = CONST.CHAT_MESSAGE_TYPES.OTHER;
  }

  // action setting
  let actiondice;
  if (actionType == "fellow") {
    if (result >= 1 && result <= 2) {
      actiondice = "f1";
    }
    if (result >= 3 && result <= 4) {
      actiondice = "f3";
    }
    if (result == 5) {
      actiondice = "f5";
    }
    if (result == 6) {
      actiondice = "f6";
    }
  }
  if (actionType == "daemon") {
    if (result == 1) {
      actiondice = "d1";
    }
    if (result >= 2 && result <= 3) {
      actiondice = "d2";
    }
    if (result >= 4 && result <= 5) {
      actiondice = "d4";
    }
    if (result == 6) {
      actiondice = "d6";
    }
  }

  const action = [];
  for (const item of actions) {
    if (item.system.actiondice == actiondice) {
      action.push(item);
    }
  }
  
  const canceldialog = actorData.canceldialog;
  chatData.content = await renderTemplate(
    "systems/sw25/templates/roll/roll-action.hbs",
    {
      total: total,
      actions: action,
      canceldialog: canceldialog,
    }
  );

  ChatMessage.create(chatData);
}
