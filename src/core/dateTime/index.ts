import { getMonthLength } from './dateHelper';
import { iterator, TValue, IIterable, IAction } from './iterator';
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

type THandler<T> = (value: T) => T;
type TAvaible<T> = (value: T) => boolean;

const toIterable = <T>(
  type: string,
  value: T,
  defaultValue: T,
  handler: THandler<T>,
  avaible: TAvaible<T>,
  next?: IIterable<T>,
): IIterable<T> => ({
  type,
  value,
  *iterable (initialValue): IterableIterator<T> {
    while (avaible(initialValue)) {
      yield handler(initialValue);
    }
    yield defaultValue;
  },
  next,
});

interface IDate {
  name: string;
  initialValue: number;
  handler: THandler<number>;
  avaible: TAvaible<number>;
  next?: IDate;
}

const buildBinder = <T>(state: { [name: string]: T }) => (name: string, action: THandler<T> | TAvaible<T>) =>
  (initialValue: T) =>
    action(name in state ? state[name] : initialValue);

type TBinder<T> = (name: string, action: THandler<T> | TAvaible<T>) => (initialValue: T) => T;

const buildTree = (date: IDate, bind: TBinder<any>): IIterable<any> => {
  const next = date.next ? buildTree(date.next, bind) : undefined;
  return toIterable(
    date.name,
    date.initialValue,
    0,
    bind(date.name, date.handler),
    bind(date.name, date.avaible),
    next,
  );
};

export default function* dateTime (begin: Date, end: Date, constraints: IConstraints): TValue<number> {
  const { year, month, day, hours, minutes } = toDate(begin);
  const endDate = toDate(end);

  const state: { [name: string]: any } = { };
  const binder = buildBinder(state);

  const inc = (val: number) => ++val;
  const lim = (limit: number) => (val: number) => val < limit;

  const date: IDate = {
    name: 'year',
    initialValue: year,
    handler: inc,
    avaible: lim(Number.MAX_VALUE),
    next: {
      name: 'month',
      initialValue: month,
      handler: inc,
      avaible: lim(12),
      next: {
        name: 'date',
        initialValue: day,
        handler: inc,
        avaible: (val) => val < getMonthLength(state.year, state.month),
        next: {
          name: 'hour',
          initialValue: hours,
          handler: inc,
          avaible: lim(24),
          next: {
            name: 'minute',
            initialValue: minutes,
            handler: inc,
            avaible: lim(60),
          },
        },
      },
    },
  };

  const tree = buildTree(date, binder);

}
