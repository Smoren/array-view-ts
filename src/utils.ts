import { IndexError } from "./excpetions";

/**
 * Normalizes an index value within the range of a container length,
 * optionally throwing an error if the index is out of range.
 *
 * @param {number} index - The index value to normalize.
 * @param {number} containerLength - The length of the container or array.
 * @param {boolean} [throwError=true] - Optional flag to indicate whether to throw an error if the index is out of range.
 *
 * @returns {number} The normalized index value within the range of the container length.
 */
export function normalizeIndex(index: number, containerLength: number, throwError: boolean = true): number {
  const dist = index >= 0 ? index : Math.abs(index) - 1;
  if (throwError && dist >= containerLength) {
    throw new IndexError(`Index ${index} is out of range.`);
  }
  return index < 0 ? containerLength + index : index;
}

export function isCountable(target: any): boolean {
  return target.length !== undefined;
}
