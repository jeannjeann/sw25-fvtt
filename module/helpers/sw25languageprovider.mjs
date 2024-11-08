/**
 * Extend the LanguageProvider of Polyglot module
 * @extends {LanguageProvider}
 */
export function preparePolyglot(LanguageProvider) {
  return class SW25LanguageProvider extends LanguageProvider {
    defaultLanguage = "common";
    defaultFont = "Thorass";

    async getLanguages(compendium) {
      // Set default language
      const langs = {
        common: {
          label: "Show to Everyone",
          font: "Olde English",
          rng: "none",
        },
      };
      if (this.replaceLanguages) {
        CONFIG.SW25.spoken = {};
      }
      const languagesSetting = game.settings.get("polyglot", "Languages");

      // Get language from Compendium
      if (compendium) {
        for (const pack of game.packs) {
          if (pack.documentName != "Item") continue;
          await pack.getIndex();
          for (const entry of pack.index) {
            if (entry.type == "language") {
              const item = await pack.getDocument(entry._id);
              if (item) {
                const langConv =
                  `${item.name}` +
                  ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
                langs[langConv] = {
                  label: langConv,
                  font:
                    item.system?.font ||
                    languagesSetting[langConv]?.font ||
                    this.languages[langConv]?.font ||
                    this.defaultFont,
                  rng: languagesSetting[langConv]?.rng || "default",
                };
                const langRead =
                  `${item.name}` +
                  ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
                langs[langRead] = {
                  label: langRead,
                  font:
                    item.system?.font ||
                    languagesSetting[langRead]?.font ||
                    this.languages[langRead]?.font ||
                    this.defaultFont,
                  rng: languagesSetting[langRead]?.rng || "default",
                };
              }
            }
          }
        }
      }

      // Get language from World
      for (const item of game.items.contents) {
        if (item.type === "language") {
          const langConv =
            `${item.name}` +
            ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
          langs[langConv] = {
            label: langConv,
            font:
              item.system?.font ||
              languagesSetting[langConv]?.font ||
              this.languages[langConv]?.font ||
              this.defaultFont,
            rng: languagesSetting[langConv]?.rng || "default",
          };
          const langRead =
            `${item.name}` +
            ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
          langs[langRead] = {
            label: langRead,
            font:
              item.system?.font ||
              languagesSetting[langRead]?.font ||
              this.languages[langRead]?.font ||
              this.defaultFont,
            rng: languagesSetting[langRead]?.rng || "default",
          };
        }
      }

      // Get language from Actor
      for (const actor of game.actors.contents) {
        if (actor.type == "character") {
          for (const item of actor.items) {
            if (item.type == "language") {
              const langConv =
                `${item.name}` +
                ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
              langs[langConv] = {
                label: langConv,
                font:
                  item.system?.font ||
                  languagesSetting[langConv]?.font ||
                  this.languages[langConv]?.font ||
                  this.defaultFont,
                rng: languagesSetting[langConv]?.rng || "default",
              };
              const langRead =
                `${item.name}` +
                ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
              langs[langRead] = {
                label: langRead,
                font:
                  item.system?.font ||
                  languagesSetting[langRead]?.font ||
                  this.languages[langRead]?.font ||
                  this.defaultFont,
                rng: languagesSetting[langRead]?.rng || "default",
              };
            }
          }
        }
        if (actor.type == "npc" || actor.type == "monster") {
          for (let lang of actor.system.attributes.languages.conv) {
            const langConv =
              `${lang}` +
              ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
            langs[langConv] = {
              label: langConv,
              font:
                languagesSetting[langConv]?.font ||
                this.languages[langConv]?.font ||
                this.defaultFont,
              rng: languagesSetting[langConv]?.rng || "default",
            };
            const langRead =
              `${lang}` +
              ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
            langs[langRead] = {
              label: langRead,
              font:
                languagesSetting[langRead]?.font ||
                this.languages[langRead]?.font ||
                this.defaultFont,
              rng: languagesSetting[langRead]?.rng || "default",
            };
          }
          for (let lang of actor.system.attributes.languages.read) {
            const langConv =
              `${lang}` +
              ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
            langs[langConv] = {
              label: langConv,
              font:
                languagesSetting[langConv]?.font ||
                this.languages[langConv]?.font ||
                this.defaultFont,
              rng: languagesSetting[langConv]?.rng || "default",
            };
            const langRead =
              `${lang}` +
              ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
            langs[langRead] = {
              label: langRead,
              font:
                languagesSetting[langRead]?.font ||
                this.languages[langRead]?.font ||
                this.defaultFont,
              rng: languagesSetting[langRead]?.rng || "default",
            };
          }
        }
      }

      // Get language from CONFIG
      for (let lang in CONFIG.SW25.spoken) {
        langs[lang] = {
          label: CONFIG.SW25.spoken[lang]?.label || lang,
          font:
            CONFIG.SW25.spoken[lang]?.font ||
            languagesSetting[lang]?.font ||
            this.languages[lang]?.font ||
            this.defaultFont,
          rng:
            CONFIG.SW25.spoken[lang]?.font ||
            languagesSetting[lang]?.rng ||
            "default",
        };
      }

      // Set language
      this.languages = langs;
    }

    getUserLanguages(actor) {
      let known_languages = new Set();
      let literate_languages = new Set();

      known_languages.add("common");
      for (let lang of actor.system.attributes.languages.conv) {
        const langConv =
          lang + ` (${game.i18n.localize("SW25.Item.Language.Conversation")})`;
        known_languages.add(langConv);
      }
      for (let lang of actor.system.attributes.languages.read) {
        const langRead =
          lang + ` (${game.i18n.localize("SW25.Item.Language.Reading")})`;
        known_languages.add(langRead);
        /* if polyglot support literate, enable this section
        literate_languages.add(langRead);
        */
      }
      return [known_languages, literate_languages];
    }
  };
}
