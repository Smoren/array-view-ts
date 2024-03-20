import { KeyError, view } from "../../../src";

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
