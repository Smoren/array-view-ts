import { IndexError } from "./excpetions";

export function normalizeIndex(index: number, containerLength: number): number {
  const dist = index >= 0 ? index : Math.abs(index) - 1;
  if (dist >= containerLength) {
    throw new IndexError(`Index ${index} is out of range`);
  }
  return index < 0 ? containerLength + index : index;
}
