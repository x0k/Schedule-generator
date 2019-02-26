export interface IAction<T> {
  type: string;
  value: T;
}

export type TIterator<T> = (initialValue: T) => IterableIterator<T>;

export interface IIterable<T> extends IAction<T> {
  iterable: TIterator<T>;
  next?: IIterable<T>;
}

export type TValue<T> = IterableIterator<IAction<T | false>>;

export function* iterator<T> ({ type, value: initialValue, iterable, next }: IIterable<T>): TValue<T> {
  for (const value of iterable(initialValue)) {
    const now = { type, value };
    if (next) {
      yield * iterator(next);
    }
    yield now;
  }
  return { type, value: false };
}
