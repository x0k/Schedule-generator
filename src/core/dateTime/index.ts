import { getMonthLength } from './dateHelper';
import { iterator, TValue, ITree, IAction } from './iterator';
import { Interpreter, THandler } from '../interpreter';
import { actions } from '../interpreter/actions';

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

type THandler<T> = (value: T, prev?: IAction<T>) => T;
type TAvaible<T> = (value: T, prev?: IAction<T>) => boolean;

const toTree = <T>(
  type: string,
  value: T,
  handler: THandler<T>,
  avaible: TAvaible<T>,
  next?: ITree<T>,
): ITree<T> => ({
  type,
  value,
  *iterable (initialValue, prev): IterableIterator<T> {
    while (avaible(initialValue, prev)) {
      yield handler(initialValue, prev);
    }
  },
  next,
});

interface IDate {
  name: string;
  initialValue: number;
  avaible: TAvaible<number>;
  next?: IDate;
}

export default function* dateTime (begin: Date, end: Date, constraints: IConstraints): TValue<number> {
  const { year, month, day, hours, minutes } = toDate(begin);
  const endDate = toDate(end);

  const state: { [name: string]: any } = { };

  const getter = <T>(name: string, action: THandler<T> | TAvaible<T>) =>
    (initialValue: T, prev?: IAction<T>) =>
      action(name in state ? state[name] : initialValue, prev);

  const inc = (val: number) => ++val;

  const lim = (limit: number) => (val: number) => val < limit;

  const date: IDate = {
    name: 'hour',
    initialValue: hours,
    avaible: lim(24),
    next: {
      name: 'minute',
      initialValue: minutes,
      avaible: lim(60),
    },
  };

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
