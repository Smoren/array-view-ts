import { mask, select, slice, view, ArrayView, Slice, IndexError, KeyError } from "../../src";

describe.each([
  ...dataProviderForReadIndexError(),
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

function dataProviderForReadIndexError(): Array<unknown> {
  return [
    [[], [-2, -1, 0, 1]],
    [[1], [-3, -2, 1, 2]],
    [[1, 2, 3], [-100, -5, 4, 100]],
  ];
}

describe.each([
  ...dataProviderForReadKeyError(),
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

function dataProviderForReadKeyError(): Array<unknown> {
  return [
    [[], ['']],
    [[], ['a', 'b', 'c']],
    [[], ['1a', 'test', '!']],
    [[1], ['']],
    [[1], ['a', 'b', 'c']],
    [[1], ['1a', 'test', '!']],
    [[1, 2, 3], ['']],
    [[1, 2, 3], ['a', 'b', 'c']],
    [[1, 2, 3], ['1a', 'test', '!']],
  ];
}
