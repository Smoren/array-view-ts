import { MaskSelector, SliceSelector } from "./selectors";
import { isCountable, normalizeIndex } from "./utils";
import { KeyError, LengthError, ReadonlyError } from "./excpetions";
import { NormalizedSlice, Slice } from "./structs";
import type { ArrayViewInterface, ArraySelectorInterface, SliceableArray } from "./types";

/**
 * Class representing a view of an array or another array view
 * with additional methods for filtering, mapping, and transforming the data.
 *
 * @template T
 *
 * @implements ArrayViewInterface<T>
 */
export class ArrayView<T> implements ArrayViewInterface<T> {
  /** @inheritDoc */
  public readonly loc: SliceableArray<T>;
  /** @inheritDoc */
  public readonly readonly: boolean;
  /**
   * Source array of the view.
   * @protected
   */
  public readonly source: Array<T>;
  /**
   * Parent view (exists if source is another array view).
   * @protected
   */
  protected readonly parentView?: ArrayViewInterface<T>;

  /**
   * Creates an ArrayView instance from the given source array or ArrayView.
   *
   * If the source is not an ArrayView, a new ArrayView is created with the provided source.
   * If the source is an ArrayView and the `readonly` parameter is specified as `true`, a new readonly ArrayView is created.
   * If the source is an ArrayView and it is already readonly, the same ArrayView is returned.
   *
   * @template T
   *
   * @param {Array<T> | ArrayViewInterface<T>} source - The source array or ArrayView to create a view from.
   * @param {boolean} [readonly] - Optional flag to indicate whether the view should be readonly.
   *
   * @returns {ArrayView<T>} An ArrayView instance based on the source array or ArrayView.
   */
  public static toView<T>(source: Array<T> | ArrayViewInterface<T>, readonly?: boolean): ArrayView<T> {
    if (!(source instanceof ArrayView)) {
      return new ArrayView(source, { readonly });
    }

    if (!source.readonly && readonly) {
      return new ArrayView(source, { readonly });
    }

    return source;
  }

  /**
   * Constructs a new ArrayView instance based on the provided source array or ArrayView.
   *
   * @param {Array<T> | ArrayViewInterface<T>} source - The source array or ArrayView to create a view from.
   * @param {object} options - Options for configuring the view.
   * @param {boolean} [options.readonly=false] - Optional flag to indicate whether the view should be readonly.
   *
   * @constructor
   */
  constructor(
    source: Array<T> | ArrayViewInterface<T>,
    { readonly }: { readonly?: boolean } = {},
  ) {
    const loc = Array.isArray(source) ? source : source.loc;
    this.source = Array.isArray(source) ? source : source.source;
    this.parentView = Array.isArray(source) ? undefined : source;
    this.readonly = readonly ?? (Array.isArray(source) ? false : (source as ArrayViewInterface<T>).readonly);

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

  /** @inheritDoc */
  public get length(): number {
    return this.parentLength;
  }

  /** @inheritDoc */
  public toArray(): Array<T> {
    return [...this];
  }

  /** @inheritDoc */
  public filter(predicate: (value: T) => boolean): ArrayMaskView<T> {
    return this.is(predicate).select(this);
  }

  /** @inheritDoc */
  public is(predicate: (value: T) => boolean): MaskSelector {
    return new MaskSelector(this.toArray().map(predicate));
  }

  /** @inheritDoc */
  public subview(selector: ArraySelectorInterface | string, readonly?: boolean): ArrayViewInterface<T> {
    return (typeof selector === 'string')
      ? (new SliceSelector(selector).select(this, readonly))
      : selector.select(this, readonly);
  }

  /** @inheritDoc */
  public apply(mapper: (item: T, index: number) => T): ArrayView<T> {
    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], i);
    }
    return this;
  }

  /** @inheritDoc */
  public applyWith<U>(
    data: Array<U> | ArrayViewInterface<U>,
    mapper: (lhs: T, rhs: U, index: number) => T,
  ): ArrayView<T> {
    if (data.length !== this.length) {
      throw new LengthError(`Length of values array not equal to view length (${data.length} != ${this.length}).`);
    }

    const dataView = ArrayView.toView(data);

    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = mapper(this.loc[i], dataView.loc[i], i);
    }

    return this;
  }

  /** @inheritDoc */
  public set(newValue: Array<T> | ArrayViewInterface<T> | T): ArrayView<T> {
    if (!isCountable(newValue)) {
      for (let i = 0; i < this.length; ++i) {
        this.loc[i] = newValue as T;
      }
      return this;
    }

    const newValues = newValue as Array<T> | ArrayViewInterface<T>;

    if (newValues.length !== this.length) {
      throw new LengthError(`Length of values array not equal to view length (${newValues.length} != ${this.length}).`);
    }
    const newValuesView = ArrayView.toView(newValues);

    for (let i = 0; i < this.length; ++i) {
      this.loc[i] = newValuesView.loc[i];
    }

    return this;
  }

  /** @inheritDoc */
  * [Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  /**
   * Gets the length of the parent view if it exists, otherwise returns the length of the current view's source array.
   *
   * @returns {number} The length of the parent view or the source array length.
   *
   * @protected
   */
  protected get parentLength(): number {
    return this.parentView?.length ?? this.loc.length;
  }

  /**
   * Returns normalized representation of the given index.
   *
   * @param {number} i - Index to normalize.
   *
   * @returns {number} Normalized index.
   *
   * @see normalizeIndex()
   *
   * @protected
   */
  protected convertIndex(i: number): number {
    return normalizeIndex(i, this.length);
  }
}

/**
 * Class representing an index-based view of an array or another ArrayView for accessing elements at specific indexes.
 *
 * Each element in the view is based on the specified indexes.
 *
 * @template T
 *
 * @extends {ArrayView<T>}
 */
export class ArrayIndexListView<T> extends ArrayView<T> {
  /**
   * The indexes array specifying the indexes of elements in the source array to include in the view.
   */
  public readonly indexes: number[];

  /**
   * Constructs a new ArrayIndexListView instance with the specified source array or ArrayView and indexes array.
   *
   * @param {Array<T> | ArrayViewInterface<T>} source - The source array or ArrayView to create a view from.
   * @param {object} options - Options for configuring the view.
   * @param {number[]} options.indexes - The indexes array specifying the indexes of elements in the source array.
   * @param {boolean} [options.readonly] - Optional flag to indicate whether the view should be readonly.
   *
   * @constructor
   */
  constructor(
    source: Array<T> | ArrayViewInterface<T>,
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

  /** @inheritDoc */
  public toArray(): Array<T> {
    return this.indexes.map((_, i) => this.loc[i]);
  }

  /** @inheritDoc */
  public get length(): number {
    return this.indexes.length;
  }

  /** @inheritDoc */
  * [Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  /** @inheritDoc */
  protected convertIndex(i: number): number {
    return normalizeIndex(this.indexes[normalizeIndex(i, this.indexes.length)], this.parentLength);
  }
}

/**
 * Class representing a mask-based view of an array or another ArrayView for accessing elements based on a boolean mask.
 *
 * Each element in the view is included or excluded based on the specified boolean mask.
 *
 * @template T
 */
export class ArrayMaskView<T> extends ArrayIndexListView<T> {
  /**
   * The boolean mask specifying whether each element in the source array
   * should be included in the view (true) or excluded (false).
   */
  public readonly mask: boolean[];

  /**
   * Constructs a new ArrayMaskView instance with the specified source array or ArrayView and boolean mask.
   *
   * @param {Array<T> | ArrayViewInterface<T>} source - The source array or ArrayView to create a view from.
   * @param {object} options - Options for configuring the view.
   * @param {boolean[]} options.mask - The boolean mask for including or excluding elements from the source array.
   * @param {boolean} [options.readonly] - Optional flag to indicate whether the view should be readonly.
   *
   * @constructor
   */
  constructor(
    source: Array<T> | ArrayViewInterface<T>,
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

/**
 * Class representing a slice-based view of an array or another ArrayView
 * for accessing elements within a specified slice range.
 *
 * @template T
 */
export class ArraySliceView<T> extends ArrayView<T> {
  /**
   * The normalized slice range defining the view within the source array or ArrayView.
   */
  public readonly slice: NormalizedSlice;

  /**
   * Constructs a new ArraySliceView instance with the specified source array or ArrayView and slice range.
   *
   * @param {Array<T> | ArrayViewInterface<T>} source - The source array or ArrayView to create a view from.
   * @param {object} options - Options for configuring the view.
   * @param {Slice} options.slice - The slice range specifying the subset of elements to include in the view.
   * @param {boolean} [options.readonly] - Optional flag to indicate whether the view should be readonly.
   *
   * @constructor
   */
  constructor(
    source: Array<T> | ArrayViewInterface<T>,
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

  /** @inheritDoc */
  get length(): number {
    return this.slice.length;
  }

  /** @inheritDoc */
  * [Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  /** @inheritDoc */
  protected convertIndex(i: number): number {
    return this.slice.convertIndex(i);
  }
}
