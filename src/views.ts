import { ArraySelector, ArrayCompressSelector } from "./selectors";
import { normalizeIndex } from './utils';
import { KeyError } from './excpetions';

export class ArrayView<T> {
  public readonly loc: Array<T>;
  protected readonly source: Array<T>;
  protected readonly parentView?: ArrayView<T>;

  constructor(source: Array<T>, parentView?: ArrayView<T>) {
    this.loc = new Proxy<Array<T>>(source, {
      get: (target, prop) => {
        if (prop === 'length') {
          return target.length;
        }

        if (!Number.isInteger(Number(prop))) {
          throw new KeyError(`Invalid key`);
        }

        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        if (!Number.isInteger(Number(prop))) {
          throw new KeyError(`Invalid key`);
        }

        target[this.convertIndex(Number(prop))] = value;
        return true;
      },
    });
    this.source = source;
    this.parentView = parentView;
  }

  public get length(): number {
    return this.parentLength;
  }

  public toArray(): Array<T> {
    return [...this];
  }

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

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  protected get parentLength(): number {
    return this.parentView?.length ?? this.loc.length;
  }

  protected convertIndex(i: number): number {
    return normalizeIndex(i, this.source.length);
  }
}

export class ArrayIndexListView<T> extends ArrayView<T> {
  public readonly indexes: number[];

  constructor(source: Array<T>, indexes: number[], parentView?: ArrayView<T>) {
    super(source, parentView);
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
    return normalizeIndex(this.indexes[normalizeIndex(i, this.indexes.length)], this.parentLength);
  }
}

export class ArrayCompressView<T> extends ArrayIndexListView<T> {
  public readonly mask: boolean[];

  constructor(source: Array<T>, mask: boolean[], parentView?: ArrayView<T>) {
    if (source.length !== mask.length) {
      throw new Error("Invalid mask length");
    }

    const indexes = mask
      .map((v, i) => v ? i : null)
      .filter(v => v !== null) as number[];

    super(source, indexes, parentView);
    this.mask = mask;
  }
}

export class ArraySliceView<T> extends ArrayView<T> {
  public readonly _start: number;
  public readonly _end: number;
  public readonly step: number;

  constructor(source: Array<T>, start: number, end: number, step: number, parentView?: ArrayView<T>) {
    super(source, parentView);
    this.step = step;
    this._start = start;
    this._end = end;
  }

  get length(): number {
    return Math.ceil((this.end - this.start) / this.step);
  }

  get start(): number {
    return normalizeIndex(this._start, this.parentLength);
  }

  get end(): number {
    return normalizeIndex(this._end, this.parentLength+1);
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  protected convertIndex(i: number): number {
    return normalizeIndex(this.start + normalizeIndex(i, this.length) * this.step, this.parentLength);
  }
}
