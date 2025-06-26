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
    const container = keys.reduce((o, k) => o[k] ??= {}, target);
    container[lastKey] = value;
  }
}
