/**
 * Execute  Loot roll event and return the result.
 */
export async function lootRoll(actor) {
  const actorId = actor.id;
  const actorData = actor.system;

  const lootlist = actorData.loot;
  const lootLines = lootlist
    .split(/<br>|<\/?p>/)
    .filter((line) => line.trim() !== "");

  const lootitems = lootLines.map((line) => {
    const cleanedLine = line.replace(/<[^>]*>/g, "").trim();
    const [rangePart, itemPart] = cleanedLine.split(/[：:]/);
    const rangPartNum = rangePart.replace(/[０-９]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    });
    const rangeMatch = rangPartNum.trim().match(/^(\d+)?[ー－～~-](\d+)?$/);
    let range = {};
    if (rangeMatch) {
      range = {
        min: rangeMatch[1] ? parseInt(rangeMatch[1], 10) : 0,
        max: rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 100,
      };
    } else {
      range = {
        min: "etc",
        max: "etc",
      };
    }
    return {
      range: range,
      item: itemPart ? itemPart.trim() : "",
    };
  });

  const speaker = ChatMessage.getSpeaker({ actor: actor });
  const rollMode = game.settings.get("core", "rollMode");
  //let label = game.i18n.localize("SW25.Monster.Loot");

  let chatData = {
    speaker: speaker,
    //flavor: label,
    rollMode: rollMode,
  };

  chatData.content = await renderTemplate(
    "systems/sw25/templates/roll/lootlist.hbs",
    {
      lootlist: lootlist,
    }
  );

  chatData.flags = {
    actorId: actorId,
    loot: lootitems,
  };

  ChatMessage.create(chatData);
}
