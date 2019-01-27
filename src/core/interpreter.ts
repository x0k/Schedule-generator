import { RuleHandler, IHandlerBuilder } from './rule';
import { isToday, after, before } from './dateTimeHelper';

export interface IValues {
  [name: string]: any;
}

type Getter = (data: IValues) => any;

type Operation = (...values: Getter[]) => Getter;

interface IOperations {
  [name: string]: Operation;
}

export class Interpreter implements IHandlerBuilder {

  private input: IValues;
  private out: any[];
  private operations: IOperations = {
    'get': (name: Getter) => () => this.input[name(this.input)],
    'getDate': (name: Getter) => () => this.input.dateTime.get(name(this.input)),
    'today': (date: Getter) => () => isToday(this.input.dateTime, date(this.input)),
    'before': (value: Getter) => () => before(this.input.dateTime, value(this.input)),
    'after': (value: Getter) => () => after(this.input.dateTime, value(this.input)),
    'in': (beginDate: Getter, endDate: Getter) => () => {
      const a = this.operations.after(beginDate)(this.input);
      const b = this.operations.before(endDate)(this.input);
      return a && b;
    },
    'even': (name: Getter) => () => this.input[name(this.input)] % 2 === 0,
    'odd': (name: Getter) => () => this.input[name(this.input)] % 2 === 1,
    'time': (h: Getter, m: Getter) => () => {
      const timeDate = this.input.dateTime.toDate();
      timeDate.setHours(h(this.input), m(this.input));
      return timeDate;
    },
    'date': (m: Getter, d: Getter) => () => {
      const date = this.input.dateTime.toDate();
      date.setMonth(m(this.input), d(this.input));
      return date;
    },
    'fullDate': (y: Getter, m: Getter, d: Getter) => () => {
      const date = this.input.dateTime.toDate();
      date.setFullYear(y(this.input), m(this.input), d(this.input));
      return date;
    },
    'map': (...list: Getter[]) => () => {
      const map: { [name: string]: any } = {};
      for (const name of list) {
        const eName = name(this.input);
        map[eName] = this.input[eName];
      }
      return map;
    },
    'toDate': (num: Getter) => () => new Date(num(this.input)),
    'toBool': (value: Getter) => () => {
      const val = value(this.input);
      return val || val === 0;
    },
    '+': (a: Getter, ...b: Getter[]) => () => b.reduce((acc, val) => acc + val(this.input), a(this.input)),
    '-': (a: Getter, ...b: Getter[]) => () => b.reduce((acc, val) => acc - val(this.input), a(this.input)),
    '/': (a: Getter, ...b: Getter[]) => () => b.reduce((acc, val) => acc / val(this.input), a(this.input)),
    '*': (a: Getter, ...b: Getter[]) => () => b.reduce((acc, val) => acc * val(this.input), a(this.input)),
    '=': (a: Getter, ...b: Getter[]) => () => b.reduce(
      (acc, val) => acc === val(this.input) ? acc : false,
      a(this.input),
    ),
    '%': (a: Getter, ...b: Getter[]) => () => b.reduce((acc, val) => acc % val(this.input), a(this.input)),
    'not': (operand: Getter) => () => !operand(this.input),
    'and': (...list: Getter[]) => () => {
      const len = list.length;
      let i = 0;
      while (i < len && this.operations.toBool(list[i])(this.input)) {
        i++;
      }
      return i === len ? list[len - 1](this.input) : false;
    },
    'or': (...list: Getter[]) => () => {
      for (const item of list) {
        const val = this.operations.toBool(item)(this.input);
        if (val) {
          return val;
        }
      }
      return false;
    },
    'every': (...list: Getter[]) => () => {
      const len = list.length;
      let i = 0;
      while (i < len && this.operations.toBool(list[i])(this.input)) {
        i++;
      }
      return i === len ? list : false;
    },
    'any': (...list: Getter[]) => () => {
      for (const item of list) {
        const val = this.operations.toBool(item)(this.input);
        if (val) {
          return list;
        }
      }
      return false;
    },
    'save' : (item: Getter) => () => this.out.push([this.input.dateTime.toTime(), item(this.input)]),
  };

  constructor (input: IValues, out: any[]) {
    this.input = input;
    this.out = out;
  }

  public toHandler (handlerFlow: any[]): RuleHandler {
    const get = (array: any[], index: number) => {
        const el = array[index];
        if (el in this.operations) {
          return this.operations[el];
        }
        return el;
      };
    const isArr = (value: any) => Array.isArray(value);
    const perform = (flow: any[]): Getter => {
      const parameters: any[] = [];
      for (let i = flow.length - 1; i >= 0; i--) {
        const element = get(flow, i);
        if (isArr(element)) {
          parameters.unshift(perform(element));
        } else if (typeof(element) === 'function') {
          if (isArr(parameters[0])) {
            parameters.unshift(element(...parameters.shift()));
          } else {
            const len = element.length;
            parameters.unshift(len ? element(...parameters.splice(0, len)) : element());
          }
        } else {
          parameters.unshift(() => element);
        }
      }
      return parameters.length === 1 ? parameters[0] : parameters;
    };
    const expression = perform(handlerFlow);
    return () => expression(this.input);
  }

}
