import { ArraySelector, ArrayCompressSelector, ArraySliceSelector } from "./selectors";
import { normalizeIndex } from "./utils";
import { KeyError, LengthError, ReadonlyError } from "./excpetions";
import { NormalizedSlice, Slice } from "./structs";
import type { ArrayView as IArrayView, SliceableArray } from "./types";

export class ArrayView<T> implements IArrayView<T> {
  public readonly loc: SliceableArray<T>;
  public readonly isReadonly: boolean;
  protected readonly source: Array<T>;
  protected readonly parentView?: ArrayView<T>;

  public static toView<T>(source: Array<T> | ArrayView<T>): ArrayView<T> {
    return source instanceof ArrayView
      ? source
      : new ArrayView(source);
  }

  constructor(
    source: Array<T>,
    {
      readonly = false,
      parentView = undefined,
    }: {
      readonly?: boolean,
      parentView?: ArrayView<T>,
    } = {},
  ) {
    this.source = source;
    this.parentView = parentView;
    this.isReadonly = readonly;

    this.loc = new Proxy<Array<T>>(source, {
      get: (target, prop) => {
        if (prop === "length") {
          return target.length;
        }

        if (typeof prop === "string" && Slice.isSliceString(prop)) {
          return this.subview(new ArraySliceSelector(prop)).toArray();
        }

        if (!Number.isInteger(Number(prop))) {
          throw new KeyError(`Invalid key: "${String(prop)}".`);
        }

        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        if (this.isReadonly) {
          throw new ReadonlyError('Cannot modify a readonly view.');
        }

        if (typeof prop === "string" && Slice.isSliceString(prop)) {
          this.subview(new ArraySliceSelector(prop)).set(value);
          return true;
        }

        if (!Number.isInteger(Number(prop))) {
          throw new KeyError(`Invalid key: "${String(prop)}".`);
        }

        target[this.convertIndex(Number(prop))] = value;
        return true;
      },
    }) as SliceableArray<T>;
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

  public subview(selector: ArraySelector<any> | string): ArrayView<T> {
    return (selector instanceof ArraySelector)
      ? selector.select(this)
      : (new ArraySliceSelector(selector).select(this));
  }

  public apply(mapper: (item: T, index: number) => T): void {
    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], i);
    }
  }

  public applyWith<U>(data: Array<U> | ArrayView<U>, mapper: (lhs: T, rhs: U, index: number) => T): void {
    if (data.length !== this.length) {
      throw new LengthError(`Length of values array not equal to view length (${data.length} != ${this.length}).`);
    }

    const dataView = ArrayView.toView(data);

    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], dataView.loc[i], i);
    }
  }

  public set(newValues: Array<T> | ArrayView<T>): void {
    if (newValues.length !== this.length) {
      throw new LengthError(`Length of values array not equal to view length (${newValues.length} != ${this.length}).`);
    }
    const newValuesView = ArrayView.toView(newValues);

    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = newValuesView.loc[i];
    }
  }

  * [Symbol.iterator](): IterableIterator<T> {
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

  constructor(
    source: Array<T>,
    {
      indexes,
      readonly = false,
      parentView = undefined,
    }: {
      indexes: number[],
      readonly?: boolean,
      parentView?: ArrayView<T>,
    },
  ) {
    super(source, { readonly, parentView });
    this.indexes = indexes;
  }

  public toArray(): Array<T> {
    return this.indexes.map((_, i) => this.loc[i]);
  }

  public get length(): number {
    return this.indexes.length;
  }

  * [Symbol.iterator](): IterableIterator<T> {
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

  constructor(
    source: Array<T>,
    {
      mask,
      readonly = false,
      parentView = undefined,
    }: {
      mask: boolean[],
      readonly?: boolean,
      parentView?: ArrayView<T>,
    },
  ) {
    const length = parentView?.length ?? source.length;
    if (length !== mask.length) {
      throw new LengthError(`Mask length not equal to source length (${mask.length} != ${length}).`);
    }

    const indexes = mask
      .map((v, i) => v ? i : null)
      .filter(v => v !== null) as number[];

    super(source, { indexes, readonly, parentView });
    this.mask = mask;
  }
}

export class ArraySliceView<T> extends ArrayView<T> {
  public readonly slice: NormalizedSlice;

  constructor(
    source: Array<T>,
    {
      slice,
      readonly = false,
      parentView = undefined,
    }: {
      slice: Slice,
      readonly?: boolean,
      parentView?: ArrayView<T>,
    },
  ) {
    super(source, { readonly, parentView });
    this.slice = slice.normalize(this.parentLength);
  }

  get length(): number {
    return this.slice.length;
  }

  * [Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  protected convertIndex(i: number): number {
    return this.slice.convertIndex(i);
  }
}
