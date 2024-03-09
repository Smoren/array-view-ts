import { normalizeIndex } from "../src/utils";
import { IndexError } from "../src";

describe.each([
  ...dataProviderForSuccess(),
] as Array<[Array<number>, number, number]>)(
  "Normalize Index Success Test",
  (
    source: Array<number>,
    index: number,
    expected: number,
  ) => {
    it("", () => {
      // When
      const normalizedIndex = normalizeIndex(index, source.length);

      // Then
      expect(source[normalizedIndex]).toBe(expected);
    });
  }
);

function dataProviderForSuccess(): Array<unknown> {
  return [
    [[1], 0, 1],
    [[1], -1, 1],
    [[1, 2], 0, 1],
    [[1, 2], -1, 2],
    [[1, 2], 1, 2],
    [[1, 2], -2, 1],
    [[1, 2, 3], 0, 1],
    [[1, 2, 3], -1, 3],
    [[1, 2, 3], 1, 2],
    [[1, 2, 3], -2, 2],
    [[1, 2, 3], 2, 3],
    [[1, 2, 3], -3, 1],
  ];
}

describe.each([
  ...dataProviderForError(),
] as Array<[Array<number>, number, number]>)(
  "Normalize Index Error Test",
  (
    source: Array<number>,
    index: number,
  ) => {
    it("", () => {
      // When
      try {
        normalizeIndex(index, source.length);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(IndexError);
        expect((e as IndexError).message).toEqual(`Index ${index} is out of range.`);
      }
    });
  }
);

function dataProviderForError(): Array<unknown> {
  return [
    [[], 0],
    [[], -1],
    [[], 2],
    [[], -2],
    [[1], 1],
    [[1], -2],
    [[1, 2], 2],
    [[1, 2], -3],
    [[1, 2, 3], 3],
    [[1, 2, 3], -4],
    [[1, 2, 3], 4],
    [[1, 2, 3], -5],
    [[1, 2, 3], 100],
    [[1, 2, 3], -101],
  ];
}
