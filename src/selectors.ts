import { ArrayCompressView, ArrayIndexListView, ArraySliceView, ArrayView } from "./views";
import { Slice } from "./structs";
import { SelectorInterface } from "./types";

export abstract class ArraySelector<T> implements SelectorInterface<T> {
  public readonly value: T;

  public abstract select<U>(source: ArrayView<U>): ArrayView<U>;

  protected constructor(value: T) {
    this.value = value;
  }
}

export class ArrayIndexListSelector extends ArraySelector<Array<number>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayIndexListView<T>(source, { indexes: this.value });
  }

  constructor(value: Array<number> | ArrayView<number>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class ArrayCompressSelector extends ArraySelector<Array<boolean>> {
  public select<T>(source: ArrayView<T>): ArrayCompressView<T> {
    return new ArrayCompressView<T>(source, { mask: this.value });
  }

  constructor(value: Array<boolean> | ArrayView<boolean>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class ArraySliceSelector extends ArraySelector<Slice> {
  constructor(slice: Slice | string) {
    super(slice instanceof Slice ? slice : Slice.toSlice(slice));
  }

  public select<T>(source: ArrayView<T>): ArraySliceView<T> {
    return new ArraySliceView<T>(source, { slice: this.value });
  }
}
