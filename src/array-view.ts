import { ArrayViewConfig } from "./types";

class ExtendableProxy<T extends Object> {
  public readonly target: T;

  constructor(target: T, handler: ProxyHandler<T>) {
    this.target = target;
    return new Proxy(this, {
      set(_, key, value, proxy) {
        if (handler.set === undefined) {
          return false;
        }

        return handler.set(target, key, value, proxy);
      },
      get(object, key, proxy) {
        if (handler.get === undefined) {
          return undefined;
        }

        return handler.get(target, key, proxy);
      }
    });
  }
}

export class ArrayView<T> extends ExtendableProxy<Array<T>> {
  constructor(target: Array<T>, config: ArrayViewConfig<T>) {
    const {
      index,
      readonly = false,
      fixed = false,
      onOutOfRange = () => undefined,
    } = config;

    super(target, {
      get(target, prop) {
        const i = index(Number(prop), target);

        if (i in target) {
          return target[i];
        }

        return onOutOfRange(Number(prop));
      },
      set(target, prop, value): boolean {
        const i = index(Number(prop), target);

        if (readonly) {
          return false;
        }

        if (fixed && !(i in target)) {
          return false;
        }

        target[i] = value;
        return true;
      }
    });
  }
}
