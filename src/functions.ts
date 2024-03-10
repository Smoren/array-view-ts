import { ArrayView } from "./views";
import { Slice } from "./structs";
import { IndexListSelector, MaskSelector, SliceSelector } from "./selectors";
import { ArrayViewInterface } from "./types";

/**
 * Creates an ArrayView instance from the provided source array or ArrayView.
 *
 * This function allows you to create a view that provides a way to interact
 * with a subset of elements from the original array or ArrayView.
 *
 * @template T
 * @param {Array<T> | ArrayView<T>} source - The source array or ArrayView to create a view from.
 * @param {boolean} [readonly] - Optional flag to indicate whether the view should be readonly.
 * @returns {ArrayView<T>} The created ArrayView instance.
 *
 * @example
 * const originalArray = [1, 2, 3, 4, 5];
 * const arrayView = view(originalArray);
 * // Access and work with elements from the array using the created view (readonly)
 *
 * @example
 * const originalArrayView = [1, 2, 3, 4, 5];
 * const filteredView = view(originalArrayView, false);
 * // Modify the filtered view affecting the original array
 */
export function view<T>(source: Array<T> | ArrayViewInterface<T>, readonly?: boolean): ArrayView<T> {
  return ArrayView.toView(source, readonly);
}

/**
 * Creates a SliceSelector instance based on the provided slice string or Slice object.
 *
 * This function allows you to create a selector for defining a subset of elements based on a slice range.
 *
 * @param {string | Array<number | undefined> | Slice} slice - The slice string/array or Slice object to create the selector from.
 *
 * @returns {SliceSelector} The created SliceSelector instance.
 *
 * @example
 * const originalView = view([1, 2, 3, 4, 5]);
 * const sliceString = "1:4";
 * const sliceSelector = slice(sliceString);
 * const slicedView = view.subview(sliceSelector);
 * console.log(slicedView.toArray());
 * // [2, 3, 4]
 *
 * @example
 * const originalView = view([1, 2, 3, 4, 5]);
 * const sliceString = "1:4";
 * const sliceSelector = slice(sliceString);
 * const slicedArray = view.loc[sliceSelector.toString()];
 * console.log(slicedArray);
 * // [2, 3, 4] */
export function slice(slice: string | Array<number | undefined> | Slice): SliceSelector {
  return new SliceSelector(Slice.toSlice(slice));
}

/**
 * Creates a MaskSelector instance based on the provided boolean mask array or ArrayView.
 *
 * This function allows you to create a selector that masks elements based on a boolean mask array.
 *
 * @param {Array<boolean> | ArrayView<boolean>} mask - The boolean mask array or ArrayView to create the selector from.
 *
 * @returns {MaskSelector} The created MaskSelector instance.
 *
 * @example
 * const originalView = view([1, 2, 3, 4, 5]);
 * const booleanMask = [true, false, true, true, false];
 * const maskSelector = mask(booleanMask);
 * const filteredView = originalView.subview(maskSelector);
 * console.log(filteredView);
 * // [1, 3, 4]
 */
export function mask(mask: Array<boolean> | ArrayView<boolean>): MaskSelector {
  return new MaskSelector(mask);
}

/**
 * Creates an IndexListSelector instance based on the provided array of indexes or IndexList.
 *
 * This function allows you to create a selector for specifying a list of indexes to include in the selection.
 *
 * @param {Array<number> | ArrayView<number>} indexes - The array of indexes or IndexList to create the selector from.
 *
 * @returns {IndexListSelector} The created IndexListSelector instance.
 *
 * @example
 * const originalView = view([1, 2, 3, 4, 5]);
 * const selectedIndexes = [0, 2, 4];
 * const indexListSelector = select(selectedIndexes);
 * const filteredView = originalView.subview(indexListSelector);
 * console.log(filteredView);
 * // [1, 3, 5]
 */
export function select(indexes: Array<number> | ArrayView<number>): IndexListSelector {
  return new IndexListSelector(indexes);
}
