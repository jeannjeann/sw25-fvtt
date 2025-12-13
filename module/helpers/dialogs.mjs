// Select Roll Method Dialog
export async function targetRollDialog(targetTokens, label) {
  if (targetTokens.size == 1) {
    return "once";
  }
  if (targetTokens.size >= 2) {
    return new Promise((resolve) => {
      let rollMethod = null;
      new Dialog({
        title: label,
        content: game.i18n.localize("DIALOG.rollMethod"),
        buttons: {
          option1: {
            label: game.i18n.localize("DIALOG.once"),
            callback: () => {
              rollMethod = "once";
              resolve(rollMethod);
            },
          },
          option2: {
            label: game.i18n.localize("DIALOG.individual"),
            callback: () => {
              rollMethod = "individual";
              resolve(rollMethod);
            },
          },
          cancel: {
            label: game.i18n.localize("Cancel"),
            callback: () => {
              rollMethod = "cancel";
              resolve(rollMethod);
            },
          },
        },
        default: "cancel",
        close: (html) => {
          if (!rollMethod) {
            rollMethod = "cancel";
            resolve(rollMethod);
          }
        },
      }).render(true);
    });
  }
}

// Select Target Dialog
export async function targetSelectDialog(title) {
  // get all tokens
  const tokens = canvas.tokens.placeables;

  // no token error
  if (tokens.length === 0) {
    return ui.notifications.warn(game.i18n.localize("SW25.NotTokenwarn"));
  }

  // categorize tokens
  const categories = {
    friendly: [],
    neutral: [],
    hostile: [],
  };

  tokens.forEach((token) => {
    // invisible check.
    if (!game.user.isGM && token.document.hidden) return;
    
    switch (token.document.disposition) {
      case 1:
        categories.friendly.push(token);
        break;
      case 0:
        categories.neutral.push(token);
        break;
      case -1:
        categories.hostile.push(token);
        break;
    }
  });

  // sort by name (Unicode)
  for (const key in categories) {
    categories[key].sort((a, b) => a.name.localeCompare(b.name));
  }

  // create Dialog contents
  const createCategoryBox = (category, title, categoryId) => {
    let box = `<fieldset class="target-select">
      <legend id="${categoryId}-toggle" style="cursor: pointer;">
        <span class="selectable">${title}</span>
      </legend>`;
    category.forEach((token) => {
      console.log(token);
      box += `
        <div class="token-check-wrap ${categoryId}-token">
          <input type="checkbox" id="token-${token.id}" name="${categoryId}" value="${token.id}">
          <label for="token-${token.id}">
            <img src="${token.document.texture.src}" class="token-icon">
            ${token.name}
          </label>
        </div>`;
    });
    box += `</fieldset>`;
    return box;
  };

  const content = `
    <div style="width: 100%;">
      <div class="select-all-wrap" style="margin-bottom:6px;">
        <label style="cursor:pointer;">
          <input type="checkbox" id="select-all-toggle">
          <strong>${game.i18n.localize("SW25.SelectAll")}</strong>
        </label>
      </div>

      ${createCategoryBox(
        categories.friendly,
        game.i18n.localize("SW25.Disposition.Friendly"),
        "friendly"
      )}
      ${createCategoryBox(
        categories.neutral,
        game.i18n.localize("SW25.Disposition.Neutral"),
        "neutral"
      )}
      ${createCategoryBox(
        categories.hostile,
        game.i18n.localize("SW25.Disposition.Hostile"),
        "hostile"
      )}
    </div>`;

  // show Dialog
  return new Promise((resolve) => {
    const dialog = new Dialog({
      title: game.i18n.localize("SW25.TargetSelect") + ` : ${title}`,
      content: content,
      buttons: {
        process: {
          label: game.i18n.localize("OK"),
          callback: (html) => {
            // get selected token ID
            const selectedIds = html
              .find('input[type="checkbox"]:checked')
              .map((_, el) => el.value)
              .get();

            // no token error
            if (selectedIds.length === 0) {
              ui.notifications.warn(game.i18n.localize("SW25.Notargetwarn"));
              return false;
            }

            // get selected tokens
            const selectedTokens = canvas.tokens.placeables.filter((token) =>
              selectedIds.includes(token.id)
            );

            resolve(selectedTokens);
          },
        },
        cancel: {
          label: game.i18n.localize("Cancel"),
          callback: () => resolve([]),
        },
      },
      default: "cancel",
    });

    dialog.render(true);

    // category name click hook
    Hooks.once("renderDialog", (app, html) => {
      const addToggleHandler = (categoryId) => {
        const toggle = html.find(`#${categoryId}-toggle`);
        const checkboxes = html.find(`input[name="${categoryId}"]`);

        toggle.on("click", () => {
          const allChecked = checkboxes.toArray().every((cb) => cb.checked);
          checkboxes.prop("checked", !allChecked).trigger("change");
        });

        // change font when selected
        checkboxes.on("change", (event) => {
          const checkbox = $(event.currentTarget);
          const label = checkbox.next("label");
          label.css("font-weight", checkbox.is(":checked") ? "bold" : "normal");
        });
      };

      addToggleHandler("friendly");
      addToggleHandler("neutral");
      addToggleHandler("hostile");

      const allCheckboxes = html.find('input[type="checkbox"][id^="token-"]');
      const selectAll = html.find("#select-all-toggle");

      const updateSelectAllState = () => {
        const checkedCount = allCheckboxes.filter(":checked").length;
        selectAll.prop("checked", checkedCount === allCheckboxes.length);
      };

      updateSelectAllState();

      selectAll.on("change", () => {
        const checked = selectAll.is(":checked");
        allCheckboxes.prop("checked", checked).trigger("change");
      });

      // set dialog width
      html[0].style.width = "500px";
    });
  });
}
