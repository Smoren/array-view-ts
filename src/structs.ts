import { IndexError, ValueError } from "./excpetions";
import { normalizeIndex } from "./utils";

/**
 * Represents a slice definition for selecting a range of elements.
 */
export class Slice {
  /**
   * The start index of the slice range.
   */
  public readonly start: number | undefined;
  /**
   * The end index of the slice range.
   */
  public readonly end: number | undefined;
  /**
   * The step size for selecting elements in the slice range.
   */
  public readonly step: number | undefined;

  /**
   * Converts a slice string or Slice object into a Slice instance.
   *
   * @param {string | Slice} s - The slice string or Slice object to convert.
   * @returns {Slice} The converted Slice instance.
   */
  public static toSlice(s: string | Slice): Slice {
    if (s instanceof Slice) {
      return s;
    }

    if (!this.isSliceString(s)) {
      throw new ValueError(`Invalid slice: "${String(s)}".`);
    }

    const slice = this.parseSliceString(s);

    return new Slice(...slice);
  }

  /**
   * Checks if the provided value is a Slice instance or a valid slice string.
   *
   * @param {unknown} s - The value to check.
   *
   * @returns {boolean} True if the value is a Slice instance or a valid slice string, false otherwise.
   */
  public static isSlice(s: unknown): boolean {
    return (s instanceof Slice) || this.isSliceString(s);
  }

  /**
   * Checks if the provided value is a valid slice string.
   *
   * @param {unknown} s - The value to check.
   *
   * @returns {boolean} True if the value is a valid slice string, false otherwise.
   */
  public static isSliceString(s: unknown): boolean {
    if (typeof s !== "string") {
      return false;
    }

    if (!Number.isNaN(Number(s))) {
      return false;
    }

    if (!s.match(/^-?[0-9]*:?-?[0-9]*:?-?[0-9]*$/)) {
      return false;
    }

    const slice = this.parseSliceString(s);

    return !(slice.length < 1 || slice.length > 3);
  }

  /**
   * Creates a new Slice instance with optional start, end, and step values.
   *
   * @param {number} [start] - The start index of the slice range.
   * @param {number} [end] - The end index of the slice range.
   * @param {number} [step] - The step size for selecting elements in the slice range.
   */
  constructor(start?: number, end?: number, step?: number) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  /**
   * Normalizes the slice parameters based on the container length.
   *
   * @param {number} containerLength - The length of the container or array.
   *
   * @returns {NormalizedSlice} The normalized slice parameters.
   */
  public normalize(containerLength: number): NormalizedSlice {
    let step = this.step ?? 1;

    if (step > 0) {
      let start = this.start ?? 0;
      let end = this.end ?? containerLength;

      [start, end, step] = [Math.round(start), Math.round(end), Math.round(step)];

      start = normalizeIndex(start, containerLength, false);
      end = normalizeIndex(end, containerLength, false);

      if (start >= containerLength) {
        start = end = containerLength - 1;
      }

      start = this.squeezeInBounds(start, 0, containerLength - 1);
      end = this.squeezeInBounds(end, 0, containerLength);

      if (end < start) {
        end = start;
      }

      return new NormalizedSlice(start, end, step);
    } else if (step < 0) {
      let start = this.start ?? containerLength - 1;
      let end = this.end ?? -1;

      [start, end, step] = [Math.round(start), Math.round(end), Math.round(step)];

      start = normalizeIndex(start, containerLength, false);

      if (!(this.end === undefined)) {
        end = normalizeIndex(end, containerLength, false);
      }

      if (start < 0) {
        start = end = 0;
      }

      start = this.squeezeInBounds(start, 0, containerLength - 1);
      end = this.squeezeInBounds(end, -1, containerLength);

      if (end > start) {
        end = start;
      }

      return new NormalizedSlice(start, end, step);
    }

    throw new IndexError("Step cannot be 0.");
  }

  /**
   * Returns the string representation of the Slice.
   *
   * @returns {string} The string representation of the Slice.
   */
  public toString(): string {
    return `${this.start ?? ""}:${this.end ?? ""}:${this.step ?? ""}`;
  }

  /**
   * Parses a slice string into an array of start, end, and step values.
   *
   * @param {string} s - The slice string to parse.
   *
   * @returns {(number | undefined)[]} An array of parsed start, end, and step values.
   */
  private static parseSliceString(s: string): (number | undefined)[] {
    return s.split(":")
      .map(x => x.trim())
      .map(x => (x === "") ? undefined : parseInt(x));
  }

  /**
   * Constrains a value within a given range.
   *
   * @param {number} x - The value to constrain.
   * @param {number} min - The minimum allowed value.
   * @param {number} max - The maximum allowed value.
   *
   * @returns {number} The constrained value.
   */
  private squeezeInBounds(x: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, x));
  }
}

/**
 * Represents a normalized slice definition with start, end, and step values.
 */
export class NormalizedSlice extends Slice {
  /**
   * The start index of the normalized slice.
   */
  public readonly start: number;
  /**
   * The end index of the normalized slice.
   */
  public readonly end: number;
  /**
   * The step size for selecting elements in the normalized slice.
   */
  public readonly step: number;

  /**
   * Creates a new NormalizedSlice instance with start, end, and step values.
   *
   * @param {number} start - The start index of the normalized slice.
   * @param {number} end - The end index of the normalized slice.
   * @param {number} step - The step size for selecting elements in the normalized slice.
   */
  constructor(start: number, end: number, step: number) {
    super();
    this.start = start;
    this.end = end;
    this.step = step;
  }

  /**
   * Returns the length of the normalized slice.
   *
   * @type {number}
   */
  get length(): number {
    return Math.ceil(Math.abs(((this.end - this.start) / this.step)));
  }

  /**
   * Converts the provided index to the actual index based on the normalized slice parameters.
   *
   * @param {number} i - The index to convert.
   *
   * @returns {number} The converted index value.
   */
  public convertIndex(i: number): number {
    return this.start + normalizeIndex(i, this.length, false) * this.step;
  }

  /**
   * Generate an iterator for iterating over the elements in the normalized slice range.
   *
   * @returns {IterableIterator<number>} An iterator for the normalized slice range.
   */
  public* toRange(): IterableIterator<number> {
    for (let i = 0; i < this.length; ++i) {
      yield this.convertIndex(i);
    }
  }
}
