abstract class ArrayViewSelector<T> {
  public readonly value: T;

  public abstract select<U>(source: ArrayView<U>): ArrayView<U>;

  protected constructor(value: T) {
    this.value = value;
  }
}

export class IndexListSelector extends ArrayViewSelector<Array<number>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayIndexListView<T>(source.loc, this.value);
  }

  constructor(value: Array<number> | ArrayView<number>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

export class CompressSelector extends ArrayViewSelector<Array<boolean>> {
  public select<T>(source: ArrayView<T>): ArrayIndexListView<T> {
    return new ArrayCompressView<T>(source.loc, this.value);
  }

  constructor(value: Array<boolean> | ArrayView<boolean>) {
    super(value instanceof Array ? value : value.toArray());
  }
}

abstract class ArrayView<T> {
  public readonly loc: Array<T>;
  public abstract readonly length: number;

  protected constructor(source: Array<T>, handler: ProxyHandler<Array<T>>) {
    this.loc = new Proxy(source, handler);
  }

  public abstract toArray(): Array<T>;

  public filter(predicate: (value: T) => boolean): ArrayView<T> {
    throw new Error("Method not implemented."); // TODO
  }

  public is(predicate: (value: T) => boolean): CompressSelector {
    throw new Error("Method not implemented."); // TODO
  }

  abstract [Symbol.iterator](): IterableIterator<T>;

  public subview(selector: ArrayViewSelector<any>): ArrayView<T> {
    return selector.select(this);
  }
}

export class ArrayFullView<T> extends ArrayView<T> {
  constructor(source: Array<T>) {
    super(source, {});
  }

  public get length(): number {
    return this.loc.length;
  }

  public toArray(): Array<T> {
    return [...this];
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield *this.loc;
  }
}

export class ArrayIndexListView<T> extends ArrayView<T> {
  public readonly indexes: number[];

  constructor(source: Array<T>, indexes: number[]) {
    super(source, {
      get: (target, prop): T => {
        if (!(prop in this.indexes)) {
          throw new Error(`Invalid index ${String(prop)}`);
        }
        return target[this.indexes[Number(prop)]];
      },
      set: (target, prop, value) => {
        if (!(prop in this.indexes)) {
          throw new Error(`Invalid index ${String(prop)}`);
        }
        target[this.indexes[Number(prop)]] = value;
        return true;
      },
    });
    this.indexes = indexes;
  }

  public toArray(): Array<T> {
    return this.indexes.map((_, i) => this.loc[i]);
  }

  public get length(): number {
    return this.indexes.length;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }
}

export class ArrayCompressView<T> extends ArrayIndexListView<T> {
  public readonly mask: boolean[];

  constructor(source: Array<T>, mask: boolean[]) {
    if (source.length !== mask.length) {
      throw new Error("Invalid mask length");
    }

    const indexes = mask
      .map((v, i) => v ? i : null)
      .filter(v => v !== null) as number[];

    super(source, indexes);
    this.mask = mask;
  }
}

export class ArraySliceView<T> extends ArrayView<T> {
  public readonly start: number;
  public readonly end: number;
  public readonly step: number;

  constructor(source: Array<T>, start: number, end: number, step: number) {
    super(source, {
      get: (target, prop): T => {
        return target[this.convertIndex(Number(prop))];
      },
      set: (target, prop, value) => {
        target[this.convertIndex(Number(prop))] = value;
        return true;
      },
    });
    this.start = start;
    this.end = end;
    this.step = step;
  }

  get length(): number {
    return Math.floor((this.end - this.start) / this.step);
  }

  public toArray(): T[] {
    return [...this]
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.loc[i];
    }
  }

  private convertIndex(i: number): number {
    return this.start + i * this.step;
  }
}
