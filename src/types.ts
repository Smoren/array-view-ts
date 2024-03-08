export interface ArrayViewInterface<T> {
  readonly loc: SliceableArray<T>;
  readonly length: number;
  readonly isReadonly: boolean;

  toArray(): Array<T>;

  filter(predicate: (value: T) => boolean): ArrayViewInterface<T>;

  is(predicate: (value: T) => boolean): SelectorInterface;

  subview(selector: SelectorInterface | string): ArrayViewInterface<T>;

  apply(mapper: (item: T, index: number) => T): void;

  applyWith<U>(data: Array<U> | ArrayViewInterface<U>, mapper: (lhs: T, rhs: U, index: number) => T): ArrayViewInterface<T>;

  set(newValues: Array<T> | ArrayViewInterface<T>): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export interface SelectorInterface {
  select<T>(source: ArrayViewInterface<T>): ArrayViewInterface<T>;
}

export type SliceableArray<T> = Array<T> & {
  [index: string]: Array<T>
}
