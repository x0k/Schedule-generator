import { getMonthLength } from './dateHelper';
import { iterator, TValue, ITree, IAction } from './iterator';
import { Interpreter, THandler } from '../interpreter';

export interface IConstraint {
  step?: number;
  expression?: any[];
}

export interface IConstraints {
  [name: string]: IConstraint;
}

const toDate = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
  hours: date.getHours(),
  minutes: date.getMinutes(),
});

const toTree = <T>(
  type: string,
  value: T,
  handler: (state: T) => T,
  avaible: (state: T, prev?: IAction<T>) => boolean,
  next?: ITree<T>,
): ITree<T> => ({
  type,
  value,
  *iterable (val, prev): IterableIterator<T> {
    while (avaible(val, prev)) {
      val = handler(val);
      yield val;
    }
  },
  next,
});

export default function* dateTime (begin: Date, end: Date, constraints: IConstraints): TValue<number> {
  const date = toDate(begin);
  const endDate = toDate(end);

  const inc = (val: number) => ++val;

  const minuteTree = toTree('minutes', 0, inc, (val) => val < 60);
  const hourTree = toTree('hour', 0, inc, (val) => val < 24, minuteTree);
  const dayTree = toTree('date', 0, inc, (val, prev) => {
    if (prev && prev.prev) {
      const curentYear = prev.prev.value;
      const curentMonth = prev.value;
      return val < getMonthLength(curentYear, curentMonth);
    }
    return false;
  }, hourTree);
  const monthTree = toTree('month', 0, inc, (val) => val < 12, dayTree);
  const yearTree = toTree('year', 2000, inc, () => true, monthTree);

  const dateTree = toTree('dateTime', date, (state) => {

  },
  (state) => {});
  for (const action of iterator(yearTree)) {
    while ()
      yield action;
  }

}
