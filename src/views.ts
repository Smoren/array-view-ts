import { ArraySelector, ArrayCompressSelector } from "./selectors";
import { normalizeIndex } from './utils';

export abstract class ArrayView<T> {
  public readonly loc: Array<T>;
  public abstract readonly length: number;
  protected readonly source: Array<T>;

  protected constructor(source: Array<T>, handler: ProxyHandler<Array<T>>) {
    this.loc = new Proxy(source, handler);
    this.source = source;
  }

  public abstract toArray(): Array<T>;

  abstract [Symbol.iterator](): IterableIterator<T>;

  public filter(predicate: (value: T) => boolean): ArrayCompressView<T> {
    return this.is(predicate).select(this);
  }

  public is(predicate: (value: T) => boolean): ArrayCompressSelector {
    return new ArrayCompressSelector(this.toArray().map(predicate));
  }

  public set(value: Array<T>): void {
    throw new Error("Method not implemented.");
  }

  public subview(selector: ArraySelector<any>): ArrayView<T> {
    return selector.select(this);
  }

  protected abstract convertIndex(index: number): number;
}

export class ArrayFullView<T> extends ArrayView<T> {
  constructor(source: Array<T>) {
    super(source, {});
  }

  public get length(): number {
    return this.loc.length;
  }

  public toArray(): Array<T> {
    return [...this];
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield *this.loc;
  }

  protected convertIndex(i: number): number {
    return normalizeIndex(i, this.source.length);
  }
}

export class ArrayIndexListView<T> extends ArrayView<T> {
  public readonly indexes: number[];

  constructor(source: Array<T>, indexes: number[]) {
    super(source, {
      get: (target, prop): T => {
        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        target[this.convertIndex(Number(prop))] = value;
        return true;
      },
    });
    this.indexes = indexes;
  }

  public toArray(): Array<T> {
    return this.indexes.map((_, i) => this.loc[i]);
  }

  public get length(): number {
    return this.indexes.length;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  protected convertIndex(i: number): number {
    return normalizeIndex(this.indexes[normalizeIndex(i, this.indexes.length)], this.source.length);
  }
}

export class ArrayCompressView<T> extends ArrayIndexListView<T> {
  public readonly mask: boolean[];

  constructor(source: Array<T>, mask: boolean[]) {
    if (source.length !== mask.length) {
      throw new Error("Invalid mask length");
    }

    const indexes = mask
      .map((v, i) => v ? i : null)
      .filter(v => v !== null) as number[];

    super(source, indexes);
    this.mask = mask;
  }
}

export class ArraySliceView<T> extends ArrayView<T> {
  public readonly start: number;
  public readonly end: number;
  public readonly step: number;

  constructor(source: Array<T>, start: number, end: number, step: number) {
    super(source, {
      get: (target, prop): T => {
        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        target[this.convertIndex(Number(prop))] = value;
        return true;
      },
    });
    this.start = start;
    this.end = end;
    this.step = step;
  }

  get length(): number {
    return Math.floor((this.end - this.start) / this.step);
  }

  public toArray(): T[] {
    return [...this]
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  protected convertIndex(i: number): number {
    return normalizeIndex(this.start + normalizeIndex(i, this.source.length) * this.step, this.length);
  }
}
