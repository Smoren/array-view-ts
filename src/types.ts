import { ArrayCompressSelector, ArraySelector } from './selectors';

export interface ArrayViewInterface<T> {
  readonly loc: SliceableArray<T>;
  readonly length: number;

  toArray(): Array<T>;

  filter(predicate: (value: T) => boolean): ArrayViewInterface<T>;

  is(predicate: (value: T) => boolean): ArrayCompressSelector;

  subview(selector: ArraySelector<unknown> | string): ArrayViewInterface<T>;

  apply(mapper: (item: T, index: number) => T): void;

  set(newValues: Array<T> | ArrayViewInterface<T>): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export interface SelectorInterface<T> {
  readonly value: T;

  select<U>(source: ArrayViewInterface<U>): ArrayViewInterface<U>;
}

export type SliceableArray<T> = Array<T> & {
  [index: string]: Array<T>
}
