import { view, slice, IndexError } from "../../../src";

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

// describe.each([
//   ...dataProviderForIndexListReadIncompatibleError(),
// ] as Array<[Array<number>, Array<number>]>)(
//   "Index List Read Incompatible Error Test",
//   (
//     source: Array<number>,
//     indexes: Array<number>,
//   ) => {
//     it("", () => {
//       // Given
//       const v = view(source);
//
//       try {
//         // When
//         v.subview(select(indexes));
//         expect(true).toBe(false);
//       } catch (e) {
//         // Then
//         expect(e instanceof IndexError).toBe(true);
//         expect((e as IndexError).message).toEqual("Step cannot be 0.");
//       }
//     });
//   },
// );
//
// function dataProviderForIndexListReadIncompatibleError(): Array<unknown> {
//   return [
//     [[], [0]],
//     [[], [1]],
//     [[], [-1]],
//     [[], [-1, 0, 1]],
//   ];
// }
// TODO
