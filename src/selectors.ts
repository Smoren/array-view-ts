import { ArrayCompressView, ArrayIndexListView, ArraySliceView, ArrayView } from "./views";
import { Slice } from "./structs";
import { ArraySelectorInterface } from "./types";

export abstract class ArraySelector<T> implements ArraySelectorInterface {
  public readonly value: T;

  public abstract select<U>(source: ArrayView<U>): ArrayView<U>;

  protected constructor(value: T) {
    this.value = value;
  }
}

export class IndexListSelector extends ArraySelector<Array<number>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayIndexListView<T>(source, { indexes: this.value, readonly: source.readonly });
  }

  constructor(value: Array<number> | ArrayView<number>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class MaskSelector extends ArraySelector<Array<boolean>> {
  public select<T>(source: ArrayView<T>): ArrayCompressView<T> {
    return new ArrayCompressView<T>(source, { mask: this.value, readonly: source.readonly });
  }

  constructor(value: Array<boolean> | ArrayView<boolean>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class SliceSelector extends Slice implements ArraySelectorInterface {
  constructor(slice: Slice | string) {
    const s = Slice.toSlice(slice);
    super(s.start, s.end, s.step);
  }

  public select<T>(source: ArrayView<T>): ArraySliceView<T> {
    return new ArraySliceView<T>(source, { slice: this, readonly: source.readonly });
  }
}
