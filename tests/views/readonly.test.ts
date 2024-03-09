import { ArrayView, mask, select, view, ReadonlyError } from "../../src";

describe.each([
  ...dataProviderForReadonly(),
  ...dataProviderForReadonlySubview(),
] as Array<[Array<number>, (view: Array<number>) => ArrayView<number>, Array<number>]>)(
  "Array View Readonly Test",
  (
    source: Array<number>,
    readonlyViewGetter: (view: Array<number>) => ArrayView<number>,
    expected: Array<number>,
  ) => {
    it("Array View Readonly Write By Index Test", () => {
      // Given
      const v = readonlyViewGetter(source);

      for (let i = 0; i < v.length; ++i) {
        try {
          // When
          v.loc[i] = 1;
          expect(true).toBe(false);
        } catch (e) {
          // Then
          expect(e instanceof ReadonlyError).toBe(true);
          expect((e as ReadonlyError).message).toEqual("Cannot modify a readonly view.");
        }
      }

      // And then
      expect([...v]).toEqual(expected);
    });
    it("Array View Readonly Write All Test", () => {
      // Given
      const v = readonlyViewGetter(source);

      try {
        // When
        v.loc[':'] = v.toArray();
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof ReadonlyError).toBe(true);
        expect((e as ReadonlyError).message).toEqual("Cannot modify a readonly view.");
      }

      // And then
      expect([...v]).toEqual(expected);
    });
    it("Array View Readonly Apply Test", () => {
      // Given
      const v = readonlyViewGetter(source);

      try {
        // When
        v.apply((x) => x);
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof ReadonlyError).toBe(true);
        expect((e as ReadonlyError).message).toEqual("Cannot modify a readonly view.");
      }

      // And then
      expect([...v]).toEqual(expected);
    });
    it("Array View Readonly Apply With Test", () => {
      // Given
      const v = readonlyViewGetter(source);

      try {
        // When
        v.applyWith(v.toArray(), (lhs, rhs) => lhs + rhs);
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof ReadonlyError).toBe(true);
        expect((e as ReadonlyError).message).toEqual("Cannot modify a readonly view.");
      }

      // And then
      expect([...v]).toEqual(expected);
    });
  },
);

function dataProviderForReadonly(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2'),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview(mask([true, false, true, false, true])),
      [1, 5, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]))
        .subview('1:'),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true]))
        .subview(mask([false, true])),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview(select([0, 2, 4, 6, 8]))
        .subview(select([0, 2, 4]))
        .subview(select([0, 2]))
        .subview(select([1])),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview('::2')
        .subview('::2'),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview('::2')
        .subview('::2')
        .subview('1:'),
      [9],
    ],
  ];
}

function dataProviderForReadonlySubview(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2', true),
      [1, 3, 5, 7, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2', true)
        .subview(mask([true, false, true, false, true])),
      [1, 5, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2')
        .subview(mask([true, false, true, false, true]), true)
        .subview(select([0, 2])),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2', true)
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]), true)
        .subview('1:'),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]), true)
        .subview(mask([true, false, true, false, true]), true)
        .subview(mask([true, false, true]), true)
        .subview(mask([false, true]), true),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]))
        .subview(mask([true, false, true]), true),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview(select([0, 2, 4, 6, 8]))
        .subview(select([0, 2, 4]))
        .subview(select([0, 2]))
        .subview(select([1]), true),
      [9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2')
        .subview('::2', true)
        .subview('::2'),
      [1, 9],
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2')
        .subview('::2')
        .subview('::2')
        .subview('1:', true),
      [9],
    ],
  ];
}

describe.each([
  ...dataProviderForReadonlyError(),
] as Array<[Array<number>, (view: Array<number>) => ArrayView<number>]>)(
  "Array View Readonly Error Test",
  (
    source: Array<number>,
    readonlyViewGetter: (view: Array<number>) => ArrayView<number>,
  ) => {
    it("", () => {
      // Given
      try {
        // When
        readonlyViewGetter(source);
        expect(true).toBe(false);
      } catch (e) {
        // Then
        expect(e instanceof ReadonlyError).toBe(true);
        expect((e as ReadonlyError).message).toEqual("Cannot create non-readonly view for readonly source.");
      }
    });
  },
);

function dataProviderForReadonlyError(): Array<unknown> {
  return [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2', false),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2')
        .subview(mask([true, false, true, false, true]), false),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source)
        .subview('::2', true)
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]), false),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2', false)
        .subview(mask([true, false, true, false, true]))
        .subview(select([0, 2]))
        .subview('1:'),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, false)
        .subview(mask([true, false, true, false, true, false, true, false, true, false]))
        .subview(mask([true, false, true, false, true]), true)
        .subview(mask([true, false, true]), false)
        .subview(mask([false, true])),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, true)
        .subview('::2', false)
        .subview('::2')
        .subview('::2'),
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (source: ArrayView<number>) => view(source, false)
        .subview('::2', true)
        .subview('::2', false)
        .subview('::2', true)
        .subview('1:', false),
    ],
  ];
}
