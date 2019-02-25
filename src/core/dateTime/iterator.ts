export interface IAction<T> {
  type: string;
  value: T;
  prev?: IAction<T>;
}

export type TIterator<T> = (initialValue: T, parent?: IAction<T>) => IterableIterator<T>;

export interface ITree<T> extends IAction<T> {
  iterable: TIterator<T>;
  next?: ITree<T>;
}

export type TValue<T> = IterableIterator<IAction<T | false>>;

export function* iterator<T> ({ type, value: initialValue, iterable, next, prev }: ITree<T>): TValue<T> {
  for (const value of iterable(initialValue, prev)) {
    const now = { type, value, prev };
    if (next) {
      yield * iterator({ ...next, prev: now });
    }
    yield now;
  }
  return { type, value: false, parent };
}
