export const SW25 = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
SW25.abilities = {
  dex: "SW25.Ability.Dex.long",
  agi: "SW25.Ability.Agi.long",
  str: "SW25.Ability.Str.long",
  vit: "SW25.Ability.Vit.long",
  int: "SW25.Ability.Int.long",
  mnd: "SW25.Ability.Mnd.long",
};

SW25.abilityAbbreviations = {
  dex: "SW25.Ability.Dex.abbr",
  agi: "SW25.Ability.Agi.abbr",
  str: "SW25.Ability.Str.abbr",
  vit: "SW25.Ability.Vit.abbr",
  int: "SW25.Ability.Int.abbr",
  mnd: "SW25.Ability.Mnd.abbr",
};

SW25.resistCheck = {
  Dodge: "SW25.Resist.Check.Dodge",
  Vitres: "SW25.Resist.Check.Vitres",
  Mndres: "SW25.Resist.Check.Mndres",
  input: "SW25.Effect.DirectInput",
};

SW25.resistResult = {
  decide: "SW25.Resist.Result.decide",
  any: "SW25.Resist.Result.any",
  none: "SW25.Resist.Result.none",
  disappear: "SW25.Resist.Result.disappear",
  halving: "SW25.Resist.Result.halving",
  shortening: "SW25.Resist.Result.shortening"
};