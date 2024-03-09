import { view, mask, slice, IndexError, KeyError, LengthError, ArrayView } from "../../src";

describe.each([
  ...dataProviderForIndexError(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Read Index Error Test",
  (
    source: Array<number>,
    indexes: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let index of indexes) {
        try {
          // When
          v.loc[index];
          fail();
        } catch (e) {
          // Then
          expect(e instanceof IndexError).toBe(true);
          expect((e as IndexError).message).toEqual(`Index ${index} is out of range.`);
        }
      }
    });
  },
);

describe.each([
  ...dataProviderForIndexError(),
] as Array<[Array<number>, Array<number>]>)(
  "Array View Write Index Error Test",
  (
    source: Array<number>,
    indexes: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let index of indexes) {
        try {
          // When
          v.loc[index] = 1;
          fail();
        } catch (e) {
          // Then
          expect(e instanceof IndexError).toBe(true);
          expect((e as IndexError).message).toEqual(`Index ${index} is out of range.`);
        }
      }
    });
  },
);

function dataProviderForIndexError(): Array<unknown> {
  return [
    [[], [-2, -1, 0, 1]],
    [[1], [-3, -2, 1, 2]],
    [[1, 2, 3], [-100, -5, 4, 100]],
  ];
}

describe.each([
  ...dataProviderForKeyError(),
] as Array<[Array<number>, Array<string | Symbol>]>)(
  "Array View Read Key Error Test",
  (
    source: Array<number>,
    indexes: Array<string | Symbol>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let index of indexes) {
        try {
          // When
          // @ts-ignore
          v.loc[index];
          expect(true).toBe(false);
        } catch (e) {
          // Then
          expect(e instanceof KeyError).toBe(true);
          expect((e as KeyError).message).toEqual(`Invalid key: "${String(index)}".`);
        }
      }
    });
  },
);

describe.each([
  ...dataProviderForKeyError(),
] as Array<[Array<number>, Array<string | Symbol>]>)(
  "Array View Write Key Error Test",
  (
    source: Array<number>,
    indexes: Array<string | Symbol>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      for (let index of indexes) {
        try {
          // When
          // @ts-ignore
          v.loc[index] = 1;
          expect(true).toBe(false);
        } catch (e) {
          // Then
          expect(e instanceof KeyError).toBe(true);
          expect((e as KeyError).message).toEqual(`Invalid key: "${String(index)}".`);
        }
      }
    });
  },
);

function dataProviderForKeyError(): Array<unknown> {
  return [
    [[], ['']],
    [[], ['a', 'b', 'c']],
    [[], ['1a', 'test', '!']],
    [[], [Symbol(''), Symbol('test')]],
    [[1], ['']],
    [[1], ['a', 'b', 'c']],
    [[1], ['1a', 'test', '!']],
    [[1], [Symbol(''), Symbol('test')]],
    [[1, 2, 3], ['']],
    [[1, 2, 3], ['a', 'b', 'c']],
    [[1, 2, 3], ['1a', 'test', '!']],
    [[1, 2, 3], [Symbol(''), Symbol('test')]],
  ];
}

describe.each([
  ...dataProviderForMaskViewReadLengthError(),
] as Array<[Array<number>, Array<boolean>]>)(
  "Mask View Read Length Error Test",
  (
    source: Array<number>,
    boolMask: Array<boolean>,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      try {
        // When
        v.subview(mask(boolMask));
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof LengthError).toBe(true);
        expect((e as LengthError).message).toEqual(`Mask length not equal to source length (${boolMask.length} != ${source.length}).`);
      }
    });
  },
);

function dataProviderForMaskViewReadLengthError(): Array<unknown> {
  return [
    [[], [1]],
    [[1], []],
    [[1], [1, 0]],
    [[1, 2, 3], [1]],
    [[1, 2, 3], [0]],
    [[1, 2, 3], [0, 1]],
    [[1, 2, 3], [0, 1, 1, 0]],
    [[1, 2, 3], [1, 1, 1, 1, 1]],
    [[1, 2, 3], [0, 0, 0, 0, 0]],
  ];
}

describe.each([
  ...dataProviderForSliceViewLocReadIndexError(),
] as Array<[Array<number>, string, Array<number>]>)(
  "Slice View Loc Read Index Error Test",
  (
    source: Array<number>,
    config: string,
  ) => {
    it("", () => {
      // Given
      const v = view(source);

      try {
        // When
        v.subview(slice(config));
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof IndexError).toBe(true);
        expect((e as IndexError).message).toEqual("Step cannot be 0.");
      }
    });
  },
);

function dataProviderForSliceViewLocReadIndexError(): Array<unknown> {
  return [
    [[], '::0'],
    [[], '0:0:0'],
    [[], '0:1:0'],
    [[], '0::0'],
    [[], ':-1:0'],
    [[], '1:-1:0'],
    [[1], '::0'],
    [[1], '0:0:0'],
    [[1], '0:1:0'],
    [[1], '0::0'],
    [[1], ':-1:0'],
    [[1], '1:-1:0'],
    [[1, 2, 3], '::0'],
    [[1, 2, 3], '0:0:0'],
    [[1, 2, 3], '0:1:0'],
    [[1, 2, 3], '0::0'],
    [[1, 2, 3], ':-1:0'],
    [[1, 2, 3], '1:-1:0'],
  ];
}

describe.each([
  ...dataProviderForApplyWithLengthError(),
] as Array<[
  Array<number>,
  (source: Array<number>) => ArrayView<number>,
  (item: number, index: number) => number,
  Array<number>,
]>)(
  "Array View Apply With Length Error Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    mapper: (item: number, index: number) => number,
    toApplyWith: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      try {
        // When
        v.applyWith(toApplyWith, mapper);
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof LengthError).toBe(true);
        expect((e as IndexError).message).toEqual(`Length of values array not equal to view length (${toApplyWith.length} != ${source.length}).`);
      }
    });
  },
);

function dataProviderForApplyWithLengthError(): Array<unknown> {
  return [
    [
      [],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [1],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [1, 2],
    ],
    [
      [1, 2, 3],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [1, 2],
    ],
    [
      [1, 2, 3],
      (source: Array<number>) => view(source),
      (item: number) => item,
      [1, 2, 3, 4, 5],
    ],
  ];
}

describe.each([
  ...dataProviderForWriteLengthError(),
] as Array<[
  Array<number>,
  (source: Array<number>) => ArrayView<number>,
  Array<number>,
]>)(
  "Array View Write Length Error Test",
  (
    source: Array<number>,
    viewGetter: (source: Array<number>) => ArrayView<number>,
    toWrite: Array<number>,
  ) => {
    it("", () => {
      // Given
      const v = viewGetter(source);

      try {
        // When
        v.loc[':'] = toWrite;
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof LengthError).toBe(true);
        expect((e as IndexError).message).toEqual(`Length of values array not equal to view length (${toWrite.length} != ${source.length}).`);
      }
    });
  },
);

function dataProviderForWriteLengthError(): Array<unknown> {
  return [
    [
      [],
      (source: Array<number>) => view(source),
      [1],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      [],
    ],
    [
      [1],
      (source: Array<number>) => view(source),
      [1, 2],
    ],
    [
      [1, 2, 3],
      (source: Array<number>) => view(source),
      [1, 2],
    ],
    [
      [1, 2, 3],
      (source: Array<number>) => view(source),
      [1, 2, 3, 4, 5],
    ],
  ];
}
