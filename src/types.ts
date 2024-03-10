/**
 * Interface for a view of an array with additional methods
 * for filtering, mapping, and transforming the data.
 *
 * @template T The type of elements in the array
 */
export interface ArrayViewInterface<T> {
  /**
   * Proxy for getting and setting values to source array by indexes and slices.
   *
   * @example
   * ```
   * console.log(view.loc[0]);
   * console.log(view.loc[':']);
   * console.log(view.loc['10::-1']);
   * view.loc[0] = 1;
   * view.loc[':'] = [1, 2, 3];
   * view.loc['10::-1'] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
   * ```
   */
  readonly loc: SliceableArray<T>;
  /**
   * The length of the view.
   */
  readonly length: number;
  /**
   * Flag indicating if the view is read-only.
   */
  readonly readonly: boolean;
  /**
   * Base source array.
   */
  readonly source: Array<T>;

  /**
   * Returns the array representation of the view.
   *
   * @returns {Array<T>} The array representation of the view.
   */
  toArray(): Array<T>;

  /**
   * Filters the elements in the view based on a predicate function.
   *
   * @param {function(value: T): boolean} predicate - Function that returns a boolean value for each element.
   *
   * @returns {ArrayViewInterface<T>} A new view with elements that satisfy the predicate.
   */
  filter(predicate: (value: T) => boolean): ArrayViewInterface<T>;

  /**
   * Checks if all elements in the view satisfy a given predicate function.
   *
   * @param {function(value: T): boolean} predicate - Function that returns a boolean value for each element.
   *
   * @returns {ArraySelectorInterface} Boolean mask for selecting elements that satisfy the predicate.
   */
  is(predicate: (value: T) => boolean): ArraySelectorInterface;

  /**
   * Returns a subview of this view based on a selector or string slice.
   *
   * @param {ArraySelectorInterface | string} selector - The selector or string to filter the subview.
   * @param {boolean} [readonly] - Flag indicating if the subview should be read-only.
   *
   * @returns {ArrayViewInterface<T>} A new view representing the subview of this view.
   */
  subview(selector: ArraySelectorInterface | string, readonly?: boolean): ArrayViewInterface<T>;

  /**
   * Applies a transformation function to each element in the view.
   *
   * @param {function(item: T, index: number): T} mapper - Function to transform each element.
   *
   * @returns {ArrayViewInterface<T>} this view.
   */
  apply(mapper: (item: T, index: number) => T): ArrayViewInterface<T>;

  /**
   * Applies a transformation function using another array or view as rhs values for a binary operation.
   *
   * @template U The type rhs of a binary operation.
   *
   * @param {Array<U> | ArrayViewInterface<U>} data - The rhs values for a binary operation.
   * @param {function(lhs: T, rhs: U, index: number): T} mapper - Function to transform each pair of elements.
   *
   * @returns {ArrayViewInterface<T>} this view.
   */
  applyWith<U>(data: Array<U> | ArrayViewInterface<U>, mapper: (lhs: T, rhs: U, index: number) => T): ArrayViewInterface<T>;

  /**
   * Sets new values for the elements in the view.
   *
   * @param {Array<T> | ArrayViewInterface<T> | T} newValue - The new values to set.
   *
   * @returns {ArrayViewInterface<T>} this view.
   */
  set(newValue: Array<T> | ArrayViewInterface<T> | T): ArrayViewInterface<T>;

  /**
   * Returns an iterator for the elements in the view.
   *
   * @returns {IterableIterator<T>} An iterator for the elements in the view.
   */
  [Symbol.iterator](): IterableIterator<T>;
}

/**
 * Interface for selecting elements from an array view.
 */
export interface ArraySelectorInterface {
  /**
   * Selects elements from a source array view based on the selector criteria.
   *
   * @template T - The type of elements in the source array view.
   *
   * @param {ArrayViewInterface<T>} source - The source array view to select elements from.
   * @param {boolean} [readonly] - Flag indicating if the result view should be read-only.
   *
   * @returns {ArrayViewInterface<T>} A new view with selected elements from the source.
   */
  select<T>(source: ArrayViewInterface<T>, readonly?: boolean): ArrayViewInterface<T>;
}

/**
 * Type representing an array that can be sliced.
 *
 * @template T - The type of elements in the array.
 */
export type SliceableArray<T> = Array<T> & {
  [index: string]: Array<T>;
}
