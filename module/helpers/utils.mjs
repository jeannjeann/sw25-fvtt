export class Util {
  static hexToRgb(hex) {
    hex = hex.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    if (hex.length !== 6) {
      throw new Error("Invalid hex color format");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return { r, g, b };
  }

  static getValue(target, keyB = null) {
    if (!keyB) return target;

    return keyB.split(".").reduce((o, k) => (o ? o[k] : undefined), target);
  }

  static setValue(target, keyB = null, value) {
    if (!keyB) return value;

    const keys = keyB.split(".");
    const lastKey = keys.pop();
    const container = keys.reduce((o, k) => (o[k] ??= {}), target);
    container[lastKey] = value;
  }

  /**
   * Get Controlled Actor or This Actor
   */
  static async getControlledActor(actor) {
    let selectedTokens = canvas.tokens.controlled;
    if (actor && selectedTokens.length === 0) {
      selectedTokens = canvas.tokens.placeables.filter(
        (t) => t.actor?.id === actor.id
      );
    }
    return selectedTokens;
  }

  /**
   * Get Controlled Actor or User's Actor
   */
  static async getControlledActorFromUser() {
    let selectedTokens = canvas.tokens.controlled;
    if (
      game.settings.get("sw25", "defaultCharaAction") &&
      game.user.character &&
      selectedTokens.length === 0
    ) {
      const userActor = game.user.character;
      if (userActor) {
        selectedTokens = canvas.tokens.placeables.filter(
          (t) => t.actor?.id === userActor.id
        );
      }
    }
    return selectedTokens;
  }

    // RGB to HSL
  static rgbToHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h, s, l };
  }

  // HSL to RGB
  static hslToRgb({ h, s, l }) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  static getContrastColor({ r, g, b }) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5
      ? { r: 0, g: 0, b: 0 }
      : { r: 255, g: 255, b: 255 };
  }

  static buildDispositionTheme(hex) {
    const mainBg = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(mainBg);

    const isDark = hsl.l < 0.5;

    const subHsl = {
      h: hsl.h,
      s: hsl.s * 0.9,
      l: Math.max(0, Math.min(1, hsl.l + (isDark ? 0.15 : -0.1))),
    };

    const subBg = this.hslToRgb(subHsl);

    return {
      main: {
        bg: mainBg,
        text: this.getContrastColor(mainBg),
      },
      sub: {
        bg: subBg,
        text: this.getContrastColor(subBg),
      },
    };
  }
}
