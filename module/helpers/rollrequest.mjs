/**
 * Execute roll request dialog.
 */
export async function rollreq() {
  let method = "skill";
  let checkname = "-";
  let ability = "-";

  const tokens = canvas.tokens.placeables;
  const skillNames = new Set();
  const checkNames = new Set();
  for (const token of tokens) {
    if (token.actor) {
      const items = token.actor.items;
      for (const item of items) {
        if (item.type === "skill") skillNames.add(item.name);
        if (item.type === "check") checkNames.add(item.name);
      }
    }
  }
  const skilllist = Array.from(skillNames);
  const checklist = Array.from(checkNames);

  await renderDialog(method, checkname, ability, skilllist, checklist);

  async function renderDialog(
    method,
    checkname,
    ability,
    skilllist,
    checklist
  ) {
    const html = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-dialog.hbs",
      { method, checkname, ability, skilllist, checklist }
    );

    const dialog = new Dialog({
      title: game.i18n.localize("SETTING.rollRequest"),
      content: html,
      buttons: {
        buttonloot: {
          label: game.i18n.localize("SETTING.rollRequest"),
          callback: async (html) => {
            const message = html.find('[name="message"]').val();
            const checkName = html.find('[name="checkname"]').val();
            const inputName = html.find('[name="inputcheckname"]').val();
            const refAbility = html.find('[name="ability"]').val();
            const modifier = parseInt(html.find('[name="modifier"]').val(), 10);
            const targetValue = parseInt(
              html.find('[name="target-value"]').val(),
              10
            );

            const chatData = {
              speaker: ChatMessage.getSpeaker({ alias: "Gamemaster" }),
              flags: {
                checkName: checkName,
                inputName: inputName,
                refAbility: refAbility,
                modifier: modifier,
                targetValue: targetValue,
                method: method,
              },
            };

            chatData.content = "";
            let name = checkName;
            if (checkName == "-") name = "";
            if (checkName == "di") name = inputName;
            if (method == "skill" && checkName && checkName != "-") {
              let i18ncat =
                refAbility.charAt(0).toUpperCase() + refAbility.slice(1);
              let abi =
                " + " + game.i18n.localize(`SW25.Ability.${i18ncat}.abbr`);
              if (refAbility == "-") abi = "";
              name = `${name}${abi}`;
              if (checkName == "adv")
                name = `${game.i18n.localize(
                  "SW25.Attributes.Advlevel"
                )}${abi}`;
            }

            if (message && !targetValue) chatData.content = `${message}`;
            if (!message && targetValue)
              chatData.content = `<b>${game.i18n.localize(
                "SW25.Difficulty"
              )} : ${targetValue}</b>`;
            if (message && targetValue)
              chatData.content = `${message} <b>(${game.i18n.localize(
                "SW25.Difficulty"
              )} : ${targetValue}</b>)`;

            if (modifier) {
              let mod = modifier;
              if (mod > 0) mod = `+${modifier}`;
              chatData.content += `<div><button class="buttonclick" data-buttontype="buttonrollreq">${name} ${game.i18n.localize(
                "SW25.Check"
              )} (${mod})</button></div>`;
            } else
              chatData.content += `<div><button class="buttonclick" data-buttontype="buttonrollreq">${name} ${game.i18n.localize(
                "SW25.Check"
              )}</button></div>`;

            ChatMessage.create(chatData);
          },
        },
        cancel: { label: game.i18n.localize("Cancel") },
      },
      render: (html) => {
        html.find('input[name="method"]').change(async (event) => {
          method = event.target.value;
          checkname = html.find('[name="checkname"]').val();
          ability = html.find('[name="ability"]').val();
          await updateDialog(method, checkname, ability, skilllist, checklist);
        });
        html.find('select[name="checkname"]').change(async (event) => {
          checkname = event.target.value;
          ability = html.find('[name="ability"]').val();
          await updateDialog(method, checkname, ability, skilllist, checklist);
        });
      },
    });

    dialog.render(true);
  }

  async function updateDialog(
    method,
    checkname,
    ability,
    skilllist,
    checklist
  ) {
    const html = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-dialog.hbs",
      { method, checkname, ability, skilllist, checklist }
    );
    const variable = $(html).find("#variablearea").html();
    $("form #variablearea").html(variable);

    $("input[name='method']").change(async (event) => {
      method = event.target.value;
      checkname = $("select[name='checkname']").val();
      ability = $("select[name='ability']").val();
      await updateDialog(method, checkname, ability, skilllist, checklist);
    });
    $("select[name='checkname']").change(async (event) => {
      checkname = event.target.value;
      ability = $("select[name='ability']").val();
      await updateDialog(method, checkname, ability, skilllist, checklist);
    });
  }
}
