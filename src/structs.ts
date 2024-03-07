import { IndexError } from "./excpetions";
import { normalizeIndex } from "./utils";

export class Slice {
  public readonly start: number | undefined;
  public readonly end: number | undefined;
  public readonly step: number | undefined;

  public static fromString(s: string): Slice {
    const slice = s.split(':')
      .map(x => x.trim())
      .map(x => (x === '') ? undefined : parseInt(x));

    // TODO check length and values

    return new Slice(...slice);
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

    const defaultEnd = (step < 0 && this.end === undefined) ? -1 : undefined;

    let start = this.start ?? (step > 0 ? 0 : containerLength - 1);
    let end = this.end ?? (step > 0 ? containerLength : -1);

    start = Math.round(start)
    end = Math.round(end)
    step = Math.round(step)

    start = normalizeIndex(start, containerLength, false);
    end = normalizeIndex(end, containerLength, false);

    if (start >= containerLength && end > containerLength) {
      start = end = containerLength - 1
    } else if (start <= 0 && end < 0) {
      start = end = 0;
    }

    start = this.squeezeInBounds(start, 0, containerLength - 1);
    end = this.squeezeInBounds(end, 0, containerLength);

    if ((step > 0 && end < start) || (step < 0 && end > start)) {
      end = start;
    }

    return new NormalizedSlice(start, defaultEnd ?? end, step);
  }

  public toString(): string {
    return `${this.start ?? ''}:${this.end ?? ''}:${this.step ?? ''}`;
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

  // TODO generator
}
