/**
 * Parse a time string into milliseconds.
 * @param str - The time string to parse.
 * @returns The parsed time in milliseconds or undefined if invalid.
 */
export function parseTimeString(str: string): number | undefined {
  const regex = /^([\d]+(?:\.\d+)?)(ms|s|m|h|d)$/i;
  const match = str.match(regex);
  if (!match) return undefined;
  const [, valueStr = undefined, unitStr = undefined] = match;
  if (!valueStr || !unitStr) return undefined;
  const value = parseFloat(valueStr);
  const unit = unitStr.toLowerCase();
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60_000;
    case "h":
      return value * 3_600_000;
    case "d":
      return value * 86_400_000;
    default:
      return undefined;
  }
}

/**
 * Generates a random password based on the specified length and complexity.
 * @param length - The length of the password.
 * @param complexity - The complexity of the password. 0-default, only lowercase letters and numbers, 1-lowercase and uppercase letters and numbers, 2-all characters including symbols.
 * @returns The generated password.
 */
export function generatePassword(
  length: number,
  complexity: number = 0,
): string {
  const comp0 = "abcdefghijklmnopqrstuvwxyz0123456789";
  const comp1 =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const comp2 =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':\"\\,./<>?";
  let password = "";
  switch (complexity) {
    case 0:
      for (let i = 0; i < length - 1; i++) {
        password += comp0.charAt(Math.floor(Math.random() * comp0.length));
      }
      break;
    case 1:
      for (let i = 0; i < length - 1; i++) {
        password += comp1.charAt(Math.floor(Math.random() * comp1.length));
      }
      break;
    case 2:
      for (let i = 0; i < length - 1; i++) {
        password += comp2.charAt(Math.floor(Math.random() * comp2.length));
      }
      break;
    default:
      for (let i = 0; i < length - 1; i++) {
        password += comp0.charAt(Math.floor(Math.random() * comp0.length));
      }
      break;
  }
  return password;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}
