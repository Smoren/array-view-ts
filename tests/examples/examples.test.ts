import {
  mask,
  select,
  slice,
  view,
} from "../../src";

it("Slicing example", () => {
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const originalView = view(originalArray);

  expect(originalView.loc['1:7:2']).toEqual([2, 4, 6]);
  expect(originalView.loc[':3']).toEqual([1, 2, 3]);
  expect(originalView.loc['::-1']).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);

  expect(originalView.loc[2]).toEqual(3);
  expect(originalView.loc[4]).toEqual(5);
  expect(originalView.loc[-1]).toEqual(9);
  expect(originalView.loc[-2]).toEqual(8);

  originalView.loc['1:7:2'] = [22, 44, 66];
  expect(originalArray).toEqual([1, 22, 3, 44, 5, 66, 7, 8, 9])
});

it("Subview example", () => {
  const originalArray = [1, 2, 3, 4, 5];
  const originalView = view(originalArray);

  expect(originalView.subview(mask([true, false, true, false, true])).toArray()).toEqual([1, 3, 5]);
  expect(originalView.subview(select([1, 2, 4])).toArray()).toEqual([2, 3, 5]);
  expect(originalView.subview(slice('::-1')).toArray()).toEqual([5, 4, 3, 2, 1]);
  expect(originalView.subview(slice([,,-1])).toArray()).toEqual([5, 4, 3, 2, 1]);

  originalView.subview(mask([true, false, true, false, true])).apply((x: number) => x * 10);
  expect(originalArray).toEqual([10, 2, 30, 4, 50]);
});

it("Combined example", () => {
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const subview = view(originalArray)
    .subview('::2') // [1, 3, 5, 7, 9]
    .subview(mask([true, false, true, true, true])) // [1, 5, 7, 9]
    .subview(select([0, 1, 2])) // [1, 5, 7]
    .subview('1:') // [5, 7]

  expect(subview.toArray()).toEqual([5, 7]);

  subview.loc[':'] = [55, 77];
  expect(originalArray).toEqual([1, 2, 3, 4, 55, 6, 77, 8, 9, 10]);
});

it("Mask example", () => {
  const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const array2 = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10];

  const mask = view(array1).is((x: number) => x % 3 === 0);
  expect([...view(array1).subview(mask)]).toEqual([3, 6, 9]);

  view(array2).subview(mask).applyWith(view(array1).subview(mask), (lhs: number, rhs: number) => lhs + rhs);
  expect(array2).toEqual([-1, -2, 0, -4, -5, 0, -7, -8, 0, -10]);
});

it("Another combined example", () => {
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const subview = view(originalArray)
    .subview('::2') // [1, 3, 5, 7, 9]
    .subview(mask([true, false, true, true, true])); // [1, 5, 7, 9]

  const anotherSubview = view(subview)
    .subview(select([0, 1, 2])) // [1, 5, 7]
    .subview('1:') // [5, 7]

  expect([...anotherSubview]).toEqual([5, 7]);

  anotherSubview.loc[':'] = [55, 77];
  expect(originalArray).toEqual([1, 2, 3, 4, 55, 6, 77, 8, 9, 10]);
});
