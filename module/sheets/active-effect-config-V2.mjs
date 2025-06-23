/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActiveEffectConfig}
 */
export class SW25ActiveEffectConfigV2 extends ActiveEffectConfig {
  /** @override */
  // static DEFAULT_OPTIONS = {
  //   classes: ["sw25", "sheet", "active-effect-sheet"],
  // };

  static PARTS = {
    header: { template: "templates/sheets/active-effect/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "templates/sheets/active-effect/details.hbs",
      scrollable: [""],
    },
    duration: { template: "templates/sheets/active-effect/duration.hbs" },
    changes: {
      template: "systems/sw25/templates/effect/changes.hbs",
      scrollable: ["ol[data-changes]"],
    },
    footer: { template: "templates/generic/form-footer.hbs" },
  };

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext() {
    // Retrieve base data structure.
    const context = await super._prepareContext();

    const systemPrefixedEffects = {};
    for (const [category, entries] of Object.entries(CONFIG.SW25.Effect)) {
      if (category === "keyClassifications") {
        systemPrefixedEffects[category] = entries;
        continue;
      }

      systemPrefixedEffects[category] = Object.fromEntries(
        Object.entries(entries).map(([key, value]) => [`system.${key}`, value])
      );
    }

    context.effectOptions = systemPrefixedEffects;

    // Use a safe clone of the actor data for further operations.
    // const effectData = context.source;

    /*
    // Set  keyClassification and kename of exsisting keys
    for (let i = 0; i < effectData.changes.length; i++) {
      let change = effectData.changes[i];
      change.keyname = change.key.replace(/^system\./, "");
      if (change.keyname in context.effectOptions.battle) {
        change.keyClassification = "battle";
      } else if (change.keyname in context.effectOptions.check) {
        change.keyClassification = "check";
      } else if (change.keyname in context.effectOptions.parameter) {
        change.keyClassification = "parameter";
      } else if (change.keyname in context.effectOptions.magicpower) {
        change.keyClassification = "magicpower";
      } else if (change.keyname in context.effectOptions.magicckroll) {
        change.keyClassification = "magicckroll";
      } else if (change.keyname in context.effectOptions.magicpwroll) {
        change.keyClassification = "magicpwroll";
      } else if (change.keyname in context.effectOptions.mpsave) {
        change.keyClassification = "mpsave";
      } else if (change.keyname in context.effectOptions.feature) {
        change.keyClassification = "feature";
      } else if (change.key === "system.") {
        change.key = "";
      } else if (change.key === null || change.key === "") {
        change.keyname = "";
      } else {
        change.keyClassification = "input";
      }
    }
    */
    return context;
  }
  /** @override */
  /*
  _onRender(contest, options) {
    super._onRender(contest, options);
    const html = $(this.element);

    html
      .find(".select-keyClassification")
      .change(this._selectKeyClassification.bind(this));
    html.find(".select-keyname").change(this._selectKeyname.bind(this));
  }

  async _selectKeyClassification(event) {
    event.preventDefault();
    const selected = $(event.currentTarget).val();
    const index = $(event.currentTarget)
      .closest(".effect-change")
      .data("index");
    const effectData = this.object;
    const keytData = effectData.changes[index];

    keytData.keyClassification = selected;
    keytData.keyname = "";
    keytData.key = "";

    if (effectData.sheet.rendered)
      await effectData.sheet.render(true, { focus: false });
  }

  async _selectKeyname(event) {
    event.preventDefault();
    const selected = $(event.currentTarget).val();
    const index = $(event.currentTarget)
      .closest(".effect-change")
      .data("index");
    const effectData = this.object;
    const keytData = effectData.changes[index];
    const changeData = foundry.utils.duplicate(effectData.changes); // Create a copy of changes array

    keytData.keyname = selected;
    keytData.key = "system." + selected;
    changeData[index].keyname = selected;
    changeData[index].key = "system." + selected;

    await this.object.update({ changeData });

    if (effectData.sheet.rendered)
      await effectData.sheet.render(true, { focus: false });
  }
  */
}
