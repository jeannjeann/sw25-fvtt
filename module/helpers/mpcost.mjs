/**
 * Execute  MP cost event and return the result.
 */
export async function mpCost(token, cost, name, type, meta, chat, base) {
  const targetTokenId = token.id;
  const actor = token.actor;
  let targetMP = actor.system.mp.value;
  let resultValue = cost;
  let resultMP = targetMP;
  let chatResult = 0;
  let metaB = false;
  if (type == "spell") metaB = true;

  // Calculate MP
  if (targetMP - resultValue >= 0) {
    resultMP = targetMP - resultValue;
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

  // Chat message
  if (meta == 1) {
    const speaker = ChatMessage.getSpeaker({ actor: actor });
    const rollMode = game.settings.get("core", "rollMode");
    let label = name + " (" + game.i18n.localize("SW25.Mp") + ")";
    let baseMP = targetMP;

    let chatData = {
      speaker: speaker,
      flavor: label,
      rollMode: rollMode,
    };

    chatData.content = await renderTemplate(
      "systems/sw25/templates/roll/mp-apply.hbs",
      {
        targetMP: targetMP,
        resultMP: chatResult,
        metaB: metaB,
      }
    );

    chatData.flags = {
      tokenId: targetTokenId,
      cost: cost,
      name: name,
      type: type,
      meta: false,
      base: baseMP,
    };

    ChatMessage.create(chatData);
  } else {
    let label = name + " (" + game.i18n.localize("SW25.Mp") + " x" + meta + ")";
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
        resultMP: chatResult,
        metaB: metaB,
      }
    );
    await chat.update(chatData);
  }
}
