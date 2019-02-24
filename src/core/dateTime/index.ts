import { getMonthLength } from './dateHelper';
import { iterator, TValue, IIteratorArgs, ITree, IAction } from './iterator';
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
  avaible: (state: T, parent?: IAction<T>) => boolean,
  data?: ITree<T>,
): ITree<T> => ({
  type,
  value,
  *iterable (val, parent): IterableIterator<T> {
    while (avaible(val, parent)) {
      val = handler(val);
      yield val;
    }
  },
  data,
});

export default function* dateTime (begin: Date, end: Date, constraints: IConstraints): TValue<number> {
  let { year, month, day, hours, minutes } = toDate(begin);
  const { year: eYear, month: eMonth, day: eDay, hours: eHours, minutes: eMinutes } = toDate(end);

  const minuteTree = toTree('minutes', minutes, (val) => ++val, (val) => val < 60);
  const hourTree = toTree('hour', hours, (val) => ++val, (val) => val < 24, minuteTree);

}
