export interface IAction<T> {
  type: string;
  value: T;
  parent?: IAction<T>;
}

export type TIterator<T> = (initialValue: T, parent?: IAction<T>) => IterableIterator<T>;

export interface ITree<T> extends IAction<T> {
  iterable: TIterator<T>;
  data?: ITree<T>;
}

export type TValue<T> = IterableIterator<IAction<T | false>>;

export function* iterator<T> ({ type, value: initialValue, iterable, data, parent }: ITree<T>): TValue<T> {
  for (const value of iterable(initialValue, parent)) {
    if (data) {
      yield * iterator({ ...data, parent: { type, value, parent } });
    }
    yield { type, value, parent };
  }
  return { type, value: false };
}
