# Manual for Sword World 2.5
v0.10.2

## PC

### Header Section
This is the area where the character summary is displayed.
- Name, character image, current HP, current MP, Fumbles, and Grace or no Grace can be adjusted.
- The rest of the fields are automatically reflected from other input fields.

### Tabs
- In each item list, click on the name of any item (except skills, dice rolls, resources, and languages) to expand its description.
- For listings that do not have a New, Edit, or Delete button in the item list, the Edit and Delete buttons will appear when the description is expanded.

#### Ability & Class Tab
These tabs are mainly used during creation and growth.
- Ability Value column (left)
  - Ability values and bonuses are automatically calculated by entering Mind, Skill, Body, A-F, Growth, and Modifications.
  - Click on "Growth" to make a Growth Roll, and select the result in the chat message to directly increase the ability score value.
- Maximum HP and MP modifiers (upper right)
  - Enter when making modifications to the automatically calculated values. This is intended for cases where the value has been changed by special skills, items, magic, etc. (I would like to implement automatic calculation)
- Class column (lower right)
  - Class are listed. Clicking on the icon will display the description in chat.
  - You can increase, decrease, edit, delete, or create new levels from the list.
  - You can also add classes by dragging them from an item.
  - Experience used is automatically calculated.
  - Please check the item description below for details.

#### Check Tab
These are tabs that would be used mainly during the normal (non-combat) part of the session.
- Check column (left)
  - Various checks can be registered. You can make an action check and a power roll.
  - You can enter, edit, delete, and create new values from the list.
  - The base value displayed is the value added to 2d6 in the case of judgments, and the value added after the roll in the case of power rolls. The entries in the modification column will be reflected in this value.
  - Click on the item name and base value to make the corresponding roll.
  - This list is intended to increase convenience by registering basic checks such as Fortitude and Willpower, as well as frequently used checks related to skills such as Initiative, Monster Knowledge, Check Package, and Spellcasting.
  - Fortitude, Willpower, Initiative, and Monster Knowledge are created during character creation.
  - Initiative and Monster Knowledge must be set to the Class used and ability value.
  - The item names determines the applicability of Active Effects.
  - Since you can create these items freely, please be flexible in using them, for example, prepare both Scout's and Tactician's Initiative.
  - Check the item descriptions below for more details.    
- General-purpose class check column (right)
  - This column is used to easily perform a "XX class level + XX bonus" check that combines the classes owned with each ability value bonus.
  - The automatically calculated base value is displayed. Click on the number to make the appropriate roll.
  - You can specify a modified value for each skill unit.

#### Battle Tab
This tab is primarily intended to be used during combat.
- Check column (upper left)
  - Of the check items registered in the Check tab, only those items with "Combat" checked in the item details are displayed.
  - It is convenient to register roles that are frequently used in combat.
  - New creation, editing, and deletion cannot be performed from this column. Please do so from the list on the Check tab.
- Combat-related information column (upper right)
  - Movement power is displayed. It can be modified. The modification is to the normal movement.
  - Hit and power will reflect the values of the weapon selected in the middle column for various modifiers. The various modifier columns will be reflected.
  - Evasion is the value of evasion by the skill selected in the modifiers column. The modifiers are reflected.
  - Click to roll for hit, power, and evasion.
  - The values of defense (PP) and magic defense (MPP) are displayed. The values of the various modifier columns will be reflected. The modified value of damage reduction (D reduction) is also reflected; if D reduction is entered, it will be displayed as "Total value (original value + D reduction value)".
- Correction column (middle)
  - Allows entry of various modifications. The modifications will be reflected in the "Combat Related Information" column.
  - The weapon to be used for accuracy and power can be selected in the Combat Information column.
  - Select the initial value to be used for weapon accuracy and damage in the default class set for the weapon.
  - Select the class to be used for evasion in the Combat Information column.
- Equipment column
  - Weapons, armor, and ornaments with the "Equipped" checkbox in the item details will be displayed.
  - You cannot create, edit, or delete items from this column. Please do so from the list in the "Equipment" tab.
  - The behavior when clicking on the icon can be set in the details. The default selection is "All", which displays the description, "Check", "Power", and "Effects" (if applicable) button in chat.
  - Click to roll the accuracy and power sections of the weapon list. The values in the various modifier fields are reflected.
  - When using a sub-weapon or using a weapon in a different way (e.g. 2H with an ambidextrous weapon), this direct click may be more convenient than changing the weapon of choice.

#### Features Tab
This tab displays race characteristics and combat skills, as well as Techniques, Spellsongs and Finales, Stunts, Evocations, Aspects, Strategems and Maneuvers, etc.
- New, edit, and delete can be performed.
- If you don't have any of the Classes listed, they will not be displayed, except for the race and combat skills. If you check the "Show Blank Groups" checkbox, a list of items that you do not possess will also be displayed. If you want to create a new item, please use this option.
- The behavior when clicking on icons can be configured from Details. The default selection is "All", which displays the description, "Check", "Power", and "Effects" (if applicable) button in chat. (Techniques have the additional field of MP Cost)
- Some items can be checked in "Use Dice Roll" and "Use Power Table" in the details. When checked, "Dice Roll" and "Power" are displayed in the list, and the corresponding roll can be performed by clicking on the checkbox. Please use this function when necessary, for example, for checks on the usage of spellsongs, etc., or for power rolls.
- If you have set up "Effects" in the item's details, "Effects" will appear beside the item in your character sheet.
- Action types are automatically displayed in front of the name. The following types are displayed: Always (○), Major (▶), Minor (≫), Combat Preparation (△), and Declaration (□).
- In the Techniques list, MP Cost can be performed by selecting the character and clicking on "MP Cost" in the character sheet.

#### Spells Tab
This tab displays information about magic.
- The list is divided for each magic system. Selecting a magic system in the item details will be reflected in the list.
- The magic system and magic power are displayed at the top of the list. By clicking on the item, you can determine whether or not to use it. To make the dice roll in chat, you need to select the Class to be used. There is also an input box for modifications.
- To edit or delete spells items, you must expand the description or go to the "Show All Spell" list.
- To create a new spell item, use the main menu to create a new spell item or go to the "Show All Spell" list and click the New button.
- The behavior when clicking on icons can be configured in the details. The default selection is "All", which displays the description, enables roll buttons, applies Active Effects, and displays MP Cost button in chat.
- Some items can be checked in "Use Dice" and "Use Power List" in the details. When checked, "Dice Check" and "Power" are displayed in the list, and the corresponding roll can be performed by clicking on it. Since the rolls can be exercised from the top of the list, please use mainly the power rolls as necessary.
  - Some spells with special damage value calculations may be handled by editing the numbers in the power table. In such cases, please manually adjust as double 1s will result in a 0.
- If effects are set in the Details, it will appear in the list and the effects can be applied to the character.
- If a character is selected, MP Cost can be performed by clicking on the "MP Cost" button
- If you check the "Show All Spell" checkbox, a list of all the magic items in your possession will be displayed, regardless of the system. You can also click on icons and roll from "Spellcasting" and "Power".
- New creation, editing, and deletion can only be done from the "Show All Spell" list.
- The magic operation type is automatically displayed before the name. The following types of magic are displayed: Always (○), Major (▶), Minor (≫), Combat Ready (△), and Declared (□).

#### Effects Tab
This tab displays information about effects on the character, such as buffs and debuffs.
- Effects Summary (top)
  - Displays the total modified value of effects currently applied.
  - Effects are automatically applied to rolls and other actions.
  - The total is automatically calculated each time you toggle the enable/disable status.
- List of effects (below)
  - Lists temporary, permanent, disabled effects.
  - You can create, edit, and delete the effects, as well as toggle their activation and deactivation.
  - The reference source is displayed as the item name for item-derived buffs, and the character name for buffs created on the character sheet.
  - If a temporary effect has a duration set, the time will only be displayed during combat.
- ** Attention! ** The effects of Special Attacks and Critical Ray only apply to the selected weapon.
- ** Attention! ** Some attribute keys for Active Effects will not be updated after loading the game World, but they will update themselves after you make any adjustments on the Character Sheet.
  - Examples of adjustments: Turning on/off Grace, entering various modifiers, updating current HP values, turning Active Effects on/off, etc.

#### Items Tab
This tab displays items in your possession, including equipment.
- There is a field for entering the amount of money you have. There is no automatic calculation function. (To be implemented)
- New creation, editing, and deletion of each item can be performed. Weapons, armor, and ornaments can be created here. You cannot do this from the combat tab.
- Item List
  - By checking the "Use Dice Roll" and "Use Power Table" checkboxes in the details, "Dice Check" and "Power" will appear in the list, and you can perform the corresponding roll by clicking on them. Use this function for medicinal herbs and the like.
  - If you have set up “Effects” in the item's Details, “Effects” will appear in the list next to the item and you can apply those effects to your character.
  - The behavior when clicking on the icon can be set in the "Details" menu. The default selection is "All", which displays the description, "Check", "Power", and "Effects" (if applicable) button in chat.
- Weapons, Armor, and Decorations
  - There is an "Equip" checkbox in the list. Checked items are displayed in the combat tab.
  - (Weapons, armor, and ornaments do not display "Dice Check" and "Power" even if "Use Dice Roll" and "Use Power Table" are checked in the details.
  - If you have set up “Effects” in the equipment's Details, “Effects” will appear in the list next to the equipment and you can apply those effects to your character.
  - The behavior when clicking on icons can be set in the details. The default selection is "All", which displays the description, "Check", "Power", and "Effects" (if applicable) button in chat.

#### Description Tab
This tab displays language, other settings, notes, etc.
- Language column (upper left)
  - Languages can be created, edited, and deleted.
  - You can check the "Conversation "Reading" checkbox.
- Settings (upper right)
  - This is where you can enter data.
  - You can set the initial Class values for certain items.
- Appearance, career, and other notes column (bottom)
  - This is a field for free description.

## NPC
- HP, MP, summary, description, and notes for GM can be listed.
- Only the summary is displayed with limited privileges.
- You can set the display name for limited privileges.
- Notes for GM will be displayed only for GM.

## Monster
Monster data can be entered.

### Header Section
This is the area where the monster summary is displayed.
- Name, monster image, current HP, and current MP can be entered.
- The rest of the information is automatically reflected from the input fields in the other tabs.
- Clicking on "Loot" will output a chat message for the loot roll.
- With limited privileges, only the summary is displayed.
- About Monster Knowledge Check
  - Only a summary is displayed with limited privileges.
  - If you have limited privileges before or after a successful Monster Knowledge Check, the data will be kept secret.
  - If the player is granted "Viewer" privileges after a successful Monster Knowledge Check, the data will be visible to the player.
  - The image will be displayed as it is to the player with limited privileges.

#### Monster Ability Tab
This tab displays the various abilities of monsters.
- Use this item for Fortitude and Willpower. It is automatically added when the monster is created, but must still be manually set.
- The behavior when clicking on the icon can be set from Details. The default selection is "All", which displays the description, "Check", "Power", and "Effects" (if applicable) button in chat.
- The ability's behavior type is automatically displayed before its name. The following types are available: Always "○", Major Action "▶", Minor Action "≫", Combat Preparation "△", and Declaration "□".
- By checking the "Check 1-3" and "Power Table" checkboxes in the details, the respective label names are displayed, and the corresponding roll can be performed by clicking on them. Use as necessary.
- If you have set up “Effects” in the ability's Details, “Effects” will appear in the list next to the ability and you can apply those effects to the monster.
- By checking the "Fixed Value" checkbox under Details for each check, the dice result is automatically fixed at "7" and the roll result is displayed as a fixed value.
- If you have enabled Check and Power Roll, the modified value input box will also be displayed.
- Use this item for basic abilities (e.g., normal attacks) as well. It is automatically added when the monster is created, but must still be manually set.
  - Three checks will be used: Accuracy, Damage, and Evasion. Manual input is required.
  - HP, MP, defense (protective points), and magic defense are entered separately.
- Resistable abilities should also use this item.
  - Using Dice Rolls can be made by checking one of the Checks. Use a label with "Spellcasting" or something similar. Fixed values can also be used.
  - Resistance and resistance results can be entered in the remarks field as "evade/neg" to increase readability.
- Multi-part monsters cannot be represented by a single token. (To be implemented)
  - Please prepare separate tokens for the main token and other parts of the body, and operate with multiple tokens.
  - For abilities that affect the whole body, etc., please use the description in the remarks column.
- **About Magic**
  - Magic is intended to be registered as a magical ability.
  - Individual magic can use the same items as PCs. It can also be expressed as a magical ability.
  - If you want to use the same items as the PCs, check the "Use Magic" checkbox to display the list of magic and use it.
  - Enter the magic power of the monster in the check modifier and use it.
  - Please note that skills and ability values cannot be diced unless "-" is selected.

#### Effects Tab
Effects will be listed similar to the PC sheet, but only those that are valid will be shown, such as with Effects Summary totals.
- Only Active Effects for monsters that show a total will have the change applied. Attribute key numbers that do not display totals will be ignored.
- This can be used to manage elapsed time.
- ** Attention! ** Some attribute keys for Active Effects will not be updated after loading the game World, but they will update themselves after you make any adjustments on the Character Sheet.
  - Examples of adjustments: Turning on/off Grace, entering various modifiers, updating current HP values, turning Active Effects on/off, etc.

#### Description Tab
- This is a free description field. This is intended for general descriptions of the monster.
- The loot list described in the Details Tab will also be displayed.

#### Details Tab
Tab for entering various data.
- Notes for GM will be displayed only to the GM.
- You can set the display name for limited privileges.

## Various Items
Each item can be configured in detail. This is done mainly from the Details tab. With a few exceptions, some items are common.

- Description tab
  - Description field for the item. Free description field. Depending on the settings, this field will be displayed in the chat when the icon is clicked.
- When icon is clicked
  - You can select the behavior when the icon is clicked in the list. You can choose to display the description, dice rolls, and/or MP Cost in chat.
  - When “All” is selected, a description, roll button, apply effects, and for some items, MP Cost button will be displayed.
- Use Dice Roll, Use Power Table
  - Checking the checkbox enables the roll from the list. Also, by checking the checkbox, the setting items will be displayed.
- Use Dice Settings
  - You can specify the class, ability value bonuses, and modifiers to be used for the dice roll. Also, check the "Custom Dice" checkbox to use dice other than 2d6. Fixed values can also be specified.
- Power Table Settings
  - Set the class, ability value bonus, modifier, power, critical value (C value), and power table content to be used for the dice roll.
  - Check "Halve" to halve the result.
  - The "Special Treatment (Particular)" checkbox allows you to set the modified value after halving, the increased value of Lethal Strike (usually 1), the increased value of Critical Ray, and the roll of the Apothecary's Tool (usually 4).
  - Critical Ray "f<x>" (replace X with any number) This will make the first roll a fixed number equal to <x>. This function can also be used for the Human's "Change Fate" 
  - The calculation of Executioner's Blade cannot currently be handled. Please refer to the stakes and modify the values manually.
  - If the power table is blank, it should refer to the generic power table to get the value. (Not implemented yet, after implementation, Executioner's Blade can be handled)
- Effects Tab
  - Effects can be applied to items.
  - Effects on items are automatically applied to the PC that possesses the item.

### Weapons
- Equipment checks, categories, ranks, types, usages, specializations, minimum Strength, hit modifiers, additional damage, and ranges can be set.
- These are items that will be used with both the check and power tables.
- If you have selected an attack class in the character's Combat tab, the selected class and default ability will automatically be chosen when classes and abilities for check and power are unselected. Note that they are not linked.- 
- Bonuses due to specialization is automatically updated once the active effects are set. The check only changes the list display.
- For weapons with multiple usages, it would be useful to create a separate item for each usage.
- Equipment checkboxes and Active Effect enable/disable are linked, but can also be toggled manually.

### Armor and Shields
- Armor and shields are items in the same category.
- Equipment checks, categories, ranks, specializations, minimum strength, evasion modifiers, protection points (defense), and magic protection can be set.
- Both dice roll and power are basically not used for these items.
- The bonus from Personal Items are automatically reflected if an Effect is set. The checkbox to Personal Items only changes the list display.
- Equipment checkboxes and Active Effect enable/disable are linked, but can also be toggled manually.

### Accessories
- Equipment checks, part to be equipped on, and specializations can be set up.
- Both the check and the power of the item are basically not used.
- Please manage manually as we have not implemented any restrictions on equipping the same part of the body.
- The bonus from Personal Items are automatically reflected if an Effect is set. The check to Personal Items only changes the list display.
- Equipment checkboxes and Active Effect enable/disable are linked, but can also be toggled manually.

### Item
- Quantity and price can be entered.
- By selecting a Type, the class and ability values of that class will be applied when used.
- Please use flexibly by combining dice roll and power to suit each item.

### Spells
- Magic system, level, action type, MP consumption, target, range/shape, duration, resistance, type, and summary can be set.
- Please use flexibly by combining dice roll and power.
- If you have selected an spell class in the character's Spell tab, the selected class and default ability will automatically be chosen when classes and abilities for check and power are unselected. Note that they are not linked.
- If you do not select a magic system, it will not appear correctly in the list on the character sheet.
- In Divine Magic, selection of Sacred and Vice systems, and input fields for special divine magic will be added.
- In Magitech, an entry field for Magisphere will be added.
- In Fairy Magic, an input field for type and (when necessary) attribute will be added.
- In Nature Magic, a checkbox for countering with Fortitude will be added.
- Some spells are easier to manage if an Effect is prepared to apply a buff or debuff.
- In the chat displayed "MP Cost" button, the cost can be multiplied by utilizing the "Metamagic" button.

### Technique
- Action type, level, MP consumption, duration, and summary can be set.
- Automatic application of effects can be applied by using the Effects in the Details section.

### Spellsongs・Finale
- The following items can be set: spellsong and finale selection, level, resistance, type, singing, pets, Rhythm Conditions, Base Rhythm, Extra Rhythm, Flourish Value, Extra Rhythm, Consumed Rhythm, and summary.
- The setting items change depending on the type of spellsong and finale.
- Some songs are easier to manage if an Effect is prepared to apply a buff or debuff.
- The resource consumption of Rhythm is not automated. (Would like to implement, but probably can't)

### Stunts
- Action type, level, prerequisite, compatible mount, applicable part, and summary can be set.
- Some Stunts are easier to manage if an Effect is prepared to apply a buff or debuff.

### Evocations
- Action type, level, target, range/area, duration, resistance, Card cost, and summary can be set.
- Automatic application of effects can be applied by using the Effects in the Details section.
- Resource consumption of Cards is not automated. (Would like to implement, but probably can't)

### Aspects
- The Qi type, Qi cost, duration, type, level, and summary can be set.
- Automatic application of effects can be applied by using the Effects in the Details section.
- Resource consumption of Qi is not automated. (Would like to implement, but probably can't)

### Strategems・Maneuvers
- You can set the Strategems and Maneuver, action type, level, Edge cost, Type (Line), rank, accumulated Edge, prerequisites, conditions, and summary.
- The setting items change depending on whether Strategem or Maneuver is selected.
- Automatic application of effects can be applied by using the Effects in the Details section.
- Resource change of Edge is not automated. (Would like to implement, but probably can't)

### Check
- It is an unique item and does not have an icon click function.
- You can select the behavior when clicking on the name and value on the character sheet.
- If "Combat" is checked, it will also appear on the Combat tab.

### Resource
- Only quantity, price, and description can be entered.

### Combat Feat
- Type, action type, prerequisite, prerequisite contents, use, application, risk, and summary can be entered.
- You can also check for support of Vagrant Feat and additional Battle Dancer Feat.
- Schools also use this item.
  - If "Secret" is checked, the name of the school, required reputation, secret type, and prerequisite conditions can be entered.
- Some Feats are easier to manage if an Effect is prepared to apply a buff or debuff.

### Class
- Level, experience table, and class type can be set.
- If the experience table is set, experience consumption is automatically calculated.
- The class type is used to calculate MP, especially for wizard skills, so be sure to set it correctly.

### Racial Ability
- Remaining uses and description can be set.
- The remaining number is intended for use with abilities that have a limited number of uses.
- Some abilities are easier to manage if an Effect is prepared to apply a buff or debuff.

### Language
- "Spoken" and "Written" checks are available.

### Monster Ability
- Action type and remarks can be entered.
- There are no items for Fortitude and Willpower for monsters. Please record them with this ability.
  - Fortitude and Willpower are automatically created.
  - The label names "Fortitude" and "Willpower" are used to determine if some Active Effects are applicable.
- Use this item for basic abilities (e.g., normal attacks) as well.
  - Three checks are automatically created: Accuracy, Damage, and Evasion.
  - The label names "Accuracy", "Damage", and "Evasion" are used to determine if some Active Effects are applicable.
- Use this item for resistable abilities as well.
  - Dice Rolls can be made by checking one of the Checks. Use a label with "Spellcasting" or something similar. Fixed values can also be used.
  - Resistance and resistance results can be entered in the remarks field as "evade/neg" to increase readability.
- About magic
  - Magic is intended to be registered as a magical ability item.
  - Individual magic can use the same items as PCs, but it can also be expressed as a monster ability.
- The Remarks field should be used flexibly in addition to that. It will appear on the list.
- Unlike normal items, up to three types of judgments can be used.
- There is a label input field for checks and power. The label name will be the label of the click-rollable part displayed in the list.
- For checks, in addition to setting a base value and a modified value, a fixed value check will fix the dice roll to 7, and a different type of dice can be used by using custom.
- Some abilities can be prepared with Effects to make them more manageable, but the effects are only partially applied.
- Most monster abilities should be able to be handled with this item, so use it flexibly.

## Dice Rolls

### Power Rolls
- When the chat display of the roll result is expanded by clicking on it, the "Half Critical" and "No C" buttons are displayed.
- Clicking on the "Half" button will calculate and redisplay the results with no critical, half damage, and be half damage effective. Click it again to return the results to the original state.
- Clicking on the "Half Critical" button will calculate and redisplay the results with critical, half damage, and be half damage effective. Click it again to return the results to the original state. 
- Clicking on the "No C" will calculate and redisplay the result without criticals. Click it again to return the results to the original state.
- The "Half Critical" button is not displayed in the roll results if "Half" is checked in the item's details. This is not supported due to the possibility of additional rolls.
- The "No C" button is not displayed in the roll result when the item is set to not have a critical value in the item details. This is not supported due to the possibility of additional rolls.
- The "No C" button is not displayed for results that are not critical.

### Results Application
- When "Apply" is set in the dice and power roll settings for each item, various buttons are displayed in the roll results that can be applied to a targeted actor.
- Select one target and click the relevant button as described below to increase or decrease HP or MP (multiple targets are not supported).
  - [✔ PDMG]Physical damage is applied to the target and their HP is reduced. The damage displayed is the value after applying the target's defense (protection points).
  - [✔ MDMG]Magical damage is applied to the target and their HP is reduced. The damage displayed is the value after the applying the target's magic defense.
  - [✔ FDMG]Fixed damage is applied to the target and their HP is reduced. The damage is applied directly to the target.
  - [✔ HPR]HP Recovery is applied to the target and their HP is increased. This will not increase the target's HP value above their maximum value.
  - [✔ MPR]MP Recovery is applied to the target and their MP is increased. This will not increase the target's MP value above their maximum value.

### Generic Power Table
- If the item's power table is blank, the generic power table is referenced and the result is displayed.
- The order of referencing is Item Settings → Generic Power Table in the world → Generic Power Table in the dictionary.
  - The order of reference in the dictionary is alphabetical order of the dictionary name.
  - The referenced generic power table is the page name "Reference Power Table" of the document name "Reference Data.
- Editing the Generic Power Table
  - It is recommended that you copy and edit the "Reference Data" of the attached dictionaries to other dictionaries or documents in the world.
  - When copying to a non-attached dictionary, please make sure that the dictionary name comes before the attached dictionary name "Reference" in alphabetical order (e.g., prefixed with an underscore) due to the reference priority.
  - Please enter only numbers in the appropriate fields, as they will not be recognized if the HTML structure is broken. Be careful not to include spaces, etc.
  - **Attention! ** Even if you unlock the attached dictionary and edit it, it will still be referenced, but it will be initialized at the time of system update.
- The edited contents of the generic power table will be updated at world login. Please reload after editing.
- The Japanese description of the Reference Power Table is as follows.There is no problem in deleting or changing the description of the copied Reference Power Table.
  - P column is the Power Value
  - Duplicate the attached "Reference Data" into your world, local compendiums, etc. for editing is recommended.
  - When duplicating the data in your own dictionaries, the name of the dictionary should be alphabetical order from "Reference" (e.g., with an underscore at the beginning).
  - Refreshing is required after editing.
  - Caution!　Attached compendiums will be initialized upon a system update!

## Effects

### Effects Classification (Buffs and Debuffs)
- As a general rule, we assume that Effects are set on items, which are then applied to characters when they possess them.
- It is also possible to create effects  on the character sheet and apply them directly to the character.

#### Temporary Effects
- Effects that are active and have a duration of application.
- Useful for magic, Personal Items, and Combat Feats that have a duration.
- It can be toggled on and off.
- You can change the classification to always active by leaving the duration blank.

#### Passive Effects
- Effects that are active and have no duration.
- It is useful for accessories, racial traits, and the effects of any Personal Items.
- It can be toggled on and off.
- You can change the classification to temporary by entering a duration.

#### Inactive Effects
- These are temporary Effects and passive Effects that have been disabled.
- New Effects created under this list are created as disabled temporary Effects.

### Effects Settings

#### Details Tab
- You can set the color of the icon and the description of the Effect.
- Checking "Effect Suspended" has the same function as enabling/disabling it in the list.
- Effects from items will have a check box to indicate whether or not they should be applied to the character who possesses them or not.

#### Duration Tab
You can set the duration in the Effect Duration (Turns) field.
- It is recommended to use the setting in turns, as setting it in seconds does not affect the functionality.
- The starting turn is automatically entered during combat, but can also be changed manually.
- The “Times Up” mod can be used to automatically decrease the duration of the turn setting.
  - Since the rule “the effect lasts until the beginning of the character's own turn” is unique to Sword World cannot be applied, there will be a slight discrepancy if this mod is used.

#### Effects Tab
- Multiple effects can be created for a single buff/debuff by clicking the + Button.
- Please select the type and content of the attribute key from the pull-down menu. You can also enter keys by selecting “Direct Input”.
- Negative values can also be entered for effect values.
- ** Attention! ** Regarding attribute keys (Translation note: This section is unclear)
  - Crit value modification is not reflected in the power check of magic items. Please use the magic Crit value modifier for magic items.
  - Special attacks and Critical Ray on PCs will only be applied to the weapon of choice.
  - All items that have checks on PC are only reflected on the items on the left side of the Check tab. It does not apply to the skills on the left side, nor to hit, evade, magic, etc. on the Combat tab.
  - All items that have checks on monsters are reflected on all items except for Accuracy and Magic.
  - All skill checks for PCs will be reflected on the right side of the Check tab.
  - Each Magic Power including All Magic Power is also reflected in the Power Check.
  - All items that have checks, All Magic, and individual checks and magic are duplicated.
  - Everything with MP Save can be applied to more than just spells.

### How to Apply Effects

#### Applied to Your Own Character
- Enable the Effect in the Effects tab to apply if to your character.

#### Applied to Other Characters
- Target the character you wish to apply the Effect to. Multiple targets can be selected and applied to at the same time.
- After selecting the target, click on the Effects button in the list of your character sheet or the Effect button in the chat box to apply the Effects to the target.
- The applied Effects can be viewed in the Effects tab of the character. They can be enabled or disabled on a character-by-character basis.
- If more than one Active Effect is applied to an item, they will all be applied. Unnecessary Active Effects should be manually removed after application.
- Temporary Effects that are disabled will be activated upon application.

### Notes on Effects
- All attribute key changes for Active Effects are only effective for PCs, e.g. PC to PC or Demon to PC.
- Only some attribute keys are effective on monsters, while other keys are ignored, but can be used to manage duration, etc.
- It is unlikely that direct input of attribute keys will be used.
- Please note that we do not manage duplicates of the same Effects, so beware of unintended duplicates.
- ** Attention! ** The Effects of the Active Effects can only be seen in the total value of the Effects tab.
- ** Attention! ** Some attribute keys for Active Effects will not be updated after loading the game World, but they will update themselves after you make any adjustments on the Character Sheet.
  - Examples of adjustments: Turning on/off Grace, entering various modifiers, updating current HP values, turning Active Effects on/off, etc.
 
## Layer Control (Toolbar on left side of screen)
Roll request button
- A roll request button has been added to the submenu of the Token Controls (GM only).
- A button for making checks by Class and Check items will be displayed in the chat, and each player can make the designated Check by clicking the button.
- The pull-down list will list the Classes and Check items possessed by the tokens currently placed in the scene.
- The GM can set the target number.
- If a target number is set, success or failure will also be automatically determined.

## Chat Commands (Custom Commands)
- The following commands all require the "Chat Commander" Module to be enabled.
- Without "Chat Commander", the custom commands are unavailable but the other functions can still be used.
- Note that it is not possible to output a rollable message enclosed in two brackets like the core roll command.

### Chat Commands for Power Rolls
- The following commands are all valid for making a power roll, "/powerroll", "/powroll", "/powr", "/rollpower", "/rollpow", "/rpow", "/rp", "/pow".
- Power Rolls can be made from the Chat input field by typing the Power Roll expression after the command.
- You may enter commentary text after the power roll expression.
- All outputs will be displayed as if they had the "apply" button enabled.
- **Caution** You must prepare the Reference Power Table in order to use the Power roll expression.

#### Format for Power Roll Expressions
- Replace <x> with any number in the following roll expression descriptions.
- The format is adapted from BCDice notation,but the behavior has been modified.
- "k<x>" Refers to the Power (required, e.g. k10 for Power 10)
- "@<x>" Refers to the Critical Value of the roll. (optional. If omitted, will default to 10, e.g. k10@10)
- "+<x>" and "-<x>" Refers to the roll's modification value. (optional, e.g. k10+2)
- "h", "h+<x>", "h-<x>" Refers to halving the Power Roll, and also adding or subtracting a modified value after taking the halved Power Roll. (optional, crit value will default to 13, e.g., k10+2h k10+2h-1).
- "#<x>" Refers to increasing the Power Roll by 1 step for special attacks, such as Lethal Strike. (optional, usually 1, e.g., k10@10+2#1).
- "$+<x>", "$-<x>" Refers to the value of the Power modifier for a Critical Ray (optional, e.g., k10+2$+2).
- "$f+<x>", refers to making the first roll a fixed number equal to <x>. This function can also be used for the Human's "Change Fate" 
- "tf<x>" Refers to fixing one dice to the X number and rolling the second dice, such as when using the Apothecary's Tools (optional, usually 4, e.g., k10@13tf4 is equal to rolling 1d6+4 on Power 10 Table).
- "r<x>” Refers the power table increase when using the Executioner's Blade (optional, usually 5, e.g., k10@10+2r5).

## Game System Settings

### Setting the target for Active Effects Application
- Settings for PCs
  - You can set the “item name” of the check item corresponding to the attribute key.
  - The item name of the check item automatically created is the default.
  - If the setting is changed, the item name must also be the same, otherwise the Active Effects will not be applied.
Settings for Monsters
  - You can set the “label name” of the monster ability corresponding to the attribute key. Item names are not taken into account.
  - The default label name is the label name set for the automatically created monster ability.
  - If you change the setting, the label name must also be the same, otherwise Active Effects will not be applied.
  - If you change the setting, the label name must also be the same to apply the Active Effects.
  - **Note! ** In the case of monster ability, it is confirmed through the label name, not by the item name. Please take caution.

## Macro Support

### YutoSheetII Import Macro
- (https://yutorize.2-d.jp/ytsheet/sw2.5/)
- ~~[yt2import]Macro has been included to import from YutoSheetII.~~ >> [Sword World 2.5 Support Tools](https://github.com/keyslock/sw25-fvtt-support)
  - Prepare a JSON output file from the YutoSheetII website.
  - Use the macro, select the JSON YutoSheetII file, and then click on import.
  - Data treated as items are searched in the order of “Item List in World” -> “Item List in Dictionary (Alphabetical Order)”, and if there is an item with a matching item name, the data is imported. If not, a new item is created.
- Precautions
  - Only PCs and monsters are supported.
  - Items and magic, except for equipment, are not imported.
  - Some races will not have their initial learned languages automatically imported, and must be manually added.
  - Additional parts of accessories are not supported.
  - Monster abilities can be imported as a list or as individual items (beta).
  - If importing monster abilities as individual items does not work, please uncheck the box before importing.
  - Newly created items without a matching item name will need to be set manually.
  - Some items with imported data may also need to be set manually.
  - Data that is not imported will need to be added manually.

## Precautions
- Error handling is lax.
- A warning message appears on the console, but since there is no problem with the operation, it has been left alone for the time being.
- We have not tested the compatibility with the mod. It is compatible with "Dice So Nice!", "Times Up", and "Chat Commander"
- The layout has not been validated in English.
- Limited permissions for NPCs and monsters, icons and images will not be changed.
- We recommend using the “Times Up” mod to manage the duration of buffs and debuffs.
- "Chat Commander" is required to use Custom Chat Commands.
- Combat has not been implemented. We recommend that you take initiative manually or install mods.
- An example of a mod that supports the order of action (I personally think that Popcorn Initiative is suited for this)
  - Popcorn type "Lancer Initiative" and "Just Popcorn Initiative
  - Group type "Combat Tracker Extensions" and "Combat Tracker Groups"
