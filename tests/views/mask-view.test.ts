import { mask, view } from "../../src";

describe.each([
  ...dataProviderForMaskSubviewRead(),
] as Array<[Array<number>, Array<boolean>, Array<number>]>)(
  "Array View Mask Subview Read Test",
  (
    source: Array<number>,
    boolMask: Array<boolean>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);
      const subview = v.subview(mask(boolMask));

      expect(subview.length).toEqual(boolMask.filter((x) => x).length);
      expect(subview.length).toEqual(expected.length);

      for (let i = 0; i < subview.length; i++) {
        expect(subview.loc[i]).toBe(expected[i]);
      }

      for (let i = 0; i < v.length; i++) {
        expect(v.loc[i]).toBe(source[i]);
      }

      // And then
      expect(v.toArray()).toEqual(source);
      expect(subview.toArray()).toEqual(expected);

      expect([...v]).toEqual(source);
      expect([...subview]).toEqual(expected);
    });
  },
);

function dataProviderForMaskSubviewRead(): Array<unknown> {
  return [
    [[], [], []],
    [[1], [0], []],
    [[1, 2, 3], [0, 0, 0], []],
    [[1], [1], [1]],
    [[1, 2], [1, 0], [1]],
    [[1, 2], [0, 1], [2]],
    [[1, 2], [1, 1], [1, 2]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 0, 1, 0, 1, 0, 1, 0], [2, 4, 6, 8]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 1, 1, 0, 0, 0, 0, 0, 1], [1, 2, 3, 9]],
  ];
}

describe.each([
  ...dataProviderForMaskSubviewUpdate(),
] as Array<[Array<number>, Array<boolean>, Array<number>, Array<number>]>)(
  "Array View Mask Subview Update Test",
  (
    source: Array<number>,
    boolMask: Array<boolean>,
    expectedSubview: Array<number>,
    expectedView: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);
      const subview = v.subview(mask(boolMask));

      // Then
      expect(v.toArray()).toEqual(source);

      for (let i = 0; i < subview.length; i++) {
        ++subview.loc[i];
      }

      expect(subview.toArray()).toEqual(expectedSubview);
      expect(v.toArray()).toEqual(expectedView);

      expect([...subview]).toEqual(expectedSubview);
      expect([...v]).toEqual(expectedView);

      expect(source).toEqual(expectedView);
    });
  },
);

function dataProviderForMaskSubviewUpdate(): Array<unknown> {
  return [
    [
      [],
      [],
      [],
      [],
    ],
    [
      [1],
      [0],
      [],
      [1],
    ],
    [
      [1, 2, 3],
      [0, 0, 0],
      [],
      [1, 2, 3],
    ],
    [
      [1],
      [1],
      [2],
      [2],
    ],
    [
      [1, 2],
      [1, 0],
      [2],
      [2, 2],
    ],
    [
      [1, 2],
      [0, 1],
      [3],
      [1, 3],
    ],
    [
      [1, 2],
      [1, 1],
      [2, 3],
      [2, 3],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 1, 0, 1, 0, 1, 0, 1, 0],
      [3, 5, 7, 9],
      [1, 3, 3, 5, 5, 7, 7, 9, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 1, 1, 0, 0, 0, 0, 0, 1],
      [2, 3, 4, 10],
      [2, 3, 4, 4, 5, 6, 7, 8, 10],
    ],
  ];
}
