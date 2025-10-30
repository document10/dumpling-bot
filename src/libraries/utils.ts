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
