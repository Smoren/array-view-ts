import { ArrayCompressSelector, ArraySelector } from './selectors';

export interface ArrayView<T> {
  readonly loc: SliceableArray<T>;
  readonly length: number;

  toArray(): Array<T>;

  filter(predicate: (value: T) => boolean): ArrayView<T>;

  is(predicate: (value: T) => boolean): ArrayCompressSelector;

  subview(selector: ArraySelector<any> | string): ArrayView<T>;

  apply(mapper: (item: T, index: number) => T): void;

  set(newValues: Array<T> | ArrayView<T>): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export interface Selector<T> {
  readonly value: T;

  select<U>(source: ArrayView<U>): ArrayView<U>;
}

export type SliceableArray<T> = Array<T> & {
  [index: string]: Array<T>
}
