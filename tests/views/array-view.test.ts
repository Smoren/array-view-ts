import { mask, select, slice, view, ArrayView, Slice } from "../../src";

describe.each([
  ...dataProviderForReadSuccess(),
] as Array<[Array<number>]>)(
  "Array View Read Success Test",
  (
    source: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let i = 0; i < source.length; i++) {
        // When
        const actual = v.loc[i];
        const expected = source[i];

        // Then
        expect(actual).toBe(expected);
      }

      // And then
      expect(v.toArray()).toEqual(source);
      expect([...v]).toEqual(source);
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
      const v = view(source);

      for (let i = 0; i < source.length; i++) {
        // When
        v.loc[i] = toWrite[i];

        // Then
        expect(v.loc[i]).toBe(toWrite[i]);
        expect(source[i]).toBe(toWrite[i]);
      }

      // And then
      expect(v.toArray()).toEqual(toWrite);
      expect([...v]).toEqual(toWrite);
      expect(source).toEqual(toWrite);
    });
  },
);

describe.each([
  ...dataProviderForWriteSuccess(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Set Success Test",
  (
    source: Array<number>,
    toWrite: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      // When
      v.set(toWrite);

      // And then
      expect(v.toArray()).toEqual(toWrite);
      expect([...v]).toEqual(toWrite);
      expect(source).toEqual(toWrite);
    });
  },
);

describe.each([
  ...dataProviderForWriteSuccess(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Set Loc Success Test",
  (
    source: Array<number>,
    toWrite: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      // When
      v.loc[':'] = toWrite;

      // And then
      expect(v.toArray()).toEqual(toWrite);
      expect([...v]).toEqual(toWrite);
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
      const v = view(source);

      for (let i = 0; i < source.length; i++) {
        // When
        v.loc[i]++;

        // Then
        expect(v.loc[i]).toBe(expected[i]);
        expect(source[i]).toBe(expected[i]);
      }

      // And then
      expect(v.toArray()).toEqual(expected);
      expect([...v]).toEqual(expected);
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
  ...dataProviderForCombineReadSuccess(),
] as Array<[Array<number>, (source: Array<number>) => ArrayView<number>, Array<number>]>)(
  "Array View Combine Read Success Test",
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
    });
  },
);

function dataProviderForCombineReadSuccess(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
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
  ...dataProviderForCombineWriteSuccess(),
] as Array<[Array<number>, (source: Array<number>) => ArrayView<number>, Array<number>, Array<number>]>)(
  "Array View Combine Write Success Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    toWrite: Array<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      // When
      v.set(toWrite)

      // Then
      expect(source).toEqual(expected);
    });
  },
);

describe.each([
  ...dataProviderForCombineWriteSuccess(),
] as Array<[Array<number>, (source: Array<number>) => ArrayView<number>, Array<number>, Array<number>]>)(
  "Array View Combine Write Slice Success Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    toWrite: Array<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      // When
      v.loc[':'] = toWrite;

      // Then
      expect(source).toEqual(expected);
    });
  },
);

function dataProviderForCombineWriteSuccess(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2'),
      [11, 33, 55, 77, 99],
      [11, 2, 33, 4, 55, 6, 77, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true])),
      [11, 55, 99],
      [11, 2, 3, 4, 55, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2])),
      [11, 99],
      [11, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]))
        .subview('1:'),
      [99],
      [1, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true]))
        .subview(mask([false, true])),
      [99],
      [1, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(mask(view([true, false, true, false, true, false, true, false, true, false])))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true])),
      [11, 99],
      [11, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(select([0, 2, 4, 6, 8]))
        .subview(select([0, 2, 4]))
        .subview(select([0, 2]))
        .subview(select([1])),
      [99],
      [1, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2')
        .subview('::2')
        .subview('::2')
        .subview('1:'),
      [99],
      [1, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview(slice(new Slice(undefined, undefined, 2)))
        .subview(slice('::2'))
        .subview('::2'),
      [11, 99],
      [11, 2, 3, 4, 5, 6, 7, 8, 99, 10],
    ],
  ];
}

describe.each([
  ...dataProviderForApplySuccess(),
] as Array<[
  Array<number>,
  (source: Array<number>) => ArrayView<number>,
  (item: number, index: number) => number,
  Array<number>,
]>)(
  "Array View Apply Success Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    mapper: (item: number, index: number) => number,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      // When
      v.apply(mapper)

      // Then
      expect(source).toEqual(expected);
    });
  },
);

function dataProviderForApplySuccess(): Array<unknown> {
  return [
    [
      [],
      (source: Array<number>) => view(source),
      (item: number) => item + 1,
      [],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      (item: number) => item + 1,
      [2],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source),
      (item: number) => item + 1,
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source),
      (item: number, index: number) => item + index,
      [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('::2'),
      (item: number, index: number) => item + index,
      [1, 2, 4, 4, 7, 6, 10, 8, 13, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('1::2'),
      (item: number) => item * 2,
      [1, 4, 3, 8, 5, 12, 7, 16, 9, 20],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source)
        .subview('1::2')
        .subview(select([0, 1, 2])),
      (item: number) => item * 2,
      [1, 4, 3, 8, 5, 12, 7, 8, 9, 10],
    ],
  ];
}

describe.each([
  ...dataProviderForApplyWithSuccess(),
] as Array<[
  Array<number>,
  (source: Array<number>) => ArrayView<number>,
  (item: number, index: number) => number,
  Array<number>,
  Array<number>,
]>)(
  "Array View Apply With Success Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    mapper: (item: number, index: number) => number,
    arg: Array<number>,
    expected: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      // When
      v.applyWith(arg, mapper)

      // Then
      expect(source).toEqual(expected);
    });
  },
);

function dataProviderForApplyWithSuccess(): Array<unknown> {
  return [
    [
      [],
      (source: Array<number>) => view(source),
      (lhs: number, rhs: number) => lhs + rhs,
      [],
      [],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      (lhs: number, rhs: number) => lhs + rhs,
      [2],
      [3],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source),
      (lhs: number, rhs: number) => lhs + rhs,
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [11, 22, 33, 44, 55, 66, 77, 88, 99, 110],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source),
      (lhs: number, rhs: number, index: number) => index % 2 === 0 ? lhs : rhs,
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [1, 20, 3, 40, 5, 60, 7, 80, 9, 100],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: Array<number>) => view(source).subview('::2'),
      (lhs: number, rhs: number) => lhs * rhs,
      [1, 2, 3, 4, 5],
      [1, 2, 6, 4, 15, 6, 28, 8, 45, 10],
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
