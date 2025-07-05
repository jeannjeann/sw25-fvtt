/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/sw25/templates/actor/parts/actor-skills.hbs",
    "systems/sw25/templates/actor/parts/actor-checks.hbs",
    "systems/sw25/templates/actor/parts/actor-checkskills.hbs",
    "systems/sw25/templates/actor/parts/actor-battlechecks.hbs",
    "systems/sw25/templates/actor/parts/actor-resources.hbs",
    "systems/sw25/templates/actor/parts/actor-weapons.hbs",
    "systems/sw25/templates/actor/parts/actor-battleweapons.hbs",
    "systems/sw25/templates/actor/parts/actor-armors.hbs",
    "systems/sw25/templates/actor/parts/actor-battlearmors.hbs",
    "systems/sw25/templates/actor/parts/actor-accessories.hbs",
    "systems/sw25/templates/actor/parts/actor-battleaccessories.hbs",
    "systems/sw25/templates/actor/parts/actor-items.hbs",
    "systems/sw25/templates/actor/parts/actor-combatabilities.hbs",
    "systems/sw25/templates/actor/parts/actor-enhancearts.hbs",
    "systems/sw25/templates/actor/parts/actor-magicalsongs.hbs",
    "systems/sw25/templates/actor/parts/actor-ridingtricks.hbs",
    "systems/sw25/templates/actor/parts/actor-alchemytechs.hbs",
    "systems/sw25/templates/actor/parts/actor-phaseareas.hbs",
    "systems/sw25/templates/actor/parts/actor-tactics.hbs",
    "systems/sw25/templates/actor/parts/actor-infusion.hbs",
    "systems/sw25/templates/actor/parts/actor-barbarousskill.hbs",
    "systems/sw25/templates/actor/parts/actor-essenceweave.hbs",
    "systems/sw25/templates/actor/parts/actor-otherfeature.hbs",
    "systems/sw25/templates/actor/parts/actor-raceabilities.hbs",
    "systems/sw25/templates/actor/parts/actor-languages.hbs",
    "systems/sw25/templates/actor/parts/actor-spells.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-sorcerer.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-conjurer.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-wizard.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-priest.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-magitech.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-fairy.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-druid.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-daemon.hbs",
    "systems/sw25/templates/actor/parts/actor-spells-abyssal.hbs",
    "systems/sw25/templates/actor/parts/actor-effects.hbs",
    "systems/sw25/templates/actor/parts/actor-monsterabilities.hbs",
    "systems/sw25/templates/actor/parts/actor-monsterspells.hbs",
    "systems/sw25/templates/actor/parts/actor-monsterskills.hbs",
    "systems/sw25/templates/actor/parts/actor-actions.hbs",
    "systems/sw25/templates/actor/parts/actor-actions-fellow.hbs",
    "systems/sw25/templates/actor/parts/actor-actions-daemon.hbs",
    "systems/sw25/templates/actor/parts/actor-useitems.hbs",
    "systems/sw25/templates/actor/parts/actor-spell-item.hbs",
    "systems/sw25/templates/actor/parts/actor-bookmark-item.hbs",
    // Item partials
    "systems/sw25/templates/item/parts/item-customs.hbs",
    "systems/sw25/templates/item/parts/item-effects.hbs",
    "systems/sw25/templates/item/parts/item-elements.hbs",
    "systems/sw25/templates/item/parts/item-usepower.hbs",
    "systems/sw25/templates/item/parts/item-usedice.hbs",
    // Dialog
    "systems/sw25/templates/roll/rollreq-dialog.hbs",
    // Helper
    "systems/sw25/templates/helper/action-marks.hbs",
  ]);
};
