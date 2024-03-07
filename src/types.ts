import { ArrayCompressSelector, ArraySelector } from './selectors';

export interface ArrayView<T> {
  readonly loc: SliceableArray<T>;
  readonly length: number;

  toArray(): Array<T>;

  filter(predicate: (value: T) => boolean): ArrayView<T>;

  is(predicate: (value: T) => boolean): ArrayCompressSelector;

  subview(selector: ArraySelector<any>): ArrayView<T>;

  apply(mapper: (item: T, index: number) => T): void;

  set(newValues: Array<T> | ArrayView<T>): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export type SliceableArray<T> = Array<T> & {
  [index: string]: ArrayView<T>
}
