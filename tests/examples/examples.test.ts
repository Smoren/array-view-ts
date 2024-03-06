import { expect } from "@jest/globals";
import {
  ArrayView,
  ArrayIndexListView,
  ArrayCompressView,
  ArraySliceView,
} from "../../src/views";
import {
  ArrayIndexListSelector,
  ArrayCompressSelector, ArraySliceSelector,
} from "../../src/selectors";
import { Slice } from "../../src/structs";

it("First example", () => {
  const input = [1, 2, 3, 4, 5];

  const view1 = new ArrayIndexListView(input, [0, 2, 4]);
  const view2 = new ArrayCompressView(input, [true, true, false, false, true]);
  const view3 = new ArraySliceView(input, new Slice(1, 5, 2));

  expect(true).toBe(true);
});

it("Second example", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const view1 = new ArrayView(input);
  const view2 = view1.subview(new ArrayCompressSelector([true, false, true, false, true, false, true, false, true, false]));
  const view3 = view2.subview(new ArrayIndexListSelector(new ArrayView([0, 1, 3, 4])));
  const view4 = view3.subview(new ArraySliceSelector('1:-1:1'));

  view4.toArray();
  // for (let i = 0; i < view3.length; i++) {
  //   view3.loc[i] = 22;
  // }

  expect(true).toBe(true);
});
