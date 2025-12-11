/**
 * Represents an RGBA color and provides convenience methods for converting
 * and deriving other color representations (hex, int, H/S/V/L, CMYK, etc).
 *
 * Instances store red, green, blue and alpha channels as 0-255 integers.
 */
export class Color {
  /**
   * Red channel (0-255).
   */
  r: number;
  /**
   * Green channel (0-255).
   */
  g: number;
  /**
   * Blue channel (0-255).
   */
  b: number;
  /**
   * Alpha channel (0-255).
   */
  a: number;
  /**
   * Create a new Color instance.
   *
   * @param {number} r - Red channel (0-255)
   * @param {number} g - Green channel (0-255)
   * @param {number} b - Blue channel (0-255)
   * @param {number} [a=255] - Alpha channel (0-255). Defaults to 255 (opaque).
   */
  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Parse a hex color string into a Color.
   *
   * Accepts formats with or without a leading `#`. Supports `RRGGBB` and
   * `RRGGBBAA` (8 hex digits) where the final two digits are interpreted
   * as alpha (0-255) and converted to 0-1.
   *
   * @param {string} hex - Hex string like '#ff00aa' or 'ff00aaff'
   * @returns {Color|undefined} A Color instance on success, or `undefined` on parse failure.
   */
  static fromHex(hex: string): Color | undefined {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length !== 6 && hex.length !== 8) {
      return undefined;
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)
      ? undefined
      : new Color(r, g, b, a);
  }

  /**
   * Create a Color from a 24-bit integer representation (0xRRGGBB).
   *
   * @param {number} value - Integer with red in the highest 8 bits, then green, then blue.
   * @returns {Color} Color with alpha set to 255 (Opaque).
   */
  static fromInt(value: number): Color {
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    const a = 1;
    return new Color(r, g, b, a);
  }

  /**
   * Generate a random color.
   *
   * @param {boolean} transparent - If true, alpha will be a random 0-1 value; otherwise alpha is 255.
   * @returns {Color} Randomly generated Color.
   */
  static random(transparent: boolean = false): Color {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = transparent ? Math.floor(Math.random() * 256) : 1;
    return new Color(r, g, b, a);
  }

  /**
   * Hex string (without a leading '#') for the RGB channels: RRGGBB.
   *
   * @type {string}
   */
  get hex(): string {
    const rHex = this.r.toString(16).padStart(2, "0");
    const gHex = this.g.toString(16).padStart(2, "0");
    const bHex = this.b.toString(16).padStart(2, "0");
    return `${rHex}${gHex}${bHex}`;
  }

  /**
   * Hex string (without a leading '#') including alpha: RRGGBBAA.
   *
   * @type {string}
   */
  get hexAlpha(): string {
    const rHex = this.r.toString(16).padStart(2, "0");
    const gHex = this.g.toString(16).padStart(2, "0");
    const bHex = this.b.toString(16).padStart(2, "0");
    const aHex = this.a.toString(16).padStart(2, "0");
    return `${rHex}${gHex}${bHex}${aHex}`;
  }

  /**
   * Integer representation of RGB (0xRRGGBB).
   *
   * @type {number}
   */
  get int(): number {
    return (this.r << 16) + (this.g << 8) + this.b;
  }

  /**
   * Hue component (0-360) used in the HSL,HSV or HWB color models.
   *
   * @type {number}
   */
  get h(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
      h = (60 * ((b - r) / (max - min)) + 120) % 360;
    } else if (max === b) {
      h = (60 * ((r - g) / (max - min)) + 240) % 360;
    }
    return h;
  }
  /**
   * Saturation for the HSV model (0-1).
   *
   * @type {number}
   */
  get sv(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max === 0) {
      return 0;
    }
    return (max - min) / max;
  }

  /**
   * Saturation for the HSL model (0-1).
   *
   * @type {number}
   */
  get sl(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min === 0) {
      return 0;
    }
    return (max - min) / (1 - Math.abs(2 * this.l - 1));
  }

  /**
   * Lightness (HSL) component (0-1).
   *
   * @type {number}
   */
  get l(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max + min) / 2;
  }
  /**
   * Value (HSV) component (0-1).
   *
   * @type {number}
   */
  get v(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    return Math.max(r, g, b);
  }

  /**
   * Cyan component (CMYK) (0-1).
   *
   * @type {number}
   */
  get c(): number {
    const r = this.r / 255;
    return (1 - r - this.k) / (1 - this.k);
  }

  /**
   * Magenta component (CMYK) (0-1).
   *
   * @type {number}
   */
  get m(): number {
    const g = this.g / 255;
    return (1 - g - this.k) / (1 - this.k);
  }

  /**
   * Yellow component (CMYK) (0-1).
   *
   * @type {number}
   */
  get y(): number {
    const b = this.b / 255;
    return (1 - b - this.k) / (1 - this.k);
  }

  /**
   * Black component used in CMYK or HWB (0-1).
   *
   * @type {number}
   */
  get k(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    return 1 - Math.max(r, g, b);
  }

  /**
   * White component (HWB) (0-1).
   *
   * @type {number}
   */
  get w(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    return Math.min(r, g, b);
  }

  /**
   * Returns a new Color that is the visual inverse of this color (alpha preserved as original).
   *
   * @returns {Color} Color with inverted RGB channels.
   */
  get inverted(): Color {
    return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
  }
}
