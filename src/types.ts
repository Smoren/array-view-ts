export type RecordKey = string | number | symbol;

export type ArrayViewConfig<T> = {
  index: (i: number, target: Array<T>) => number;
  readonly?: boolean;
  fixed?: boolean;
  onOutOfRange?: (i: number) => T | undefined;
};
