import { select, view } from "../../src/functions";

describe.each([
  ...dataProviderForIndexListSubviewReadSuccess(),
] as Array<[Array<number>, Array<number>, Array<number>]>)(
  "Array View Index List Subview Read Success Test",
  (
    source: Array<number>,
    indexes: Array<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);
      const subview = v.subview(select(indexes));

      expect(subview.length).toEqual(indexes.length);
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

function dataProviderForIndexListSubviewReadSuccess(): Array<unknown> {
  return [
    [[], [], []],
    [[1], [], []],
    [[1, 2, 3], [], []],
    [[1], [0], [1]],
    [[1], [0, 0], [1, 1]],
    [[1], [0, 0, 0], [1, 1, 1]],
    [[1, 2], [0], [1]],
    [[1, 2], [1], [2]],
    [[1, 2], [0, 1], [1, 2]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 3, 5, 7], [2, 4, 6, 8]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [7, 5, 3, 1], [8, 6, 4, 2]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 3, 7], [2, 6, 4, 8]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 7, 8], [1, 2, 8, 9]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 1, 5, 5, 3], [2, 2, 6, 6, 4]],
  ];
}

describe.each([
  ...dataProviderForIndexListSubviewUpdateSuccess(),
] as Array<[Array<number>, Array<number>, Array<number>, Array<number>]>)(
  "Array View Index List Subview Update Success Test",
  (
    source: Array<number>,
    indexes: Array<number>,
    expectedSubview: Array<number>,
    expectedView: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);
      const subview = v.subview(select(indexes));

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

function dataProviderForIndexListSubviewUpdateSuccess(): Array<unknown> {
  return [
    [
      [],
      [],
      [],
      [],
    ],
    [
      [1],
      [],
      [],
      [1],
    ],
    [
      [1, 2, 3],
      [],
      [],
      [1, 2, 3],
    ],
    [
      [1],
      [0],
      [2],
      [2],
    ],
    [
      [1],
      [0, 0],
      [3, 3],
      [3],
    ],
    [
      [1],
      [0, 0, 0],
      [4, 4, 4],
      [4],
    ],
    [
      [1, 2],
      [0],
      [2],
      [2, 2],
    ],
    [
      [1, 2],
      [1],
      [3],
      [1, 3],
    ],
    [
      [1, 2],
      [0, 1],
      [2, 3],
      [2, 3],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 3, 5, 7],
      [3, 5, 7, 9],
      [1, 3, 3, 5, 5, 7, 7, 9, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [7, 5, 3, 1],
      [9, 7, 5, 3],
      [1, 3, 3, 5, 5, 7, 7, 9, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 3, 7],
      [3, 7, 5, 9],
      [1, 3, 3, 5, 5, 7, 7, 9, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 1, 7, 8],
      [2, 3, 9, 10],
      [2, 3, 3, 4, 5, 6, 7, 9, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 1, 5, 5, 3],
      [4, 4, 8, 8, 5],
      [1, 4, 3, 5, 5, 8, 7, 8, 9],
    ],
  ];
}
