import { ArrayView, LengthError, mask, view } from "../../../src";

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
        expect((e as LengthError).message).toEqual(`Length of values array not equal to view length (${toApplyWith.length} != ${source.length}).`);
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
        expect((e as LengthError).message).toEqual(`Length of values array not equal to view length (${toWrite.length} != ${source.length}).`);
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
