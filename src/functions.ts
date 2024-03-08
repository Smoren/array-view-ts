import { ArrayView } from "./views";

export function view<T>(source: Array<T> | ArrayView<T>): ArrayView<T> {
  return ArrayView.toView(source);
}
