import { ArrayCompressView, ArrayIndexListView, ArrayView } from "./views";

export abstract class ArrayViewSelector<T> {
  public readonly value: T;

  public abstract select<U>(source: ArrayView<U>): ArrayView<U>;

  protected constructor(value: T) {
    this.value = value;
  }
}

export class IndexListSelector extends ArrayViewSelector<Array<number>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayIndexListView<T>(source.loc, this.value);
  }

  constructor(value: Array<number> | ArrayView<number>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class CompressSelector extends ArrayViewSelector<Array<boolean>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayCompressView<T>(source.loc, this.value);
  }

  constructor(value: Array<boolean> | ArrayView<boolean>) {
    super(value instanceof Array ? value : value.toArray());
  }
}
