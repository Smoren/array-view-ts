import { ArrayMaskView, ArrayIndexListView, ArraySliceView } from "./views";
import { Slice } from "./structs";
import {
  ArrayViewInterface,
  IndexListSelectorInterface,
  MaskSelectorInterface,
  SliceSelectorInterface,
} from "./types";
import { IndexError } from "./excpetions";

/**
 * Represents an index list selector that selects elements based on the provided array of indexes.
 *
 * @implements {IndexListSelectorInterface}
 */
export class IndexListSelector implements IndexListSelectorInterface {
  /**
   * The array of indexes to select elements from.
   */
  public readonly value: Array<number>;

  /**
   * Creates a new IndexListSelector instance with the provided array of indexes.
   *
   * @param {Array<number> | ArrayViewInterface<number>} value - The array of indexes or array view containing indexes.
   */
  constructor(value: Array<number> | ArrayViewInterface<number>) {
    this.value = value instanceof Array ? value : value.toArray();
  }

  /**
   * Selects elements from the source array based on the index list.
   *
   * @template T - The type of elements in the source array view.
   *
   * @param {ArrayViewInterface<T>} source - The source array view to select elements from.
   * @param {boolean} [readonly] - Whether the selection should be read-only.
   *
   * @returns {ArrayIndexListView<T>} The view containing the selected elements.
   */
  public select<T>(source: ArrayViewInterface<T>, readonly?: boolean): ArrayIndexListView<T> {
    if (!this.compatibleWith(source)) {
      throw new IndexError('Some indexes are out of range.');
    }
    return new ArrayIndexListView<T>(source, { indexes: this.value, readonly: readonly ?? source.readonly });
  }

  /**
   * TODO
   */
  public compatibleWith<T>(view: ArrayViewInterface<T>): boolean {
    return this.value.length === 0 ||
      Math.max(...this.value) < view.length && Math.min(...this.value) >= -view.length;
  }
}

/**
 * Represents a mask selector that selects elements based on the provided array of boolean mask values.
 *
 * @implements {MaskSelectorInterface}
 */
export class MaskSelector implements MaskSelectorInterface {
  /**
   * The array of boolean mask values to select elements based on.
   */
  public readonly value: Array<boolean>;

  /**
   * Creates a new MaskSelector instance with the provided array of boolean mask values.
   *
   * @param {Array<boolean> | ArrayViewInterface<boolean>} value - The array or array view of boolean mask values.
   */
  constructor(value: Array<boolean> | ArrayViewInterface<boolean>) {
    this.value = value instanceof Array ? value : value.toArray();
  }

  /**
   * Selects elements from the source array based on the mask values.
   *
   * @template T - The type of elements in the source array view.
   *
   * @param {ArrayViewInterface<T>} source - The source array to select elements from.
   * @param {boolean} [readonly] - Whether the selection should be read-only.
   *
   * @returns {ArrayMaskView<T>} The view containing the selected elements.
   */
  public select<T>(source: ArrayViewInterface<T>, readonly?: boolean): ArrayMaskView<T> {
    return new ArrayMaskView<T>(source, { mask: this.value, readonly: readonly ?? source.readonly });
  }

  /**
   * TODO
   */
  public compatibleWith<T>(view: ArrayViewInterface<T>): boolean {
    return this.value.length === view.length;
  }
}

/**
 * Represents a slice selector that selects elements based on the provided slice parameters.
 *
 * @extends Slice
 *
 * @implements {ArraySelectorInterface}
 */
export class SliceSelector extends Slice implements SliceSelectorInterface {
  /**
   * Creates a new SliceSelector instance with the provided slice parameters.
   *
   * @param {Slice | string} slice - The slice instance or slice string defining the selection.
   */
  constructor(slice: Slice | string) {
    const s = Slice.toSlice(slice);
    super(s.start, s.end, s.step);
  }

  /**
   * Selects elements from the source array based on the slice parameters.
   *
   * @template T - The type of elements in the source array.
   *
   * @param {ArrayViewInterface<T>} source - The source array to select elements from.
   * @param {boolean} [readonly] - Whether the selection should be read-only.
   *
   * @returns {ArraySliceView<T>} The view containing the selected elements.
   */
  public select<T>(source: ArrayViewInterface<T>, readonly?: boolean): ArraySliceView<T> {
    return new ArraySliceView<T>(source, { slice: this, readonly: readonly ?? source.readonly });
  }

  /**
   * TODO
   */
  public compatibleWith(): boolean {
    return true;
  }
}
