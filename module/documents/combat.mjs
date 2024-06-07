import { effectInitPC } from "../sw25.mjs";
/**
 * Extend the basic Combat with some very simple modifications.
 * @extends {Combat}
 */
export class SW25Combat extends Combat {
  /**
   * Override rollInitiative to customize initiative rolling.
   * @param {Array|string} ids - The combatant IDs for which to roll initiative.
   */
  async rollInitiative(ids) {
    const combatants = ids.map((id) => this.combatants.get(id));
    const updates = [];
    for (const combatant of combatants) {
      const actor = combatant.actor;
      if (!actor) continue;
      const actorData = actor.system;

      let initiativeFormula = actorData.initiativeFormula;

      // Initiative roll
      const roll = new Roll(initiativeFormula, actor.getRollData());
      await roll.evaluate({ async: true });
      updates.push({
        _id: combatant.id,
        initiative: roll.total,
      });

      // Chat message
      let flavor =
        `${actor.name}` + " - " + game.i18n.localize("SW25.Monster.Preemptive");
      if (actor.type == "character")
        flavor = `${actor.name}` + " - " + effectInitPC;
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: flavor,
      });
    }

    // Update combat tracker
    if (updates.length > 0) {
      await this.updateEmbeddedDocuments("Combatant", updates);
    }
  }
}
