/**
 * Execute  MP cost event and return the result.
 */
export async function mpCost(
  token,
  cost,
  name,
  type,
  meta,
  chat,
  base,
  fluc = null
) {
  const targetTokenId = token.id;
  const actor = token.actor;
  let targetMP = base ?? actor.system.mp.value;
  let resultMP = targetMP;
  let chatResult = 0;
  let metaB = false;
  let multi = meta ?? 1;
  let add = fluc ?? 0;
  let flucMes = fluc ? (add < 0 ? `${add}` : `+${add}`) : null;
  let costValue = cost * multi + add;
  if (type == "spell") metaB = true;
  if (type == "action") metaB = true;
  let isView = false;
  if (CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER <= actor.ownership.default)
    isView = true;

  // Calculate MP
  if (targetMP - costValue >= 0) {
    resultMP = targetMP - costValue;
    chatResult = resultMP;
  } else {
    resultMP = 0;
    chatResult = game.i18n.localize("SW25.Shortage");
  }

  // Apply MP cost
  if (game.user.isGM) {
    actor.update({
      "system.mp.value": resultMP,
    });
  } else {
    game.socket.emit("system.sw25", {
      method: "applyMp",
      targetToken: targetTokenId,
      resultMP: resultMP,
    });
  }

  // Cost Message.
  let costMes =
    cost +
    (meta && meta > 1 ? ` x ${meta}` : "") +
    (flucMes ? ` ${flucMes}` : "") +
    (((meta && meta > 1) || flucMes) ? ` = ${costValue}` : "");

  // Chat message
  if (meta == 1 && fluc == null) {
    const speaker = ChatMessage.getSpeaker({ actor: actor });
    const rollMode = game.settings.get("core", "rollMode");
    let label =
      name +
      " (" +
      game.i18n.localize("SW25.Mp") +
      cost +
      (flucMes ?? "") +
      ")";
    let baseMP = targetMP;

    let chatData = {
      speaker: speaker,
      flavor: label,
      rollMode: rollMode,
    };

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/mp-apply.hbs",
      {
        cost: costValue,
        targetMP: targetMP,
        resultMP: chatResult,
        fluc: flucMes,
        metaB: metaB,
        isView: isView,
      }
    );

    chatData.flags = {
      sw25: {
        tokenId: targetTokenId,
        cost: cost,
        name: name,
        type: type,
        meta: 1,
        base: baseMP,
        fluc: fluc,
      },
    };

    ChatMessage.create(chatData);
  } else {
    let label =
      name +
      " (" +
      game.i18n.localize("SW25.Mp") +
      cost +
      " x" +
      meta +
      (flucMes ?? "") +
      ")";
    let metaB = false;
    if (type == "spell") metaB = true;
    if (type == "action") metaB = true;

    let chatData = {
      flavor: label,
      flags: {
        sw25: {
          meta: meta,
          type: type,
          fluc: fluc,
        },
      },
    };
    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/mp-apply.hbs",
      {
        cost: costMes,
        targetMP: base,
        resultMP: chatResult,
        metaB: metaB,
        isView: isView,
      }
    );
    await chat.update(chatData);
  }
}

/**
 * Execute  HP cost event and return the result.
 */
export async function hpCost(token, cost, max, name, type) {
  const targetTokenId = token.id;
  const actor = token.actor;
  let targetHP = actor.system.hp.value;

  let resultHP = targetHP;
  let chatResult = 0;
  let costLabel = cost;
  if (max) costLabel = `${cost}(${max})`;
  let isView = false;
  if (CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER <= actor.ownership.default)
    isView = true;

  // roll &  Calculate HP cost
  let result = new Roll(cost);
  await result.evaluate();
  let totalValue = Number(result.result);
  let resultValue = totalValue;
  let limit = false;
  let nofix = false;
  if (result.terms[0].results) {
    nofix = true;
    if (result.terms[0].results.length >= 2) {
      let fumble = true;
      for (let i = 0; i < result.terms[0].results.length; i++) {
        if (result.terms[0].results[i].result != 1) fumble = false;
      }
      if (fumble) {
        resultValue = 0;
        limit = true;
      }
    }
  }
  if (max) {
    let maxValue = Number(max);
    if (resultValue >= maxValue) {
      resultValue = maxValue;
      limit = true;
    }
  }

  // Calculate HP
  resultHP = targetHP - resultValue;
  chatResult = resultHP;
  if (chatResult <= 0) {
    chatResult = chatResult + " (" + game.i18n.localize("SW25.UnderZero") + ")";
  }
  if (resultValue == 0) {
    chatResult = game.i18n.localize("SW25.NoCost");
  }

  // Apply HP cost
  if (game.user.isGM) {
    actor.update({
      "system.hp.value": resultHP,
    });
  } else {
    game.socket.emit("system.sw25", {
      method: "applyHp",
      targetToken: targetTokenId,
      resultHP: resultHP,
    });
  }

  // Chat message
  const speaker = ChatMessage.getSpeaker({ actor: actor });
  const rollMode = game.settings.get("core", "rollMode");
  let label = name + " (" + game.i18n.localize("SW25.Hp") + ` ${costLabel})`;
  let baseHP = targetHP;

  let chatData = {
    speaker: speaker,
    flavor: label,
    rollMode: rollMode,
    rolls: [result],
  };

  chatData.content = await renderTemplate(
    "systems/sw25/templates/roll/hp-apply.hbs",
    {
      nofix: nofix,
      formula: costLabel,
      resultValue: resultValue,
      totalValue: totalValue,
      limit: limit,
      tooltip: await result.getTooltip(),
      targetHP: targetHP,
      resultHP: chatResult,
      isView: isView,
    }
  );

  chatData.flags = {
    sw25: {
      tokenId: targetTokenId,
      cost: resultValue,
      name: name,
      type: type,
      base: baseHP,
    },
  };

  ChatMessage.create(chatData);
}
