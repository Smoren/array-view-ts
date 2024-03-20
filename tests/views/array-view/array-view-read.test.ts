import {
  mask,
  select,
  view,
  ArrayView,
  ArrayIndexListView,
  ArrayMaskView,
  ArraySliceView,
  IndexListSelector,
  MaskSelector,
  SliceSelector,
} from "../../../src";

describe.each([
  ...dataProviderForRead(),
] as Array<[Array<number>]>)(
  "Array View Read Test",
  (
    source: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let i = 0; i < source.length; i++) {
        // When
        const actual = v.loc[i];
        const actualByStringIndex = v.loc[String(i)];
        const expected = source[i];

        // Then
        expect(actual).toBe(expected);
        expect(actualByStringIndex).toBe(expected);
      }

      // And then
      expect(v.toArray()).toEqual(source);
      expect([...v]).toEqual(source);
    });
  },
);

function dataProviderForRead(): Array<unknown> {
  return [
    [[1]],
    [[1, 2]],
    [[1, 2, 3]],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]],
  ];
}

describe.each([
  ...dataProviderForCombineRead(),
] as Array<[Array<number>, (source: Array<number>) => ArrayView<number>, Array<number>]>)(
  "Array View Combine Read Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // When
      const v = viewGetter(source);

      // Then
      expect(v.toArray()).toEqual(expected);
      expect([...v]).toEqual(expected);
    });
  },
);

function dataProviderForCombineRead(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => new ArrayIndexListView(source, { indexes: [...source.keys()] })
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => new ArrayIndexListView(source, { indexes: [...source.keys()] })
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => new ArrayMaskView(source, { mask: [true, true, true, true, true, true, true, true, true, true] })
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => new ArraySliceView(source, { slice: new SliceSelector("::1") })
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true])),
      [1, 5, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(new MaskSelector([true, false, true, false, true]))
        .subview(new IndexListSelector([0, 2])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(new MaskSelector(view([true, false, true, false, true])))
        .subview(new IndexListSelector(view([0, 2]))),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]))
        .subview('1:'),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true]))
        .subview(mask([false, true])),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(select([0, 2, 4, 6, 8]))
        .subview(select([0, 2, 4]))
        .subview(select([0, 2]))
        .subview(select([1])),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview('::2')
        .subview('::2'),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview('::2')
        .subview('::2')
        .subview('1:'),
      [9],
    ],
  ];
}

describe.each([
  ...dataProviderForIsAndFilter(),
] as Array<[Array<number>, (x: number) => boolean, Array<boolean>, Array<number>]>)(
  "Array View Is And Filter Test",
  (
    source: Array<number>,
    predicate: (x: number) => boolean,
    expectedMask: Array<boolean>,
    expectedArray: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      // When
      const boolMask = v.is(predicate);
      const filtered = v.filter(predicate);

      // Then
      expect(boolMask.value).toEqual(expectedMask);
      expect(v.subview(boolMask).toArray()).toEqual(expectedArray);
      expect(filtered.toArray()).toEqual(expectedArray);
    });
  },
);

function dataProviderForIsAndFilter(): Array<unknown> {
  return [
    [
      [],
      (x: number) => x % 2 === 0,
      [],
      [],
    ],
    [
      [1],
      (x: number) => x % 2 === 0,
      [false],
      [],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (x: number) => x % 2 === 0,
      [false, true, false, true, false, true, false, true, false, true],
      [2, 4, 6, 8, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (_: number, i: number) => i % 2 === 0,
      [true, false, true, false, true, false, true, false, true, false],
      [1, 3, 5, 7, 9],
    ],
  ];
}
