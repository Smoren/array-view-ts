import { NormalizedSlice, Slice, SliceSelector, ValueError } from "../../src";

describe.each([
  ...dataProviderForIsSliceTrue(),
] as Array<[string]>)(
  "Is Slice True",
  (input: string) => {
    it("", () => {
      expect(Slice.isSliceString(input)).toBe(true);
      expect(Slice.isSlice(new SliceSelector(input))).toBe(true);
    });
  },
);

function dataProviderForIsSliceTrue(): Array<unknown> {
  return [
    [':'],
    ['::'],
    ['0:'],
    ['1:'],
    ['-1:'],
    ['0::'],
    ['1::'],
    ['-1::'],
    [':0'],
    [':1'],
    [':-1'],
    [':0:'],
    [':1:'],
    [':-1:'],
    ['0:0:'],
    ['1:1:'],
    ['-1:-1:'],
    ['1:1:-1'],
    ['-1:-1:-1'],
    ['1:2:3'],
  ];
}

describe.each([
  ...dataProviderForIsSliceFalse(),
] as Array<[unknown]>)(
  "Is Slice False",
  (input: unknown) => {
    it("", () => {
      expect(Slice.isSliceString(input)).toBe(false);
      expect(Slice.isSlice(input)).toBe(false);
    });
  },
);

describe.each([
  ...dataProviderForIsSliceFalse(),
] as Array<[string | Slice]>)(
  "To Slice Error",
  (input: string | Slice) => {
    it("", () => {
      try {
        // When
        Slice.toSlice(input);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(ValueError);
        expect((e as ValueError).message).toEqual(`Invalid slice: "${String(input)}".`);
      }
    });
  },
);

function dataProviderForIsSliceFalse(): Array<unknown> {
  return [
    [''],
    ['0'],
    ['1'],
    ['1:::'],
    [':1::'],
    ['::1:'],
    [':::1'],
    ['test'],
    ['[::]'],
    ['a:b:c'],
    [Symbol('test')],
    [1],
    [1.1],
    [true],
    [false],
    [null],
    [undefined],
    [[]],
    [[1, 2, 3]],
    [[null]],
    [[undefined]],
    [{}],
    [{a: 1}],
  ];
}

describe.each([
  ...dataProviderForToSlice(),
] as Array<[string, [number?, number?, number?]]>)(
  "To Slice",
  (input: string, expected: [number?, number?, number?]) => {
    it("", () => {
      // When
      const actual = Slice.toSlice(input);
      const expectedSlice = new Slice(...expected);
      expect(actual.start).toEqual(expectedSlice.start);
      expect(actual.end).toEqual(expectedSlice.end);
      expect(actual.step).toEqual(expectedSlice.step);
    });
  },
);

function dataProviderForToSlice(): Array<unknown> {
  return [
    [':', [undefined, undefined, undefined]],
    ['::', [undefined, undefined, undefined]],
    ['0:', [0, undefined, undefined]],
    ['1:', [1, undefined, undefined]],
    ['-1:', [-1, undefined, undefined]],
    ['0::', [0, undefined, undefined]],
    ['1::', [1, undefined, undefined]],
    ['-1::', [-1, undefined, undefined]],
    [':0', [undefined, 0, undefined]],
    [':1', [undefined, 1, undefined]],
    [':-1', [undefined, -1, undefined]],
    [':0:', [undefined, 0, undefined]],
    [':1:', [undefined, 1, undefined]],
    [':-1:', [undefined, -1, undefined]],
    ['0:0:', [0, 0, undefined]],
    ['1:1:', [1, 1, undefined]],
    ['-1:-1:', [-1, -1, undefined]],
    ['1:1:-1', [1, 1, -1]],
    ['-1:-1:-1', [-1, -1, -1]],
    ['1:2:3', [1, 2, 3]],
  ];
}

describe.each([
  ...dataProviderForToString(),
] as Array<[string, [number?, number?, number?]]>)(
  "Slice To String",
  (input: string, expected: [number?, number?, number?]) => {
    it("", () => {
      // When
      const slice = Slice.toSlice(input);
      // Then
      expect(slice.toString()).toEqual(expected);
    });
  },
);

function dataProviderForToString(): Array<unknown> {
  return [
    [':', '::'],
    ['::', '::'],
    ['0:', '0::'],
    ['1:', '1::'],
    ['-1:', '-1::'],
    ['0::', '0::'],
    ['1::', '1::'],
    ['-1::', '-1::'],
    [':0', ':0:'],
    [':1', ':1:'],
    [':-1', ':-1:'],
    [':0:', ':0:'],
    [':1:', ':1:'],
    [':-1:', ':-1:'],
    ['0:0:', '0:0:'],
    ['1:1:', '1:1:'],
    ['-1:-1:', '-1:-1:'],
    ['1:1:-1', '1:1:-1'],
    ['-1:-1:-1', '-1:-1:-1'],
    ['1:2:3', '1:2:3'],
  ];
}

describe.each([
  ...dataProviderForNormalize(),
] as Array<[string, number, [number?, number?, number?], Array<number>]>)(
  "Slice Normalize",
  (input: string, length: number, expected: [number?, number?, number?], expectedIndexes: Array<number>) => {
    it("", () => {
      // Given
      const slice = Slice.toSlice(input);
      // When
      const normalizedSlice = slice.normalize(length);
      // And then
      expect(normalizedSlice).toBeInstanceOf(NormalizedSlice);
      // Then
      expect(normalizedSlice.toString()).toEqual(expected);
      // And then
      expect([...normalizedSlice.toRange()]).toEqual(expectedIndexes);
    });
  },
);

function dataProviderForNormalize(): Array<unknown> {
  return [
    [':', 0, '0:0:1', []],
    ['::', 1, '0:1:1', [0]],
    ['0:', 2, '0:2:1', [0, 1]],
    ['1:', 5, '1:5:1', [1, 2, 3, 4]],
    ['-1:', 3, '2:3:1', [2]],
    ['0::', 10, '0:10:1', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    ['1::', 0, '0:0:1', []],
    ['-1::', 0, '0:0:1', []],
    [':0', 1, '0:0:1', []],
    [':1', 2, '0:1:1', [0]],
    [':-1', 5, '0:4:1', [0, 1, 2, 3]],
    [':0:', 3, '0:0:1', []],
    [':1:', 1, '0:1:1', [0]],
    [':-1:', 3, '0:2:1', [0, 1]],
    ['0:0:', 3, '0:0:1', []],
    ['1:1:', 3, '1:1:1', []],
    ['-1:-1:', 10, '9:9:1', []],
    ['1:1:-1', 10, '1:1:-1', []],
    ['-1:-1:-1', 10, '9:9:-1', []],
    ['1:2:3', 10, '1:2:3', [1]],
    ['1:2:3', 1, '0:0:3', []],
    ['::-1', 1, '0:-1:-1', [0]],
    ['1::-1', 1, '0:-1:-1', [0]],
    ['2::-1', 1, '0:-1:-1', [0]],
    ['2:-3:-1', 1, '0:-1:-1', [0]],
    ['2::-1', 10, '2:-1:-1', [2, 1, 0]],
    [':3:-1', 10, '9:3:-1', [9, 8, 7, 6, 5, 4]],
  ];
}

describe.each([
  ...dataProviderForIsSliceArrayTrue(),
] as Array<[Array<number>]>)(
  "Is Slice Array",
  (input: Array<number>) => {
    it("", () => {
      expect(Slice.isSliceArray(input)).toBeTruthy();
    });
  },
);

function dataProviderForIsSliceArrayTrue(): Array<unknown> {
  return [
    [[]],
    [[,]],
    [[,,]],
    [[0]],
    [[0,]],
    [[0,,]],
    [[1,,]],
    [[1,0,]],
    [[1,1,]],
    [[-1,1,]],
    [[1,,1]],
    [[1,,2]],
    [[,,1]],
    [[,,-1]],
    [[1,10,-1]],
  ];
}

describe.each([
  ...dataProviderForIsSliceArrayFalse(),
] as Array<[Array<number>]>)(
  "Is Slice Array",
  (input: Array<number>) => {
    it("", () => {
      expect(Slice.isSliceArray(input)).toBeFalsy();
    });
  },
);

function dataProviderForIsSliceArrayFalse(): Array<unknown> {
  return [
    [['']],
    [['a']],
    [[0, 1, 'a']],
    [[0, 1, 2, 3]],
    [[1.1, 1, 2]],
    [[1, 1, 2.2]],
    [null],
    [0],
    [1],
    [0.0],
    [1.0],
    [true],
    [false],
    [{}],
    [{a: 1}],
    [[{}]],
    [[{a: 1}]],
  ];
}
