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

SW25.weaponCategories = {
  sword: "SW25.Item.Weapon.Sword",
  axe: "SW25.Item.Weapon.Axe",
  spear: "SW25.Item.Weapon.Spear",
  mace: "SW25.Item.Weapon.Mace",
  staff: "SW25.Item.Weapon.Staff",
  flail: "SW25.Item.Weapon.Flail",
  warhammer: "SW25.Item.Weapon.Warhammer",
  grapple: "SW25.Item.Weapon.Grapple",
  throw: "SW25.Item.Weapon.Throw",
  bow: "SW25.Item.Weapon.Bow",
  crossbow: "SW25.Item.Weapon.Crossbow",
  gun: "SW25.Item.Weapon.Gun",
};

SW25.weaponTypes = {
  blade: "SW25.Item.Weapon.Blade",
  blow: "SW25.Item.Weapon.Blow",
  both: "SW25.Item.Weapon.Both",
  other: "SW25.Item.Weapon.Other",
};

SW25.weaponUsages = {
  "1H": "SW25.Item.Weapon.1H",
  "1HB": "SW25.Item.Weapon.1HB",
  "1HR": "SW25.Item.Weapon.1HR",
  "1HT": "SW25.Item.Weapon.1HT",
  "1HN": "SW25.Item.Weapon.1HN",
  "1H#": "SW25.Item.Weapon.1H#",
  "2H": "SW25.Item.Weapon.2H",
  "S2H": "SW25.Item.Weapon.S2H",
  "P2H": "SW25.Item.Weapon.P2H",
  "2HT": "SW25.Item.Weapon.2HT",
  "2H#": "SW25.Item.Weapon.2H#",
};

SW25.ranks = {
  B: "B",
  A: "A",
  S: "S",
  SS: "SS",
};

SW25.armorCategorys = {
  nonmetalarmor: "SW25.Item.Armor.Nonmetalarmor",
  metalarmor: "SW25.Item.Armor.Metalarmor",
  shield: "SW25.Item.Armor.Shield",
  other: "SW25.Item.Armor.Other",
};

SW25.accparts = {
  head: "SW25.Item.Accessory.Head",
  face: "SW25.Item.Accessory.Face",
  ear: "SW25.Item.Accessory.Ear",
  neck: "SW25.Item.Accessory.Neck",
  back: "SW25.Item.Accessory.Back",
  rhand: "SW25.Item.Accessory.Rhand",
  lhand: "SW25.Item.Accessory.Lhand",
  waist: "SW25.Item.Accessory.Waist",
  leg: "SW25.Item.Accessory.Leg",
  other: "SW25.Item.Accessory.Other",
};

SW25.itemTypes = {
  herb: "SW25.Item.Item.Herb",
  potion: "SW25.Item.Item.Potion",
  repair: "SW25.Item.Item.Repair",
};

SW25.resourceTypes = {
  none: "SW25.Item.Resource.Types.None",
  note: "SW25.Item.Resource.Types.Note",
  material: "SW25.Item.Resource.Types.Material",
  lifeline: "SW25.Item.Resource.Types.Lifeline",
  tacspower: "SW25.Item.Resource.Types.Tacspower",
  magitech: "SW25.Item.Resource.Types.Magitech",
  abyssex: "SW25.Item.Resource.Types.AbyssEx",
  otherfeature: "SW25.Item.Resource.Types.Otherfeature",
};


SW25.combatabilityTypes = {
  allways: "SW25.Item.Combatability.Allways",
  declaration: "SW25.Item.Combatability.Declaration",
  mainop: "SW25.Item.Combatability.Mainop",
};

SW25.combatabilityCondTypes = {
  premise: "SW25.Item.Combatability.Premise",
  replace: "SW25.Item.Combatability.Replace",
  learn: "SW25.Item.Combatability.Learn",
};

SW25.magicalsongTypes = {
  song: "SW25.Item.Magicalsong.Song",
  final: "SW25.Item.Magicalsong.Final"
};

SW25.magicalsongResists = {
  "decide": "SW25.Item.Decide",
  "any": "SW25.Item.Any",
  "disappear": "SW25.Item.Disappear",
  "halving": "SW25.Item.Halving"
};

SW25.magicalsongProps = {
  ice: "SW25.Item.Ice",
  wind: "SW25.Item.Wind",
  impact: "SW25.Item.Impact",
  mental: "SW25.Item.Mental",
  mentalw: "SW25.Item.Mentalw",
  curse: "SW25.Item.Curse",
  fandw: "SW25.Item.Fandw",
  iandt: "SW25.Item.Iandt"
};

SW25.phaseareaTypes = {
  ten: "SW25.Item.Phasearea.Ten",
  chi: "SW25.Item.Phasearea.Chi",
  jin: "SW25.Item.Phasearea.Jin"
};

SW25.phaseareaProps = {
  thunder: "SW25.Item.Thunder",
  mentalw: "SW25.Item.Mentalw",
  curse: "SW25.Item.Curse"
};

SW25.tacticsTypes = {
  drum: "SW25.Item.Tactics.Drum",
  camp: "SW25.Item.Tactics.Camp"
};

SW25.tacticsLines = {
  attack: "SW25.Item.Tactics.Attack",
  dodge: "SW25.Item.Tactics.Dodge",
  deffence: "SW25.Item.Tactics.Deffence",
  resist: "SW25.Item.Tactics.Resist",
  inspire: "SW25.Item.Tactics.Inspire"
};

SW25.infusionTypes = {
  common: "SW25.Item.Infusion.Common",
  race: "SW25.Item.Infusion.Race"
};

SW25.checkpackages = {
  fine: "SW25.Item.Check.Packages.Finesse",
  move: "SW25.Item.Check.Packages.Movement",
  obse: "SW25.Item.Check.Packages.Observation",
  know: "SW25.Item.Check.Packages.Knowledge"
};

SW25.fellowTypes = {
  fellow: "SW25.Fellow",
  daemon: "SW25.Daemon"
};

SW25.actorClasses = {
  Barbarous: "SW25.Actor.Class.Barbarous",
  Animal: "SW25.Actor.Class.Animal",
  Plant: "SW25.Actor.Class.Plant",
  Undead: "SW25.Actor.Class.Undead",
  MagicCreature: "SW25.Actor.Class.MagicCreature",
  Machine: "SW25.Actor.Class.Machine",
  Eidolon: "SW25.Actor.Class.Eidolon",
  Fairie: "SW25.Actor.Class.Fairie",
  Daemon: "SW25.Actor.Class.Daemon",
  Human: "SW25.Actor.Class.Human",
  Other: "SW25.Actor.Class.Other",
};

SW25.spellTypes = {
  sorcerer: "SW25.Item.Spell.Sorcerer",
  conjurer: "SW25.Item.Spell.Conjurer",
  wizard: "SW25.Item.Spell.Wizard",
  priest: "SW25.Item.Spell.Priest",
  magitech: "SW25.Item.Spell.Magitech",
  fairy: "SW25.Item.Spell.Fairy",
  druid: "SW25.Item.Spell.Druid",
  daemon: "SW25.Item.Spell.Daemon",
  abyssal: "SW25.Item.Spell.Abyssal"
};

SW25.spellResists = {
  decide: "SW25.Item.Decide",
  any: "SW25.Item.Any",
  none: "SW25.Item.None",
  disappear: "SW25.Item.Disappear",
  halving: "SW25.Item.Halving",
  shortening: "SW25.Item.Shortening"
};

SW25.spellProps = {
  earth: "SW25.Item.Earth",
  ice: "SW25.Item.Ice",
  fire: "SW25.Item.Fire",
  wind: "SW25.Item.Wind",
  thunder: "SW25.Item.Thunder",
  energy: "SW25.Item.Energy",
  cut: "SW25.Item.Cut",
  impact: "SW25.Item.Impact",
  poison: "SW25.Item.Poison",
  disease: "SW25.Item.Disease",
  mental: "SW25.Item.Mental",
  mentalw: "SW25.Item.Mentalw",
  curse: "SW25.Item.Curse",
  curseMental: "SW25.Item.CurseMental",
  mentalPoison: "SW25.Item.MentalPoison",
  other: "SW25.Item.Other"
};

SW25.fairyTypes = {
  basicfairy: "SW25.Item.Spell.Basicfairy",
  propfairy: "SW25.Item.Spell.Propfairy",
  specialfairy: "SW25.Item.Spell.Specialfairy"
};

SW25.fairyProps = {
  fairyearth: "SW25.Item.Spell.Fairyearth",
  fairyice: "SW25.Item.Spell.Fairyice",
  fairyfire: "SW25.Item.Spell.Fairyfire",
  fairywind: "SW25.Item.Spell.Fairywind",
  fairylight: "SW25.Item.Spell.Fairylight",
  fairydark: "SW25.Item.Spell.Fairydark"
};

SW25.noteTypes = {
  up: "SW25.Item.Magicalsong.Up",
  down: "SW25.Item.Magicalsong.Down",
  charm: "SW25.Item.Magicalsong.Charm"
};

SW25.materialTypes = {
  red: "SW25.Item.Alchemytech.Red",
  green: "SW25.Item.Alchemytech.Green",
  black: "SW25.Item.Alchemytech.Black",
  white: "SW25.Item.Alchemytech.White",
  gold: "SW25.Item.Alchemytech.Gold"
};

SW25.materialRanks = {
  b: "SW25.Item.Alchemytech.B",
  a: "SW25.Item.Alchemytech.A",
  s: "SW25.Item.Alchemytech.S",
  ss: "SW25.Item.Alchemytech.SS"
};

SW25.magitechTypes = {
  bullet: "SW25.Item.Resource.Bullet",
  magisphereS: "SW25.Item.Resource.MagisphereS",
  magisphereM: "SW25.Item.Resource.MagisphereM",
  magisphereL: "SW25.Item.Resource.MagisphereL"
};

SW25.abyssexTypes = {
  deamonblood: "SW25.Item.Resource.Daemonblood",
  deamoncrystal: "SW25.Item.Resource.Daemoncrystal",
  deamoncrystalL: "SW25.Item.Resource.ArcDaemoncrystal",
  abyssshard: "SW25.Item.Resource.Abyssshard"
};

SW25.exptables = {
  A: "A",
  B: "B"
};

SW25.skillTypes = {
  fighterskill: "SW25.Item.Skill.Fighterskill",
  magicuserskill: "SW25.Item.Skill.Magicuserskill",
  otherskill: "SW25.Item.Skill.Otherskill",
  commonskill: "SW25.Item.Skill.Commonskill"
};

SW25.deffects = {
  hp: "SW25.Hp",
  mp: "SW25.Mp"
};

SW25.faiths = {
  first: "SW25.Item.Spell.First",
  second: "SW25.Item.Spell.Second"
};

SW25.elementTypes = {
  and: "SW25.And",
  or: "SW25.Or",
};

SW25.elementProps = {
  earth: "SW25.Item.Earth",
  ice: "SW25.Item.Ice",
  fire: "SW25.Item.Fire",
  wind: "SW25.Item.Wind",
  thunder: "SW25.Item.Thunder",
  energy: "SW25.Item.Energy",
  cut: "SW25.Item.Cut",
  impact: "SW25.Item.Impact",
  poison: "SW25.Item.Poison",
  disease: "SW25.Item.Disease",
  mental: "SW25.Item.Mental",
  mentalw: "SW25.Item.Mentalw",
  curse: "SW25.Item.Curse",
  healing: "SW25.Item.Healing",
  blade: "SW25.Item.Weapon.Blade",
  blow: "SW25.Item.Weapon.Blow",
  mithril: "SW25.Item.Weapon.Mithril",
};

SW25.Effect = {
  keyClassifications: {
    battle: "SW25.Effect.Battle",
    check: "SW25.Effect.Check",
    parameter: "SW25.Effect.Parameter",
    magicpower: "SW25.Effect.MagicPower",
    magicckroll: "SW25.Effect.MagicCKRoll",
    magicpwroll: "SW25.Effect.MagicPWRoll",
    mpsave: "SW25.Effect.MPSave",
    feature: "SW25.Features",
    powertable: "SW25.Effect.Powertable",
    classPdamage: "SW25.Effect.ClassPdamage",
    classPdecay: "SW25.Effect.ClassPdecay",
    elementPdamage: "SW25.Effect.ElementPdamage",
    elementPdecay: "SW25.Effect.ElementPdecay",
    classMdamage: "SW25.Effect.ClassMdamage",
    classMdecay: "SW25.Effect.ClassMdecay",
    elementMdamage: "SW25.Effect.ElementMdamage",
    elementMdecay: "SW25.Effect.ElementMdecay",
    checkname: "SW25.Effect.ChecknameInput",
    input: "SW25.Effect.DirectInput"
  },
  battle: {
    "attributes.efhitmod": "SW25.Effect.HitMod",
    "attributes.efdmod": "SW25.Effect.DamageMod",
    "effect.efcvalue": "SW25.Effect.CMod",
    "effect.efspellcvalue": "SW25.Effect.SpCMod",
    "lt": "SW25.Effect.LethalTech",
    "cr": "SW25.Effect.CriticalRay",
    "attributes.efwphalfmod": "SW25.Effect.WeaponHalfMod",
    "attributes.efsphalfmod": "SW25.Effect.SpellHalfMod",
    "attributes.efdodgemod": "SW25.Effect.DodgeMod",
    "attributes.efppmod": "SW25.Effect.PpMod",
    "attributes.efmppmod": "SW25.Effect.MppMod",
    "attributes.efdreduce": "SW25.Effect.Dreduce",
    "attributes.move.efmovemod": "SW25.Effect.MoveMod",
    "attributes.turnend.hpregenmod": "SW25.Effect.HpregenMod",
    "attributes.turnend.mpregenmod": "SW25.Effect.MpregenMod"
  },
  check: {
    "effect.vitres": "SW25.Config.ResVit",
    "effect.mndres": "SW25.Config.ResMnd",
    "effect.init": "SW25.Config.Init",
    "effect.mknow": "SW25.Config.MKnow",
    "effect.allck": "SW25.Config.AllCk",
    "effect.allsk": "SW25.Config.AllSk",
    "effect.allsc": "SW25.Config.AllSc",
    "effect.allac": "SW25.Config.AllAc",
    "eflootmod": "SW25.Monster.Loot",
    "effect.package.fine": "SW25.Item.Check.Packages.Finesse",
    "effect.package.move": "SW25.Item.Check.Packages.Movement",
    "effect.package.obse": "SW25.Item.Check.Packages.Observation",
    "effect.package.know": "SW25.Item.Check.Packages.Knowledge"
  },
  parameter: {
    "hp.efhpmod": "SW25.Effect.HpMod",
    "mp.efmpmod": "SW25.Effect.MpMod",
    "abilities.dex.efvaluemodify": "SW25.Effect.DexValueModify",
    "abilities.agi.efvaluemodify": "SW25.Effect.AgiValueModify",
    "abilities.str.efvaluemodify": "SW25.Effect.StrValueModify",
    "abilities.vit.efvaluemodify": "SW25.Effect.VitValueModify",
    "abilities.int.efvaluemodify": "SW25.Effect.IntValueModify",
    "abilities.mnd.efvaluemodify": "SW25.Effect.MndValueModify",
    "abilities.dex.efmodify": "SW25.Effect.DexModModify",
    "abilities.agi.efmodify": "SW25.Effect.AgiModModify",
    "abilities.str.efmodify": "SW25.Effect.StrModModify",
    "abilities.vit.efmodify": "SW25.Effect.VitModModify",
    "abilities.int.efmodify": "SW25.Effect.IntModModify",
    "abilities.mnd.efmodify": "SW25.Effect.MndModModify"
  },
  magicpower: {
    "attributes.efscmod": "SW25.Effect.ScMod",
    "attributes.efcnmod": "SW25.Effect.CnMod",
    "attributes.efwzmod": "SW25.Effect.WzMod",
    "attributes.efprmod": "SW25.Effect.PrMod",
    "attributes.efmtmod": "SW25.Effect.MtMod",
    "attributes.effrmod": "SW25.Effect.FrMod",
    "attributes.efdrmod": "SW25.Effect.DrMod",
    "attributes.efdmmod": "SW25.Effect.DmMod",
    "attributes.efabmod": "SW25.Effect.AbMod",
    "effect.allmgp": "SW25.Config.AllMgp"
  },
  magicckroll: {
    "attributes.efscckmod": "SW25.Effect.ScMod",
    "attributes.efcnckmod": "SW25.Effect.CnMod",
    "attributes.efwzckmod": "SW25.Effect.WzMod",
    "attributes.efprckmod": "SW25.Effect.PrMod",
    "attributes.efmtckmod": "SW25.Effect.MtMod",
    "attributes.effrckmod": "SW25.Effect.FrMod",
    "attributes.efdrckmod": "SW25.Effect.DrMod",
    "attributes.efdmckmod": "SW25.Effect.DmMod",
    "attributes.efabckmod": "SW25.Effect.AbMod",
    "attributes.efmckall": "SW25.Item.All"
  },
  magicpwroll: {
    "attributes.efscpwmod": "SW25.Effect.ScMod",
    "attributes.efcnpwmod": "SW25.Effect.CnMod",
    "attributes.efwzpwmod": "SW25.Effect.WzMod",
    "attributes.efprpwmod": "SW25.Effect.PrMod",
    "attributes.efmtpwmod": "SW25.Effect.MtMod",
    "attributes.effrpwmod": "SW25.Effect.FrMod",
    "attributes.efdrpwmod": "SW25.Effect.DrMod",
    "attributes.efdmpwmod": "SW25.Effect.DmMod",
    "attributes.efabpwmod": "SW25.Effect.AbMod",
    "attributes.efmpwall": "SW25.Item.All"
  },
  mpsave: {
    "attributes.efmpsc": "SW25.Effect.ScMod",
    "attributes.efmpcn": "SW25.Effect.CnMod",
    "attributes.efmpwz": "SW25.Effect.WzMod",
    "attributes.efmppr": "SW25.Effect.PrMod",
    "attributes.efmpmt": "SW25.Effect.MtMod",
    "attributes.efmpfr": "SW25.Effect.FrMod",
    "attributes.efmpdr": "SW25.Effect.DrMod",
    "attributes.efmpdm": "SW25.Effect.DmMod",
    "attributes.efmpab": "SW25.Effect.AbMod",
    "attributes.efmpall": "SW25.Item.All"
  },
  feature: {
    "attributes.efmsckmod": "SW25.Effect.MagicalsongPeform",
    "attributes.efmspwmod": "SW25.Effect.MagicalsongPower",
    "attributes.efatckmod": "TYPES.Item.alchemytech",
    "attributes.efewckmod": "SW25.Effect.EssenceweaveForce",
    "attributes.efewpwmod": "SW25.Effect.EssenceweavePower"
  },
  powertable: {
    "attributes.powertablemod.weapon": "TYPES.Item.weapon",
    "attributes.powertablemod.armor": "TYPES.Item.armor",
    "attributes.powertablemod.accessory": "TYPES.Item.accessory",
    "attributes.powertablemod.item": "TYPES.Item.item",
    "attributes.powertablemod.spell": "TYPES.Item.spell",
    "attributes.powertablemod.enhancearts": "TYPES.Item.enhancearts",
    "attributes.powertablemod.magicalsong": "TYPES.Item.magicalsong",
    "attributes.powertablemod.ridingtrick": "TYPES.Item.ridingtrick",
    "attributes.powertablemod.alchemytech": "TYPES.Item.alchemytech",
    "attributes.powertablemod.phasearea": "TYPES.Item.phasearea",
    "attributes.powertablemod.tactics": "TYPES.Item.tactics",
    "attributes.powertablemod.infusion": "TYPES.Item.infusion",
    "attributes.powertablemod.barbarousskill": "TYPES.Item.barbarousskill",
    "attributes.powertablemod.essenceweave": "TYPES.Item.essenceweave",
    //"attributes.powertablemod.check": "TYPES.Item.check",
    //"attributes.powertablemod.resource": "TYPES.Item.resource",
    //"attributes.powertablemod.combatability": "TYPES.Item.combatability",
    "attributes.powertablemod.skill": "TYPES.Item.skill",
    "attributes.powertablemod.raceability": "TYPES.Item.raceability",
    //"attributes.powertablemod.language": "TYPES.Item.language",
    "attributes.powertablemod.otherfeature": "TYPES.Item.otherfeature",
    "attributes.powertablemod.monsterability": "TYPES.Item.monsterability",
    "attributes.powertablemod.action": "TYPES.Item.action",
    //"attributes.powertablemod.session": "TYPES.Item.session",
    "attributes.powertablemod.all": "SW25.Item.All",
  },
  classPdamage: {
    "attributes.damage.physical.classType.Barbarous": "SW25.Actor.Class.Barbarous",
    "attributes.damage.physical.classType.Animal": "SW25.Actor.Class.Animal",
    "attributes.damage.physical.classType.Plant": "SW25.Actor.Class.Plant",
    "attributes.damage.physical.classType.Undead": "SW25.Actor.Class.Undead",
    "attributes.damage.physical.classType.MagicCreature": "SW25.Actor.Class.MagicCreature",
    "attributes.damage.physical.classType.Machine": "SW25.Actor.Class.Machine",
    "attributes.damage.physical.classType.Eidolon": "SW25.Actor.Class.Eidolon",
    "attributes.damage.physical.classType.Fairie": "SW25.Actor.Class.Fairie",
    "attributes.damage.physical.classType.Daemon": "SW25.Actor.Class.Daemon",
    "attributes.damage.physical.classType.Human": "SW25.Actor.Class.Human",
    "attributes.damage.physical.classType.Other": "SW25.Actor.Class.Other",
  },
  classPdecay: {
    "attributes.decay.physical.classType.Barbarous": "SW25.Actor.Class.Barbarous",
    "attributes.decay.physical.classType.Animal": "SW25.Actor.Class.Animal",
    "attributes.decay.physical.classType.Plant": "SW25.Actor.Class.Plant",
    "attributes.decay.physical.classType.Undead": "SW25.Actor.Class.Undead",
    "attributes.decay.physical.classType.MagicCreature": "SW25.Actor.Class.MagicCreature",
    "attributes.decay.physical.classType.Machine": "SW25.Actor.Class.Machine",
    "attributes.decay.physical.classType.Eidolon": "SW25.Actor.Class.Eidolon",
    "attributes.decay.physical.classType.Fairie": "SW25.Actor.Class.Fairie",
    "attributes.decay.physical.classType.Daemon": "SW25.Actor.Class.Daemon",
    "attributes.decay.physical.classType.Human": "SW25.Actor.Class.Human",
    "attributes.decay.physical.classType.Other": "SW25.Actor.Class.Other"
  },
  elementPdamage: {
    "attributes.damage.physical.element.magic.earth": "SW25.Item.Earth",
    "attributes.damage.physical.element.magic.ice": "SW25.Item.Ice",
    "attributes.damage.physical.element.magic.fire": "SW25.Item.Fire",
    "attributes.damage.physical.element.magic.wind": "SW25.Item.Wind",
    "attributes.damage.physical.element.magic.thunder": "SW25.Item.Thunder",
    "attributes.damage.physical.element.magic.energy": "SW25.Item.Energy",
    "attributes.damage.physical.element.magic.cut": "SW25.Item.Cut",
    "attributes.damage.physical.element.magic.impact": "SW25.Item.Impact",
    "attributes.damage.physical.element.magic.poison": "SW25.Item.Poison",
    "attributes.damage.physical.element.magic.disease": "SW25.Item.Disease",
    "attributes.damage.physical.element.magic.curse": "SW25.Item.Curse",
    "attributes.damage.physical.element.magic.mental": "SW25.Item.Mental",
    "attributes.damage.physical.element.magic.mentalw": "SW25.Item.Mentalw",
    "attributes.damage.physical.element.magic.healing": "SW25.Item.Healing",
    "attributes.damage.physical.element.physical.blade": "SW25.Item.Weapon.Blade",
    "attributes.damage.physical.element.physical.blow": "SW25.Item.Weapon.Blow",
    "attributes.damage.physical.element.physical.gun": "SW25.Item.Weapon.Bullet",
    "attributes.damage.physical.element.physical.mithril": "SW25.Item.Weapon.Mithril",
  },
  elementPdecay: {
    "attributes.decay.physical.element.magic.earth": "SW25.Item.Earth",
    "attributes.decay.physical.element.magic.ice": "SW25.Item.Ice",
    "attributes.decay.physical.element.magic.fire": "SW25.Item.Fire",
    "attributes.decay.physical.element.magic.wind": "SW25.Item.Wind",
    "attributes.decay.physical.element.magic.thunder": "SW25.Item.Thunder",
    "attributes.decay.physical.element.magic.energy": "SW25.Item.Energy",
    "attributes.decay.physical.element.magic.cut": "SW25.Item.Cut",
    "attributes.decay.physical.element.magic.impact": "SW25.Item.Impact",
    "attributes.decay.physical.element.magic.poison": "SW25.Item.Poison",
    "attributes.decay.physical.element.magic.disease": "SW25.Item.Disease",
    "attributes.decay.physical.element.magic.curse": "SW25.Item.Curse",
    "attributes.decay.physical.element.magic.mental": "SW25.Item.Mental",
    "attributes.decay.physical.element.magic.mentalw": "SW25.Item.Mentalw",
    "attributes.decay.physical.element.magic.healing": "SW25.Item.Healing",
    "attributes.decay.physical.element.physical.blade": "SW25.Item.Weapon.Blade",
    "attributes.decay.physical.element.physical.blow": "SW25.Item.Weapon.Blow",
    "attributes.decay.physical.element.physical.gun": "SW25.Item.Weapon.Bullet",
    "attributes.decay.physical.element.physical.mithril": "SW25.Item.Weapon.Mithril",
  },
  classMdamage: {
    "attributes.damage.magic.classType.Barbarous": "SW25.Actor.Class.Barbarous",
    "attributes.damage.magic.classType.Animal": "SW25.Actor.Class.Animal",
    "attributes.damage.magic.classType.Plant": "SW25.Actor.Class.Plant",
    "attributes.damage.magic.classType.Undead": "SW25.Actor.Class.Undead",
    "attributes.damage.magic.classType.MagicCreature": "SW25.Actor.Class.MagicCreature",
    "attributes.damage.magic.classType.Machine": "SW25.Actor.Class.Machine",
    "attributes.damage.magic.classType.Eidolon": "SW25.Actor.Class.Eidolon",
    "attributes.damage.magic.classType.Fairie": "SW25.Actor.Class.Fairie",
    "attributes.damage.magic.classType.Daemon": "SW25.Actor.Class.Daemon",
    "attributes.damage.magic.classType.Human": "SW25.Actor.Class.Human",
    "attributes.damage.magic.classType.Other": "SW25.Actor.Class.Other",
  },
  classMdecay: {
    "attributes.decay.magic.classType.Barbarous": "SW25.Actor.Class.Barbarous",
    "attributes.decay.magic.classType.Animal": "SW25.Actor.Class.Animal",
    "attributes.decay.magic.classType.Plant": "SW25.Actor.Class.Plant",
    "attributes.decay.magic.classType.Undead": "SW25.Actor.Class.Undead",
    "attributes.decay.magic.classType.MagicCreature": "SW25.Actor.Class.MagicCreature",
    "attributes.decay.magic.classType.Machine": "SW25.Actor.Class.Machine",
    "attributes.decay.magic.classType.Eidolon": "SW25.Actor.Class.Eidolon",
    "attributes.decay.magic.classType.Fairie": "SW25.Actor.Class.Fairie",
    "attributes.decay.magic.classType.Daemon": "SW25.Actor.Class.Daemon",
    "attributes.decay.magic.classType.Human": "SW25.Actor.Class.Human",
    "attributes.decay.magic.classType.Other": "SW25.Actor.Class.Other"
  },
  elementMdamage: {
    "attributes.damage.magic.element.magic.earth": "SW25.Item.Earth",
    "attributes.damage.magic.element.magic.ice": "SW25.Item.Ice",
    "attributes.damage.magic.element.magic.fire": "SW25.Item.Fire",
    "attributes.damage.magic.element.magic.wind": "SW25.Item.Wind",
    "attributes.damage.magic.element.magic.thunder": "SW25.Item.Thunder",
    "attributes.damage.magic.element.magic.energy": "SW25.Item.Energy",
    "attributes.damage.magic.element.magic.cut": "SW25.Item.Cut",
    "attributes.damage.magic.element.magic.impact": "SW25.Item.Impact",
    "attributes.damage.magic.element.magic.poison": "SW25.Item.Poison",
    "attributes.damage.magic.element.magic.disease": "SW25.Item.Disease",
    "attributes.damage.magic.element.magic.curse": "SW25.Item.Curse",
    "attributes.damage.magic.element.magic.mental": "SW25.Item.Mental",
    "attributes.damage.magic.element.magic.mentalw": "SW25.Item.Mentalw",
    "attributes.damage.magic.element.magic.healing": "SW25.Item.Healing",
    "attributes.damage.magic.element.physical.blade": "SW25.Item.Weapon.Blade",
    "attributes.damage.magic.element.physical.blow": "SW25.Item.Weapon.Blow",
    "attributes.damage.magic.element.physical.gun": "SW25.Item.Weapon.Bullet",
    "attributes.damage.magic.element.physical.mithril": "SW25.Item.Weapon.Mithril",
  },
  elementMdecay: {
    "attributes.decay.magic.element.magic.earth": "SW25.Item.Earth",
    "attributes.decay.magic.element.magic.ice": "SW25.Item.Ice",
    "attributes.decay.magic.element.magic.fire": "SW25.Item.Fire",
    "attributes.decay.magic.element.magic.wind": "SW25.Item.Wind",
    "attributes.decay.magic.element.magic.thunder": "SW25.Item.Thunder",
    "attributes.decay.magic.element.magic.energy": "SW25.Item.Energy",
    "attributes.decay.magic.element.magic.cut": "SW25.Item.Cut",
    "attributes.decay.magic.element.magic.impact": "SW25.Item.Impact",
    "attributes.decay.magic.element.magic.poison": "SW25.Item.Poison",
    "attributes.decay.magic.element.magic.disease": "SW25.Item.Disease",
    "attributes.decay.magic.element.magic.curse": "SW25.Item.Curse",
    "attributes.decay.magic.element.magic.mental": "SW25.Item.Mental",
    "attributes.decay.magic.element.magic.mentalw": "SW25.Item.Mentalw",
    "attributes.decay.magic.element.magic.healing": "SW25.Item.Healing",
    "attributes.decay.magic.element.physical.blade": "SW25.Item.Weapon.Blade",
    "attributes.decay.magic.element.physical.blow": "SW25.Item.Weapon.Blow",
    "attributes.decay.magic.element.physical.gun": "SW25.Item.Weapon.Bullet",
    "attributes.decay.magic.element.physical.mithril": "SW25.Item.Weapon.Mithril",
  },
};

SW25.alchemyEffecive = {
  value: "SW25.Item.Alchemytech.Value",
  time: "SW25.Item.Alchemytech.Time",
  diceformula: "SW25.Item.Alchemytech.DiceFormula",
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

SW25.itemTypeList = [
  { type: "weapon", label: "SW25.TYPES.Item.weapon" },
  { type: "armor", label: "SW25.TYPES.Item.armor" },
  { type: "accessory", label: "SW25.TYPES.Item.accessory" },
  { type: "item", label: "SW25.TYPES.Item.item" },
  { type: "spell", label: "SW25.TYPES.Item.spell" },
  { type: "enhancearts", label: "SW25.TYPES.Item.enhancearts" },
  { type: "magicalsong", label: "SW25.TYPES.Item.magicalsong" },
  { type: "ridingtrick", label: "SW25.TYPES.Item.ridingtrick" },
  { type: "alchemytech", label: "SW25.TYPES.Item.alchemytech" },
  { type: "phasearea", label: "SW25.TYPES.Item.phasearea" },
  { type: "tactics", label: "SW25.TYPES.Item.tactics" },
  { type: "infusion", label: "SW25.TYPES.Item.infusion" },
  { type: "barbarousskill", label: "SW25.TYPES.Item.barbarousskill" },
  { type: "essenceweave", label: "SW25.TYPES.Item.essenceweave" },
  { type: "otherfeature", label: "SW25.TYPES.Item.otherfeature" },
  { type: "check", label: "SW25.TYPES.Item.check" },
  { type: "resource", label: "SW25.TYPES.Item.resource" },
  { type: "combatability", label: "SW25.TYPES.Item.combatability" },
  { type: "skill", label: "SW25.TYPES.Item.skill" },
  { type: "raceability", label: "SW25.TYPES.Item.raceability" },
  { type: "language", label: "SW25.TYPES.Item.language" },
  { type: "monsterability", label: "SW25.TYPES.Item.monsterability" },
  { type: "action", label: "SW25.TYPES.Item.action" },
  { type: "session", label: "SW25.TYPES.Item.session" }
];
