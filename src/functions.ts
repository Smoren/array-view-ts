import { ArrayView } from "./views";
import { Slice } from "./structs";
import { IndexListSelector, MaskSelector, SliceSelector } from "./selectors";

export function view<T>(source: Array<T> | ArrayView<T>): ArrayView<T> {
  return ArrayView.toView(source);
}

export function slice(slice: string | Slice): SliceSelector {
  return new SliceSelector(Slice.toSlice(slice));
}

export function mask(mask: Array<boolean> | ArrayView<boolean>): MaskSelector {
  return new MaskSelector(mask);
}

export function select(indexes: Array<number> | ArrayView<number>): IndexListSelector {
  return new IndexListSelector(indexes);
}
