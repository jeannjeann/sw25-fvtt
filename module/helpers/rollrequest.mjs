import { SW25 } from "./config.mjs";

/**
 * Execute roll request dialog.
 */
export async function rollreq() {
  let method = "skill";
  let checkname = "";
  let ability = "";

  const tokens = canvas.tokens.placeables;
  const skills = new Set();
  const checks = new Set();
  for (const token of tokens) {
    if (token.actor) {
      const items = token.actor.items;
      for (const item of items) {
        if (item.type === "skill") skills.add(item);
        if (item.type === "check") checks.add(item);
      }
    }
  }
  const skilllist = Array.from(skills);
  const checklist = Array.from(checks);
  const abilities = SW25.abilityAbbreviations;

  await renderDialog(
    method,
    checkname,
    ability,
    skilllist,
    checklist,
    abilities
  );

  async function renderDialog(
    method,
    checkname,
    ability,
    skilllist,
    checklist,
    abilities
  ) {
    const html = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-dialog.hbs",
      { method, checkname, ability, skilllist, checklist, abilities }
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
                sw25: {
                  checkName: checkName,
                  inputName: inputName,
                  refAbility: refAbility,
                  modifier: modifier,
                  targetValue: targetValue,
                  method: method,
                }
              },
            };
            chatData.content = "";
            let name = checkName;
            if (checkName == "di") name = inputName;
            if (method == "skill" && checkName && checkName != "") {
              let abi =
                " + " + game.i18n.localize(`SW25.Ability.${refAbility.capitalize()}.abbr`);
              if (refAbility == "") abi = "";
              name = `${name}${abi}`;
              if (checkName == "adv")
                name = `${game.i18n.localize(
                  "SW25.Attributes.Advlevel"
                )}${abi}`;
            }
            let difficulty = targetValue
              ? game.i18n.localize("SW25.Difficulty")
              : "";

            let mod = "";
            if (modifier) {
              mod = modifier > 0 ? `+${modifier}` : modifier;
            }

            chatData.content = await renderTemplate(
              "systems/sw25/templates/roll/rollreq-card.hbs",
              {
                checkName: name,
                message: message,
                difficulty: difficulty,
                targetValue: targetValue,
                mod: mod,
              }
            );
            ChatMessage.create(chatData);
          },
        },
        cancel: { label: game.i18n.localize("Cancel") },
      },
      default: "buttonloot",
      render: (html) => {
        html.find('input[name="method"]').change(async (event) => {
          method = event.target.value;
          checkname = html.find('[name="checkname"]').val();
          ability = html.find('[name="ability"]').val();
          await updateDialog(
            method,
            checkname,
            ability,
            skilllist,
            checklist,
            abilities
          );
        });
        html.find('select[name="checkname"]').change(async (event) => {
          checkname = event.target.value;
          ability = html.find('[name="ability"]').val();
          await updateDialog(
            method,
            checkname,
            ability,
            skilllist,
            checklist,
            abilities
          );
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
    checklist,
    abilities
  ) {
    const html = await renderTemplate(
      "systems/sw25/templates/roll/rollreq-dialog.hbs",
      { method, checkname, ability, skilllist, checklist, abilities }
    );
    const variable = $(html).find("#variablearea").html();
    $("form #variablearea").html(variable);

    $("input[name='method']").change(async (event) => {
      method = event.target.value;
      checkname = $("select[name='checkname']").val();
      ability = $("select[name='ability']").val();
      await updateDialog(
        method,
        checkname,
        ability,
        skilllist,
        checklist,
        abilities
      );
    });
    $("select[name='checkname']").change(async (event) => {
      checkname = event.target.value;
      ability = $("select[name='ability']").val();
      await updateDialog(
        method,
        checkname,
        ability,
        skilllist,
        checklist,
        abilities
      );
    });
  }
}
