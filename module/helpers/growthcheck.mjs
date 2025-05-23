/**
 * Execute  Growth roll event and return the result.
 */
export async function growthCheck(actor) {
  let target = actor;

  const rollMode = game.settings.get("core", "rollMode");
  const formula = "2d6";
  const chatFormula = "1D6 , 1D6";

  let roll = new Roll(formula);
  await roll.evaluate();

  const roll1 = roll.dice[0].results[0].result;
  const roll2 = roll.dice[0].results[1].result;

  const abilities = ["dex", "agi", "str", "vit", "int", "mnd"];

  let growth1Label = abilities[roll1 - 1];
  let growth1LabelUc =
    growth1Label.charAt(0).toUpperCase() + growth1Label.slice(1).toLowerCase();
  let growth1 = target.system.abilities[`${growth1Label}`];
  let growth1Name = game.i18n.localize(`SW25.Ability.${growth1LabelUc}.long`);
  let growth1Abbr = game.i18n.localize(`SW25.Ability.${growth1LabelUc}.abbr`);
  let growth1Die = game.i18n.localize(`SW25.Ability.${growth1LabelUc}.die`);
  let growth1after = growth1.value + 1;
  let growth1aftermod = Math.floor(growth1after / 6);
  let upcss1 = "";
  if (growth1.mod < growth1aftermod) upcss1 = `color: #0f6f0f;`;

  let growth2Label = abilities[roll2 - 1];
  let growth2LabelUc =
    growth2Label.charAt(0).toUpperCase() + growth2Label.slice(1).toLowerCase();
  let growth2 = target.system.abilities[`${growth2Label}`];
  let growth2Name = game.i18n.localize(`SW25.Ability.${growth2LabelUc}.long`);
  let growth2Abbr = game.i18n.localize(`SW25.Ability.${growth2LabelUc}.abbr`);
  let growth2Die = game.i18n.localize(`SW25.Ability.${growth2LabelUc}.die`);
  let growth2after = growth2.value + 1;
  let growth2aftermod = Math.floor(growth2after / 6);
  let upcss2 = "";
  if (growth2.mod < growth2aftermod) upcss2 = ` color: #0f6f0f;`;

  let result = `
        <span style="font-size: 0.8em;">
            <span style="font-size: 0.5em;">${growth1Abbr}:</span>${growth1.value}<span style="font-size: 0.7em;">(+${growth1.mod})</span> > ${growth1after}<span style="font-size: 0.7em;${upcss1}">(+${growth1aftermod})</span> , 
            <span style="font-size: 0.5em;">${growth2Abbr}:</span>${growth2.value}<span style="font-size: 0.7em;">(+${growth2.mod})</span> > ${growth2after}<span style="font-size: 0.7em;;${upcss2}">(+${growth2aftermod})</span>
        </span>
    `;

  let chatContent = await renderTemplate(
    "systems/sw25/templates/roll/roll-check.hbs",
    {
      formula: chatFormula,
      tooltip: await roll.getTooltip(),
      total: result,
    }
  );

  chatContent += `
      <div class="flexrow">
        <button class="increase-ability" data-ability="${growth1Label}" data-value="${growth1.valuegrowth}">${growth1Die} : ${growth1Name}</button>
        <button class="increase-ability" data-ability="${growth2Label}" data-value="${growth2.valuegrowth}">${growth2Die} : ${growth2Name}</button>
      </div>
    `;

  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    flavor: game.i18n.localize(`SW25.Ability.Growth`),
    content: chatContent,
    rollMode: rollMode,
    rolls: [roll],
    flags: {
      sw25: {
        actor: `${actor._id}`,
      },
    },
  };

  ChatMessage.create(chatData);

  Hooks.once("renderChatMessage", (message, html, data) => {
    html.find(".increase-ability").click(async function (event) {
      event.preventDefault();

      const beforeValueGrowth = parseInt(event.currentTarget.dataset.value);
      const target = game.actors.get(message.flags.sw25.actor);
      const growth = event.currentTarget.dataset.ability;
      const currentValueGrowth = target.system.abilities[growth].valuegrowth;
      const afterValueGrowth = currentValueGrowth + 1;
      let ability =
        growth.charAt(0).toUpperCase() + growth.slice(1).toLowerCase();
      let abilityName = game.i18n.localize(`SW25.Ability.${ability}.long`);
      let abilityDie = game.i18n.localize(`SW25.Ability.${ability}.die`);

      if (beforeValueGrowth == currentValueGrowth) {
        await target.update({
          [`system.abilities.${growth}.valuegrowth`]: afterValueGrowth,
        });

        let chatContent = `<div class="growth">
          <span class="fontsize12">${abilityDie}${abilityName}&nbsp;</span>:&nbsp;
          ${game.i18n.localize("SW25.Ability.Growth")}&nbsp;
          <span class="fontsize12 before">${currentValueGrowth}</span>
          ><span class="fontsize11">></span><span class="fontsize12">></span> 
          <span class="fontsize15 after">${afterValueGrowth}</span>
          </div>`;
        let chatData = {
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: target }),
          content: chatContent,
        };

        ChatMessage.create(chatData);
      }
    });
  });
}
