export class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromHex(hex: string): Color | undefined {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length !== 6) {
      return undefined;
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? undefined : new Color(r, g, b);
  }

  static fromInt(value: number): Color {
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    return new Color(r, g, b);
  }

  get hex(): string {
    const rHex = this.r.toString(16).padStart(2, "0");
    const gHex = this.g.toString(16).padStart(2, "0");
    const bHex = this.b.toString(16).padStart(2, "0");
    return `${rHex}${gHex}${bHex}`;
  }

  get int(): number {
    return (this.r << 16) + (this.g << 8) + this.b;
  }
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

  get l(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max + min) / 2;
  }
  get v(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    return Math.max(r, g, b);
  }

  get c(): number {
    const r = this.r / 255;
    return (1 - r - this.k) / (1 - this.k);
  }

  get m(): number {
    const g = this.g / 255;
    return (1 - g - this.k) / (1 - this.k);
  }

  get y(): number {
    const b = this.b / 255;
    return (1 - b - this.k) / (1 - this.k);
  }

  get k(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    return 1 - max;
  }

  get inverted(): Color {
    return new Color(255 - this.r, 255 - this.g, 255 - this.b);
  }
}
