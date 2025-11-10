/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {ActiveEffect}
 */
export class SW25ActiveEffect extends ActiveEffect {
  /** @override */
  prepareData() {
    // Prepare data for the active effect.
    super.prepareData();
  }

  /** @override */
  prepareDerivedData() {
    // preparation methods overridden (such as prepareBaseData()).
    const effectData = this;
  }

  /** @override */
  async update(data, options = {}) {
    if (data.changes) {
      data.changes = SW25ActiveEffect.applyChangeData(data.changes);
    }
    return super.update(data, options);
  }

  /** @override */
  static async create(data, options = {}) {
    if (data.changes) {
      data.changes = SW25ActiveEffect.applyChangeData(data.changes);
    }
    return super.create(data, options);
  }

  static applyChangeData(changes) {
    return changes.map((change) => {
      if (!change.keyClassification) {
        change.keyClassification = "";
      }
      if (!change.keyname) {
        change.keyname = "";
      }
      if (!change.key) {
        if (change.keyname != "") change.key = "system." + change.keyname;
        else change.key = "";
      }
      if (change.keyClassification == "checkname")
        change.key = "system.effect.checkinputmod." + change.checkname;

      if (change.key.startsWith("input,")) {
        change.key = change.key.replace(/^input,/, "");
      } else if (change.key.startsWith("checkinput,")) {
        change.key = change.key.replace(/^checkinput,/,"system.effect.checkinputmod.");
      }
      return change;
    });
  }
}
