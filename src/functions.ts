import { ArrayView } from "./views";
import { Slice } from "./structs";
import { ArrayIndexListSelector, ArrayMaskSelector, ArraySliceSelector } from "./selectors";

export function view<T>(source: Array<T> | ArrayView<T>): ArrayView<T> {
  return ArrayView.toView(source);
}

export function slice(slice: string | Slice): ArraySliceSelector {
  return new ArraySliceSelector(Slice.toSlice(slice));
}

export function mask(mask: Array<boolean> | ArrayView<boolean>): ArrayMaskSelector {
  return new ArrayMaskSelector(mask);
}

export function select(indexes: Array<number> | ArrayView<number>): ArrayIndexListSelector {
  return new ArrayIndexListSelector(indexes);
}
