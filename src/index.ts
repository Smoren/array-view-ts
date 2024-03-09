import { mask, select, slice, view } from "./functions";
import { ArrayView, ArrayIndexListView, ArrayMaskView, ArraySliceView } from "./views";
import { IndexListSelector, MaskSelector, SliceSelector } from "./selectors";
import { Slice, NormalizedSlice } from "./structs";
import { KeyError, IndexError, LengthError, ValueError, ReadonlyError } from "./excpetions";
import type { ArrayViewInterface, ArraySelectorInterface, SliceableArray } from "./types";

export {
  mask,
  select,
  slice,
  view,
  ArrayView,
  ArrayIndexListView,
  ArrayMaskView,
  ArraySliceView,
  IndexListSelector,
  MaskSelector,
  SliceSelector,
  Slice,
  NormalizedSlice,
  KeyError,
  IndexError,
  LengthError,
  ValueError,
  ReadonlyError,
};

export type {
  ArrayViewInterface,
  ArraySelectorInterface,
  SliceableArray,
}
