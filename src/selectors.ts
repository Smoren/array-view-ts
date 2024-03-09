import { ArrayMaskView, ArrayIndexListView, ArraySliceView, ArrayView } from "./views";
import { Slice } from "./structs";
import { ArraySelectorInterface } from "./types";

export class IndexListSelector implements ArraySelectorInterface {
  public readonly value: Array<number>;

  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayIndexListView<T>(source, { indexes: this.value, readonly: source.readonly });
  }

  constructor(value: Array<number> | ArrayView<number>) {
    this.value = value instanceof Array ? value : value.toArray();
  }
}

export class MaskSelector implements ArraySelectorInterface {
  public readonly value: Array<boolean>;

  public select<T>(source: ArrayView<T>): ArrayMaskView<T> {
    return new ArrayMaskView<T>(source, { mask: this.value, readonly: source.readonly });
  }

  constructor(value: Array<boolean> | ArrayView<boolean>) {
    this.value = value instanceof Array ? value : value.toArray();
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
