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
