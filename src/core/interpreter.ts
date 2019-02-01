import { Interpreter } from 'rule-interpreter';
import { isToday, after, before } from './dateTimeHelper';

export interface IValues {
  [name: string]: any;
}

type Getter = (input: IValues, outpur: any[]) => any;

type Operation = (...values: Getter[]) => Getter;

interface IOperations {
  [name: string]: Operation;
}

const operations: IOperations = {
  get: (name: Getter) => (input: IValues, output: any[]) => input[name(input, output)],
  getDate: (name: Getter) => (input: IValues, output: any[]) => input.dateTime.get(name(input, output)),
  today: (date: Getter) => (input: IValues, output: any[]) => isToday(input.dateTime, date(input, output)),
  before: (value: Getter) => (input: IValues, output: any[]) => before(input.dateTime, value(input, output)),
  after: (value: Getter) => (input: IValues, output: any[]) => after(input.dateTime, value(input, output)),
  in: (beginDate: Getter, endDate: Getter) => (input: IValues, output: any[]) => {
    const a = operations.after(beginDate)(input, output);
    const b = operations.before(endDate)(input, output);
    return a && b;
  },
  even: (name: Getter) => (input: IValues, output: any[]) => input[name(input, output)] % 2 === 0,
  odd: (name: Getter) => (input: IValues, output: any[]) => input[name(input, output)] % 2 === 1,
  time: (h: Getter, m: Getter) => (input: IValues, output: any[]) => {
    const timeDate = input.dateTime.toDate();
    timeDate.setHours(h(input, output), m(input, output));
    return timeDate;
  },
  date: (m: Getter, d: Getter) => (input: IValues, output: any[]) => {
    const date = input.dateTime.toDate();
    date.setMonth(m(input, output), d(input, output));
    return date;
  },
  fullDate: (y: Getter, m: Getter, d: Getter) => (input: IValues, output: any[]) => {
    const date = input.dateTime.toDate();
    date.setFullYear(y(input, output), m(input, output), d(input, output));
    return date;
  },
  toDate: (num: Getter) => (input: IValues, output: any[]) => new Date(num(input, output)),
  toBool: (value: Getter) => (input: IValues, output: any[]) => {
    const val = value(input, output);
    return val || val === 0;
  },
  every: (...list: Getter[]) => (input: IValues, output: any[]) => {
    const len = list.length;
    let i = 0;
    while (i < len && operations.toBool(list[i])(input, output)) {
      i++;
    }
    return i === len ? list : false;
  },
  any: (...list: Getter[]) => (input: IValues, output: any[]) => {
    for (const item of list) {
      const val = operations.toBool(item)(input, output);
      if (val) {
        return list;
      }
    }
    return false;
  },
  save : (item: Getter) => (input: IValues, output: any[]) => {
    return output.push([input.dateTime.toTime(), item(input, output)]);
  },
};

export class CustomInterpreter extends Interpreter {

  constructor (input: IValues, output: any) {
    super(input, output);
    for (const key of Object.keys(operations)) {
      super.addOperations(key, operations[key]);
    }
  }

}
