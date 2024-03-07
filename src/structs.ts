import { IndexError, ValueError } from "./excpetions";
import { normalizeIndex } from "./utils";

export class Slice {
  public readonly start: number | undefined;
  public readonly end: number | undefined;
  public readonly step: number | undefined;

  public static fromString(s: string): Slice {
    if (!this.isSlice(s)) {
      throw new ValueError(`Invalid slice: ${s}`);
    }

    const slice = this.parseSliceString(s);

    return new Slice(...slice);
  }

  public static isSlice(s: any): boolean {
    if (typeof s !== 'string') {
      return false;
    }

    if (!Number.isNaN(Number(s))) {
      return false;
    }

    const slice = this.parseSliceString(s);

    return !(slice.length < 1 || slice.length > 3);
  }

  constructor(start?: number, end?: number, step?: number) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  public normalize(containerLength: number): NormalizedSlice {
    let step = this.step ?? 1;

    if (step === 0) {
      throw new IndexError("Step cannot be 0");
    }

    let defaultEnd = (step < 0 && this.end === undefined) ? -1 : undefined;

    let start = this.start ?? (step > 0 ? 0 : containerLength - 1);
    let end = this.end ?? (step > 0 ? containerLength : -1);

    start = Math.round(start)
    end = Math.round(end)
    step = Math.round(step)

    start = normalizeIndex(start, containerLength, false);
    end = normalizeIndex(end, containerLength, false);

    if (step > 0 && start >= containerLength) {
      start = end = containerLength - 1
    } else if (step < 0 && start < 0) {
      start = end = 0;
      defaultEnd = 0;
    }

    start = this.squeezeInBounds(start, 0, containerLength - 1);
    end = this.squeezeInBounds(end, step > 0 ? 0 : -1, containerLength);

    if ((step > 0 && end < start) || (step < 0 && end > start)) {
      end = start;
    }

    return new NormalizedSlice(start, defaultEnd ?? end, step);
  }

  public toString(): string {
    return `${this.start ?? ''}:${this.end ?? ''}:${this.step ?? ''}`;
  }

  private static parseSliceString(s: string): (number | undefined)[] {
    return s.split(':')
      .map(x => x.trim())
      .map(x => (x === '') ? undefined : parseInt(x));
  }

  private squeezeInBounds(x: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, x))
  }
}

export class NormalizedSlice extends Slice {
  public readonly start: number;
  public readonly end: number;
  public readonly step: number;

  constructor(start: number, end: number, step: number) {
    super();
    this.start = start;
    this.end = end;
    this.step = step;
  }

  get length(): number {
    return Math.ceil(Math.abs(((this.end - this.start) / this.step)));
  }

  public convertIndex(i: number): number {
    return this.start + normalizeIndex(i, this.length, false) * this.step;
  }

  public *toRange(): IterableIterator<number> {
    for (let i = 0; i < this.length; ++i) {
      yield this.convertIndex(i);
    }
  }
}
