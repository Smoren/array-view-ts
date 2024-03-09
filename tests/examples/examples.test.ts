import { expect } from "@jest/globals";
import {
  ArrayView,
  IndexListSelector,
  MaskSelector,
  SliceSelector,
} from "../../src";

it("First example", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const view1 = new ArrayView(input);
  const view2 = view1.subview(new MaskSelector([true, false, true, false, true, false, true, false, true, false]));
  const view3 = view2.subview(new IndexListSelector(new ArrayView([0, 1, 3, 4])));
  const view4 = view3.subview(new SliceSelector('1:-1:1'));

  view4.toArray();
  // for (let i = 0; i < view3.length; i++) {
  //   view3.loc[i] = 22;
  // }

  expect(true).toBe(true);
});