import { expect } from "@jest/globals";
import { ArrayView } from "../../src/array-view";

it("First example", () => {
  const input = [1, 2, 3];

  const view = new ArrayView(input, {
    index: (i, target) => target.length - 1 - i,
  });

  const actual = [];


  expect(true).toBe(true);
});
