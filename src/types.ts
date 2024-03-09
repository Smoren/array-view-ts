export interface ArrayViewInterface<T> {
  readonly loc: SliceableArray<T>;
  readonly length: number;
  readonly readonly: boolean;

  toArray(): Array<T>;

  filter(predicate: (value: T) => boolean): ArrayViewInterface<T>;

  is(predicate: (value: T) => boolean): ArraySelectorInterface;

  subview(selector: ArraySelectorInterface | string, readonly?: boolean): ArrayViewInterface<T>;

  apply(mapper: (item: T, index: number) => T): void;

  applyWith<U>(data: Array<U> | ArrayViewInterface<U>, mapper: (lhs: T, rhs: U, index: number) => T): ArrayViewInterface<T>;

  set(newValues: Array<T> | ArrayViewInterface<T>): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export interface ArraySelectorInterface {
  select<T>(source: ArrayViewInterface<T>, readonly?: boolean): ArrayViewInterface<T>;
}

export type SliceableArray<T> = Array<T> & {
  [index: string]: Array<T>
}
