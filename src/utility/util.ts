import type { Theme } from "../entity/theme.js";

export function nullOrZero(n: number | undefined | null, def: number): number {
  if (n == null || n <= 0) {
    n = def;
  }
  return n;
}

declare global {
  interface String {
    toTitleCase(): string;
  }
}

String.prototype.toTitleCase = function (): string {
  return String(this)
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export function isNullOfUndefined<T>(
  object: T | undefined | null
): object is T {
  return <T>object !== undefined && <T>object !== null;
}

export function getReply(
  themeList: Theme[],
  current: number,
  max: number
): string {
  return (
    themeList
      .map((value) => {
        return value.theme.trimEnd();
      })
      .join("\n") + `\n*[${current}/${max}]*`
  );
}

export function getPageIndex(
  page: number,
  max: number,
  divide: number
): number {
  page = page <= 0 ? 1 : page > max ? max : page;
  return 1 + (page - 1) * divide;
}

export function validateInput(input: string): string {
  if (input.trim().length <= 0) {
    throw Error("Text missing!");
  }
  if (input == null || input == undefined) {
    throw Error("Undefined or null value!");
  }

  return input.toTitleCase();
}

export function validateNumber(input: number): number {
  if (input < 0) {
    throw Error("Number Out of Bound!");
  }
  if (input == undefined) {
    input = 1;
  }

  return input;
}
