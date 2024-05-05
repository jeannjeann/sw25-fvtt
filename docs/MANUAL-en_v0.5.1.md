# Simplified Manual for Sword World 2.5

## PC

### Header Section
This is the area where the character summary is displayed.
- Name, character image, current HP, current MP, Fumbles, and Grace or no Grace can be adjusted.
- The rest of the fields are automatically reflected from other input fields.

### Tabs
- In each item list, click on the name of any item (except skills, dice rolls, resources, and languages) to expand its description.
- For listings that do not have a New, Edit, or Delete button in the item list, the Edit and Delete buttons will appear when the description is expanded.

#### Ability Values and Skills (Class) Tab
These tabs are mainly used during creation and growth.
- Ability Value column (left)
  - Ability values and bonuses are automatically calculated by entering Mind, Skill, Body, A-F, Growth, and Modifications.
- Maximum HP and MP modifiers (upper right)
  - Enter when making modifications to the automatically calculated values. This is intended for cases where the value has been changed by special skills, items, magic, etc. (I would like to implement automatic calculation)
- Skill (Class) column (lower right)
  - Class are listed. Clicking on the icon will display the description in chat.
  - You can increase, decrease, edit, delete, or create new levels from the list.
  - You can also add classes by dragging them from an item.
  - Experience used is automatically calculated.
  - Please check the item description below for details.

#### Judgment (Check) Tab
These are tabs that would be used mainly during the normal (non-combat) part of the session.
- Check column (left)
  - Various checks can be registered. You can make an action check and a power roll.
  - You can enter, edit, delete, and create new values from the list.
  - The base value displayed is the value added to 2d6 in the case of judgments, and the value added after the roll in the case of power rolls. The entries in the modification column will be reflected in this value.
  - Click on the item name and base value to make the corresponding roll.
  - This list is intended to increase convenience by registering basic checks such as Fortitude and Willpower, as well as frequently used checks related to skills such as Initiative, Monster Knowledge, Check Package, and Spellcasting.
  - It is recommended that Fortitude, Willpower, Initiative, and Monster Knowledge be created for all characters based on personal experience.
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
  - Select the skill to be used for evasion in the Combat Information column.
- Equipment column
  - Weapons, armor, and ornaments with the "Equipped" checkbox in the item details will be displayed.
  - You cannot create, edit, or delete items from this column. Please do so from the list in the "Equipment" tab.
  - The behavior when clicking on the icon can be set in the details. By default, the chat display will show the description of the weapon.
  - Click to roll the accuracy and power sections of the weapon list. The values in the various modifier fields are reflected.
  - When using a sub-weapon or using a weapon in a different way (e.g. 2H with an ambidextrous weapon), this direct click may be more convenient than changing the weapon of choice.

#### Features Tab
This tab displays race characteristics and combat skills, as well as Techniques, Spellsongs and Finales, Stunts, Evocations, Aspects, Strategems and Maneuvers, etc.
- New, edit, and delete can be performed.
- If you don't have any of the Classes listed, they will not be displayed, except for the race and combat skills. If you check the "Show Blank Groups" checkbox, a list of items that you do not possess will also be displayed. If you want to create a new item, please use this option.
  - The behavior when clicking on icons can be configured from Details. By default, the chat display shows the description of the item.
- Some items can be checked in "Use Dice Roll" and "Use Power Table" in the details. When checked, "Dice Roll" and "Power" are displayed in the list, and the corresponding roll can be performed by clicking on the checkbox. Please use this function when necessary, for example, for checks on the usage of spellsongs, etc., or for power rolls.
- Action types are automatically displayed in front of the name. The following types are displayed: Always (○), Major (▶), Minor (≫), Combat Preparation (△), and Declaration (□).

#### Magic (Spells) Tab
This tab displays information about magic.
- The list is divided for each magic system. Selecting a magic system in the item details will be reflected in the list.
- The magic system and magic power are displayed at the top of the list. By clicking on the item, you can determine whether or not to use it. To make the dice roll in chat, you need to select the Class to be used. There is also an input box for modifications.
- Items cannot be created, edited, or deleted from the list by magic system. Please go to "Show All Spell".
- The behavior when clicking on icons can be configured in the details. By default, the description is displayed in the chat.
- Some items can be checked in "Use Dice" and "Use Power List" in the details. When checked, "Dice Check" and "Power" are displayed in the list, and the corresponding roll can be performed by clicking on it. Since the rolls can be exercised from the top of the list, please use mainly the power rolls as necessary.
- If you check the "Show All Spell" checkbox, a list of all the magic items in your possession will be displayed, regardless of the system. You can also click on icons and roll from "Spellcasting" and "Power".
- New creation, editing, and deletion can only be done from the "Show All Spell" list.
- The magic operation type is automatically displayed before the name. The following types of magic are displayed: Always (○), Major (▶), Minor (≫), Combat Ready (△), and Declared (□).

#### Possessions (Items) Tab
This tab displays items in your possession, including equipment.
- There is a field for entering the amount of money you have. There is no automatic calculation function. (To be implemented)
- New creation, editing, and deletion of each item can be performed. Weapons, armor, and ornaments can be created here. You cannot do this from the combat tab.
- Item List
  - By checking the "Use Dice Roll" and "Use Power Table" checkboxes in the details, "Dice Check" and "Power" will appear in the list, and you can perform the corresponding roll by clicking on them. Use this function for medicinal herbs and the like.
  - The behavior when clicking on the icon can be set in the "Details" menu. By default, the chat display is the description of the item.
- Weapons, Armor, and Decorations
  - There is an "Equip" checkbox in the list. Checked items are displayed in the combat tab.
  - (Weapons, armor, and ornaments do not display "Dice Check" and "Power" even if "Use Dice Roll" and "Use Power Table" are checked in the details.
  - The behavior when clicking on icons can be set in the details. By default, the chat display will show the description of the item.

#### Description Tab
This tab displays language, other settings, notes, etc.
- Language column (upper left)
  - Languages can be created, edited, and deleted.
  - You can check the "Conversation "Reading" checkbox.
- Settings (upper right)
  - This is where you can enter data. The data will be reflected in the header section.
  - Experience gained is the field for entering the total experience value. It is reflected in the skill column.
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
- Name, monster image, current HP, and current MP can be manipulated.
- The rest of the information is automatically reflected from the input fields in the other detail tabs.
- With limited privileges, only the summary is displayed.
- About Monster Knowledge Check
  - Only a summary is displayed with limited privileges.
  - If you have limited privileges before or after a successful Monster Knowledge Check, the data will be kept secret.
  - If the player is granted "Viewer" privileges after a successful Monster Knowledge Check, the data will be visible to the player.
  - The image will be displayed as it is to the player with limited privileges.

#### Monster Ability Tab
This tab displays the various abilities of monsters.
- Use this item for Fortitude and Willpower. This item is required for all monsters.
- The behavior when clicking on the icon can be set from Details. By default, the description is displayed in the chat.
- The ability's behavior type is automatically displayed before its name. The following types are available: Always "○", Major Action "▶", Minor Action "≫", Combat Preparation "△", and Declaration "□".
- By checking the "Check 1-3" and "Power Table" checkboxes in the details, the respective label names are displayed, and the corresponding roll can be performed by clicking on them. Use as necessary.
- By checking the "Fixed Value" checkbox under Details for each check, the dice result is automatically fixed at "7" and the roll result is displayed as a fixed value.
- Use this item for basic abilities (e.g., normal attacks) as well.
  - Three checks will be used: Accuracy, Damage, and Evasion. Labeling each as "Accuracy," "Damage," and "Evasion" will increase readability.
  - HP, MP, defense (protective points), and magic defense are entered separately.
- Resistable abilities should also use this item.
  - Using Dice Rolls can be made by checking one of the Checks. Use a label with "Spellcasting" or something similar. Fixed values can also be used.
  - Resistance and resistance results can be entered in the remarks field as "evade/neg" to increase readability.
- Multi-part demons cannot be represented by a single token. (To be implemented)
  - Please prepare separate tokens for the main token and other parts of the body, and operate with multiple tokens.
  - For abilities that affect the whole body, etc., please use the description in the remarks column.
- **About Magic**
  - Magic is intended to be registered as a magical ability.
  - Individual magic can use the same items as PCs. It can also be expressed as a magical ability.
  - If you want to use the same items as the PCs, check the "Use Magic" checkbox to display the list of magic and use it.
  - Enter the magic power of the monster in the check modifier and use it.
  - Please note that skills and ability values cannot be diced unless "-" is selected.

#### Description Tab
- This is a free description field. This is intended for general descriptions of the demon.
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
  - You can select the behavior when the icon is clicked in the list. You can choose to display the description in the chat or roll a die.
- Use Dice Roll, Use Power Table
  - Checking the checkbox enables the roll from the list. Also, by checking the checkbox, the setting items will be displayed.
- Use Dice Settings
  - You can specify the class, ability value bonuses, and modifiers to be used for the dice roll. Also, check the "Custom Dice" checkbox to use dice other than 2d6. Fixed values can also be specified.
- Power Table Settings
  - Set the class, ability value bonus, modifier, power, critical value (C value), and power table content to be used for the dice roll.
  - Check "Halve" to halve the result.
  - The "Special Treatment (Particular)" checkbox allows you to set the modified value after halving, the increased value of Lethal Strike (usually 1), the increased value of Critical Ray, and the roll of the Apothecary's Tool (usually 4).
  - The calculation of Executioner's Blade cannot currently be handled. Please refer to the stakes and modify the values manually.
  - If the power table is blank, it should refer to the generic power table to get the value. (Not implemented yet, after implementation, Executioner's Blade can be handled)

### Weapons
- Equipment checks, categories, ranks, types, usages, specializations, minimum Strength, hit modifiers, additional damage, and ranges can be set.
- These are items that will be used with both the check and power tables.
- Bonuses due to specialization are not automatically reflected. (We would like to implement)
- For weapons with multiple usages, it would be useful to create a separate item for each usage.

### Armor and Shields
- Armor and shields are items in the same category.
- Equipment checks, categories, ranks, specializations, minimum strength, evasion modifiers, protection points (defense), and magic protection can be set.
- Both dice roll and power are basically not used for these items.
- Bonuses from specialization are not automatically reflected. (To be implemented)

### Accessories
- Equipment checks, part to be equipped on, and specializations can be set up.
- Both the check and the power of the item are basically not used.
- Please manage manually as we have not implemented any restrictions on equipping the same part of the body.
- Bonuses for exclusive use are not automatically reflected. (We would like to implement)

### Item
- Quantity and price can be entered.
- Please use flexibly by combining dice roll and power to suit each item.

### Spell
- Magic system, level, action type, MP consumption, target, range/shape, duration, resistance, type, and summary can be set.
- Please use flexibly by combining dice roll and power.
- If you do not select a magic system, it will not appear correctly in the list on the character sheet.
- In Divine Magic, selection of Sacred and Vice systems, and input fields for special divine magic will be added.
- In Magitech, an entry field for Magisphere will be added.
- In Fairy Magic, an input field for type and (when necessary) attribute will be added.
- In Nature Magic, a checkbox for countering with life resistance (Fortitude) will be added.

### Technique (Enhance Art)
- Action type, level, MP consumption, duration, and summary can be set.
- Automatic application of buff effects is not supported. (Would like to implement)

### Spellsongs・Finale (Magical Song)
- The following items can be set: spellsong and finale selection, level, resistance, type, singing, pets, Rhythm Conditions, Base Rhythm, Extra Rhythm, Flourish Value, Extra Rhythm, Consumed Rhythm, and summary.
- The setting items change depending on the type of spellsong and finale.
- The resource consumption of Rhythm is not automated. (I would like to implement it, but probably can't.)

### Stunts (Riding Trick)
- Action type, level, prerequisite, compatible mount, applicable part, and summary can be set.

### Evocations (Alchemy Tech)
- Action type, level, target, range/area, duration, resistance, Card cost, and summary can be set.
- Automatic application of buff effects is not supported. (To be implemented)
- Resource consumption of Cards is not automated. (Would like to implement, but probably can't)

### Aspects (Phase Area)
- The Qi type, Qi cost, duration, type, level, and summary can be set.
- Automatic application of buff effects is not supported. (To be implemented)
- Resource consumption of Qi is not automated. (Would like to implement, but probably can't)

### Strategems・Maneuvers (Tactics)
- You can set the Strategems (Drum) and Maneuver (Camp), action type, level, Edge cost, Type (Line), rank, accumulated Edge, prerequisites, conditions, and summary.
- The setting items change depending on whether Strategem or Maneuver is selected.
- Automatic application of buff effects is not supported. (To be implemented)
- Resource change of Edge is not automated. (Would like to implement, but probably can't)

### Check
- It is an unique item and does not have an icon click function.
- You can select the behavior when clicking on the name and value on the character sheet.
- If "Combat" is checked, it will also appear on the Combat tab.

### Resource
- Only quantity, price, and description can be entered.

### Combat Feat (Combat Ability)
- Type, action type, prerequisite, prerequisite contents, use, application, risk, and summary can be entered.
- You can also check for support of Vagrant Feat and additional Battle Dancer Feat.
- Schools also use this item.
  - If "Secret" is checked, the name of the school, required reputation, secret type, and prerequisite conditions can be entered.

### Class (Skill)
- Level, experience table, and class type can be set.
- If the experience table is set, experience consumption is automatically calculated.
- The class type is used to calculate MP, especially for wizard skills, so be sure to set it correctly.

### Racial Ability (Race Ability)
- Remaining uses and description can be set.
- The remaining number is intended for use with abilities that have a limited number of uses.

### Language
- "Spoken" and "Written" checks are available.

### Monster Ability
- Action type and remarks can be entered.
- There are no items for Fortitude and Willpower for demons. Please record them with this ability.
- Use this item for basic abilities (e.g., normal attacks) as well.
  - Three judgments will be used: accuracy, damage, and evasion. Labeling each as "accuracy," "damage," and "evasion" will increase readability.
  - For defense (protection points), enter "defense:5" in the remarks field of the item to make it appear in the list and increase readability.
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
- Most monster abilities should be able to be handled with this item, so use it flexibly.

## Dice Rolls

### Power Rolls
- When the chat display of the roll result is expanded by clicking on it, the "Half Critical" and "No C" buttons are displayed.
- Clicking on the "Half Critical" button will calculate and redisplay the results with no critical, half damage, and be half damage effective. Click it again to return the results to the original state.
- Clicking on the "No C" will calculate and redisplay the result without criticals. Click it again to return the results to the original state.
- The "Half Critical" button is not displayed in the roll results if "Half" is checked in the item's details. This is not supported due to the possibility of additional rolls.
- The "No C" button is not displayed in the roll result when the item is set to not have a critical value in the item details. This is not supported due to the possibility of additional rolls.
- The "No C" button is not displayed for results that are not critical.

### Results Application
- When "Apply" is set in the dice and power roll settings for each item, various buttons are displayed in the roll results that can be applied to a targeted actor.
- Select one target and click the relevant button as described below to increase or decrease HP or MP (multiple targets are not supported).
  - [✔ PD]Physical damage is applied to the target and their HP is reduced. The damage displayed is the value after applying the target's defense (protection points).
  - [✔ MD]Magical damage is applied to the target and their HP is reduced. The damage displayed is the value after the applying the target's magic defense.
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

## Precautions
- Currently, it is a minimal implementation that can be used for sessions.
- This is an alpha version. It is quite likely that bugs remain.
- Error handling is lax.
- A warning message appears on the console, but since there is no problem with the operation, it has been left alone for the time being.
- We have not tested the compatibility with the mod. It is compatible with "Dice So Nice!
- The layout has not been validated in English.
- Limited permissions for NPCs and monsters, icons and images will not be changed.
- Combat has not been implemented. We recommend that you take the initiative regarding the order of actions or install mods.
- An example of a mod that supports the order of action (I personally think that Popcorn Initiative is suited for this)
  - Popcorn type "Lancer Initiative" and "Just Popcorn Initiative
  - Group type "Group Initiative" and "Combat Tracker Extensions"

