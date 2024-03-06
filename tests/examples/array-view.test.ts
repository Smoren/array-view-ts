import { ArrayView } from "../../src/views";
import { ArrayCompressSelector, ArrayIndexListSelector, ArraySliceSelector } from "../../src/selectors";

describe.each([
  ...dataProviderForReadSuccess(),
] as Array<[Array<number>]>)(
  "Array View Read Success Test",
  (
    source: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);

      for (let i = 0; i < source.length; i++) {
        // When
        const actual = view.loc[i];
        const expected = source[i];

        // Then
        expect(actual).toBe(expected);
      }

      // And then
      expect(view.toArray()).toEqual(source);
    });
  },
);

function dataProviderForReadSuccess(): Array<unknown> {
  return [
    [[1]],
    [[1, 2]],
    [[1, 2, 3]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]],
  ];
}

describe.each([
  ...dataProviderForWriteSuccess(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Write Success Test",
  (
    source: Array<number>,
    toWrite: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);

      for (let i = 0; i < source.length; i++) {
        // When
        view.loc[i] = toWrite[i];

        // Then
        expect(view.loc[i]).toBe(toWrite[i]);
        expect(source[i]).toBe(toWrite[i]);
      }

      // And then
      expect(view.toArray()).toEqual(toWrite);
      expect(source).toEqual(toWrite);
    });
  },
);

function dataProviderForWriteSuccess(): Array<unknown> {
  return [
    [[1], [0]],
    [[1, 2], [3, 5]],
    [[1, 2, 3], [11, 22, 33]],
  ];
}

describe.each([
  ...dataProviderForIncrementSuccess(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Increment Success Test",
  (
    source: Array<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);

      for (let i = 0; i < source.length; i++) {
        // When
        view.loc[i]++;

        // Then
        expect(view.loc[i]).toBe(expected[i]);
        expect(source[i]).toBe(expected[i]);
      }

      // And then
      expect(view.toArray()).toEqual(expected);
      expect(source).toEqual(expected);
    });
  },
);

function dataProviderForIncrementSuccess(): Array<unknown> {
  return [
    [[1], [2]],
    [[1, 2], [2, 3]],
    [[3, 2, 1], [4, 3, 2]],
  ];
}

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
      const view = new ArrayView<number>(source);
      const subview = view.subview(new ArrayIndexListSelector(indexes));

      expect(subview.length).toEqual(indexes.length);
      expect(subview.length).toEqual(expected.length);

      for (let i = 0; i < subview.length; i++) {
        expect(subview.loc[i]).toBe(expected[i]);
      }

      for (let i = 0; i < view.length; i++) {
        expect(view.loc[i]).toBe(source[i]);
      }

      // And then
      expect(view.toArray()).toEqual(source);
      expect(subview.toArray()).toEqual(expected);
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
      const view = new ArrayView<number>(source);
      const subview = view.subview(new ArrayIndexListSelector(indexes));

      // Then
      expect(view.toArray()).toEqual(source);

      for (let i = 0; i < subview.length; i++) {
        ++subview.loc[i];
      }

      expect(subview.toArray()).toEqual(expectedSubview);
      expect(view.toArray()).toEqual(expectedView);
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

describe.each([
  ...dataProviderForCompressSubviewReadSuccess(),
] as Array<[Array<number>, Array<boolean>, Array<number>]>)(
  "Array View Compress Subview Read Success Test",
  (
    source: Array<number>,
    mask: Array<boolean>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);
      const subview = view.subview(new ArrayCompressSelector(mask));

      expect(subview.length).toEqual(mask.filter((x) => x).length);
      expect(subview.length).toEqual(expected.length);

      for (let i = 0; i < subview.length; i++) {
        expect(subview.loc[i]).toBe(expected[i]);
      }

      for (let i = 0; i < view.length; i++) {
        expect(view.loc[i]).toBe(source[i]);
      }

      // And then
      expect(view.toArray()).toEqual(source);
      expect(subview.toArray()).toEqual(expected);
    });
  },
);

function dataProviderForCompressSubviewReadSuccess(): Array<unknown> {
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
  ...dataProviderForCompressSubviewUpdateSuccess(),
] as Array<[Array<number>, Array<boolean>, Array<number>, Array<number>]>)(
  "Array View Compress Subview Update Success Test",
  (
    source: Array<number>,
    mask: Array<boolean>,
    expectedSubview: Array<number>,
    expectedView: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);
      const subview = view.subview(new ArrayCompressSelector(mask));

      // Then
      expect(view.toArray()).toEqual(source);

      for (let i = 0; i < subview.length; i++) {
        ++subview.loc[i];
      }

      expect(subview.toArray()).toEqual(expectedSubview);
      expect(view.toArray()).toEqual(expectedView);
      expect(source).toEqual(expectedView);
    });
  },
);

function dataProviderForCompressSubviewUpdateSuccess(): Array<unknown> {
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

describe.each([
  ...dataProviderForSliceSubviewReadSuccess(),
] as Array<[Array<number>, [number, number?, number?], Array<number>]>)(
  "Array View Slice Subview Read Success Test",
  (
    source: Array<number>,
    config: [number, number?, number?],
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const view = new ArrayView<number>(source);
      const subview = view.subview(new ArraySliceSelector(config));

      expect(subview.length).toEqual(expected.length);

      for (let i = 0; i < subview.length; i++) {
        expect(subview.loc[i]).toBe(expected[i]);
      }

      for (let i = 0; i < view.length; i++) {
        expect(view.loc[i]).toBe(source[i]);
      }

      // And then
      expect(view.toArray()).toEqual(source);
      expect(subview.toArray()).toEqual(expected);
    });
  },
);

function dataProviderForSliceSubviewReadSuccess(): Array<unknown> {
  return [
    // [[], [0], []],
    // [[], [0, 0], []],
    // [[], [0, 0, 1], []],
    // [[], [1, -1], []],
    // [[], [-1, -1], []],
    // [[], [-2, -1], []],
    // [[], [-2, -1, 2], []],
    // [[], [-1, 0, -1], []],
    [[1], [0], [1]],
    [[1], [0, 1], [1]],
    [[1], [0, 1, 1], [1]],
    [[1], [0, 1, 2], [1]],
    [[1], [0, -1], [1]],
    [[1], [0, -1, 1], [1]],
    [[1], [0, -1, 2], [1]],
    // [[1], [0, 10, 100], [1]],
    // [[1], [1, 10, 100], []],
    // [[1], [0], []],
    // [[1, 2, 3], [0, 0, 0], []],
    // [[1], [1], [1]],
    // [[1, 2], [1, 0], [1]],
    // [[1, 2], [0, 1], [2]],
    // [[1, 2], [1, 1], [1, 2]],
    // [[1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 0, 1, 0, 1, 0, 1, 0], [2, 4, 6, 8]],
    // [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 1, 1, 0, 0, 0, 0, 0, 1], [1, 2, 3, 9]],
  ];
}
