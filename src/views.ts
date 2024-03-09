import { MaskSelector, SliceSelector } from "./selectors";
import { normalizeIndex } from "./utils";
import { KeyError, LengthError, ReadonlyError } from "./excpetions";
import { NormalizedSlice, Slice } from "./structs";
import type { ArrayViewInterface, ArraySelectorInterface, SliceableArray } from "./types";

export class ArrayView<T> implements ArrayViewInterface<T> {
  public readonly loc: SliceableArray<T>;
  public readonly readonly: boolean;
  protected readonly source: Array<T>;
  protected readonly parentView?: ArrayView<T>;

  public static toView<T>(source: Array<T> | ArrayView<T>, readonly?: boolean): ArrayView<T> {
    if (!(source instanceof ArrayView)) {
      return new ArrayView(source, { readonly });
    }

    if (!source.readonly && readonly) {
      return new ArrayView(source, { readonly });
    }

    return source;
  }

  constructor(
    source: Array<T> | ArrayView<T>,
    { readonly }: { readonly?: boolean } = {},
  ) {
    const loc = (source instanceof ArrayView) ? source.loc : source;
    this.source = (source instanceof ArrayView) ? source.source : source;
    this.parentView = (source instanceof ArrayView) ? source : undefined;
    this.readonly = readonly ?? ((source instanceof ArrayView) ? (source as ArrayView<T>).readonly : false);

    if ((source instanceof ArrayView) && source.readonly && !this.readonly) {
      throw new ReadonlyError("Cannot create non-readonly view for readonly source.");
    }

    this.loc = new Proxy<Array<T>>(loc, {
      get: (target, prop) => {
        if (prop === "length") {
          return target.length;
        }

        if (typeof (prop as unknown) === "symbol") {
          throw new KeyError(`Invalid key: "${String(prop)}".`);
        }

        if (typeof prop === "string" && Slice.isSlice(prop)) {
          return this.subview(new SliceSelector(prop)).toArray();
        }

        if (prop === '' || !Number.isInteger(Number(prop))) {
          throw new KeyError(`Invalid key: "${String(prop)}".`);
        }

        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        if (this.readonly) {
          throw new ReadonlyError('Cannot modify a readonly view.');
        }

        if (typeof (prop as unknown) === "symbol") {
          throw new KeyError(`Invalid key: "${String(prop)}".`);
        }

        if (typeof prop === "string" && Slice.isSlice(prop)) {
          this.subview(new SliceSelector(prop)).set(value);
          return true;
        }

        if (prop === '' || !Number.isInteger(Number(prop))) {
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

  public filter(predicate: (value: T) => boolean): ArrayMaskView<T> {
    return this.is(predicate).select(this);
  }

  public is(predicate: (value: T) => boolean): MaskSelector {
    return new MaskSelector(this.toArray().map(predicate));
  }

  public subview(selector: ArraySelectorInterface | string, readonly?: boolean): ArrayViewInterface<T> {
    return (typeof selector === 'string')
      ? (new SliceSelector(selector).select(this, readonly))
      : selector.select(this, readonly);
  }

  public apply(mapper: (item: T, index: number) => T): ArrayView<T> {
    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], i);
    }
    return this;
  }

  public applyWith<U>(data: Array<U> | ArrayView<U>, mapper: (lhs: T, rhs: U, index: number) => T): ArrayView<T> {
    if (data.length !== this.length) {
      throw new LengthError(`Length of values array not equal to view length (${data.length} != ${this.length}).`);
    }

    const dataView = ArrayView.toView(data);

    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], dataView.loc[i], i);
    }

    return this;
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
    source: Array<T> | ArrayView<T>,
    {
      indexes,
      readonly,
    }: {
      indexes: number[],
      readonly?: boolean,
    },
  ) {
    super(source, { readonly });
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

export class ArrayMaskView<T> extends ArrayIndexListView<T> {
  public readonly mask: boolean[];

  constructor(
    source: Array<T> | ArrayView<T>,
    {
      mask,
      readonly,
    }: {
      mask: boolean[],
      readonly?: boolean,
    },
  ) {
    const length = source.length;
    if (length !== mask.length) {
      throw new LengthError(`Mask length not equal to source length (${mask.length} != ${length}).`);
    }

    const indexes = mask
      .map((v, i) => v ? i : null)
      .filter(v => v !== null) as number[];

    super(source, { indexes, readonly });
    this.mask = mask;
  }
}

export class ArraySliceView<T> extends ArrayView<T> {
  public readonly slice: NormalizedSlice;

  constructor(
    source: Array<T> | ArrayView<T>,
    {
      slice,
      readonly,
    }: {
      slice: Slice,
      readonly?: boolean,
    },
  ) {
    super(source, { readonly });
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
