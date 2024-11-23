/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActiveEffectConfig}
 */
export class SW25ActiveEffectConfig extends ActiveEffectConfig {
  /** @override */
  static get defaultOptions() {
    //return mergeObject(super.defaultOptions, {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sw25", "sheet", "active-effect-sheet"],
      template: "systems/sw25/templates/effect/active-effect-config.hbs",
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = await super.getData();

    // Use a safe clone of the actor data for further operations.
    const effectData = context.effect;

    // Set  keyClassification and kename of exsisting keys
    for (let i = 0; i < effectData.changes.length; i++) {
      let change = effectData.changes[i];
      switch (change.key) {
        case "system.attributes.efhitmod":
        case "system.attributes.efdmod":
        case "system.effect.efcvalue":
        case "system.effect.efspellcvalue":
        case "system.lt":
        case "system.cr":
        case "system.attributes.efwphalfmod":
        case "system.attributes.efsphalfmod":
        case "system.attributes.efdodgemod":
        case "system.attributes.efppmod":
        case "system.attributes.efmppmod":
        case "system.attributes.efdreduce":
        case "system.attributes.move.efmovemod":
          change.keyClassification = "battle";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.effect.vitres":
        case "system.effect.mndres":
        case "system.effect.init":
        case "system.effect.mknow":
        case "system.effect.allck":
        case "system.effect.allsk":
        case "system.eflootmod":
          change.keyClassification = "check";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.hp.efhpmod":
        case "system.mp.efmpmod":
        case "system.abilities.dex.efvaluemodify":
        case "system.abilities.agi.efvaluemodify":
        case "system.abilities.str.efvaluemodify":
        case "system.abilities.vit.efvaluemodify":
        case "system.abilities.int.efvaluemodify":
        case "system.abilities.mnd.efvaluemodify":
        case "system.abilities.dex.efmodify":
        case "system.abilities.agi.efmodify":
        case "system.abilities.str.efmodify":
        case "system.abilities.vit.efmodify":
        case "system.abilities.int.efmodify":
        case "system.abilities.mnd.efmodify":
          change.keyClassification = "parameter";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.efscmod":
        case "system.attributes.efcnmod":
        case "system.attributes.efwzmod":
        case "system.attributes.efprmod":
        case "system.attributes.efmtmod":
        case "system.attributes.effrmod":
        case "system.attributes.efdrmod":
        case "system.attributes.efdmmod":
        case "system.attributes.efabmod":
        case "system.effect.allmgp":
          change.keyClassification = "magicpower";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.efscckmod":
        case "system.attributes.efcnckmod":
        case "system.attributes.efwzckmod":
        case "system.attributes.efprckmod":
        case "system.attributes.efmtckmod":
        case "system.attributes.effrckmod":
        case "system.attributes.efdrckmod":
        case "system.attributes.efdmckmod":
        case "system.attributes.efabckmod":
        case "system.attributes.efmckall":
          change.keyClassification = "magicckroll";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.efscpwmod":
        case "system.attributes.efcnpwmod":
        case "system.attributes.efwzpwmod":
        case "system.attributes.efprpwmod":
        case "system.attributes.efmtpwmod":
        case "system.attributes.effrpwmod":
        case "system.attributes.efdrpwmod":
        case "system.attributes.efdmpwmod":
        case "system.attributes.efabpwmod":
        case "system.attributes.efmpwall":
          change.keyClassification = "magicpwroll";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.efmpsc":
        case "system.attributes.efmpcn":
        case "system.attributes.efmpwz":
        case "system.attributes.efmppr":
        case "system.attributes.efmpmt":
        case "system.attributes.efmpfr":
        case "system.attributes.efmpdr":
        case "system.attributes.efmpdm":
        case "system.attributes.efmpab":
        case "system.attributes.efmpall":
          change.keyClassification = "mpsave";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.efmsckmod":
        case "system.attributes.efmspwmod":
        case "system.attributes.efatckmod":
          change.keyClassification = "feature";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.":
          change.key = "";
          break;
        case null:
        case "":
          change.keyname = "";
          break;
        default:
          change.keyClassification = "input";
          break;
      }
    }

    return context;
  }
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

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
    const changeData = duplicate(effectData.changes); // Create a copy of changes array

    keytData.keyname = selected;
    keytData.key = "system." + selected;
    changeData[index].keyname = selected;
    changeData[index].key = "system." + selected;

    await this.object.update({ changeData });

    if (effectData.sheet.rendered)
      await effectData.sheet.render(true, { focus: false });
  }
}
