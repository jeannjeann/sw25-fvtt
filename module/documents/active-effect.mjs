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
  }
}
