import { deepEqual } from 'fast-equals';
import { RuleHandler } from './rules/rule';
import { DateTimeIterator } from './dateTime/dateTimeIterator';
import { Event } from './event';
import { IConstraints, DateTime } from './dateTime/dateTime';
import { ISchedule } from './schedule';

export interface IValues {
  [name: string]: any;
}

type Getter = (data: IValues) => any;

interface IOperations {
  [name: string]: (...values: Getter[]) => Getter;
}

const operations: IOperations = {
  'get': (name: Getter) => (data: IValues) => data[name(data)],
  'getDate': (name: Getter) => (data: IValues) => data.dateTime.get(name(data)),
  'today': (date: Getter) => (data: IValues) => DateTimeIterator.isToday(data.dateTime, date(data)),
  'before': (value: Getter) => (data: IValues) => DateTimeIterator.before(data.dateTime, value(data)),
  'after': (value: Getter) => (data: IValues) => DateTimeIterator.after(data.dateTime, value(data)),
  'in': (beginDate: Getter, endDate: Getter) => (data: IValues) => {
    const a = operations.after(beginDate)(data);
    const b = operations.before(endDate)(data);
    return a && b;
  },
  'even': (name: Getter) => (data: IValues) => data[name(data)] % 2 === 0,
  'odd': (name: Getter) => (data: IValues) => data[name(data)] % 2 === 1,
  'time': (h: Getter, m: Getter) => (data: IValues) => {
    const timeDate = data.dateTime.toDate();
    timeDate.setHours(h(data), m(data));
    return timeDate;
  },
  'date': (m: Getter, d: Getter) => (data: IValues) => {
    const date = data.dateTime.toDate();
    date.setMonth(m(data), d(data));
    return date;
  },
  'fullDate': (y: Getter, m: Getter, d: Getter) => (data: IValues) => {
    const date = data.dateTime.toDate();
    date.setFullYear(y(data), m(data), d(data));
    return date;
  },
  'map': (...list: Getter[]) => (data: IValues) => {
    const map: { [name: string]: any } = {};
    for (const name of list) {
      const eName = name(data);
      map[eName] = data[eName];
    }
    return map;
  },
  'toDate': (num: Getter) => (data: IValues) => new Date(num(data)),
  'toBool': (value: Getter) => (data: IValues) => {
    const val = value(data);
    return val || val === 0;
  },
  '+': (a: Getter, b: Getter) => (data: IValues) => a(data) + b(data),
  '-': (a: Getter, b: Getter) => (data: IValues) => a(data) - b(data),
  '/': (a: Getter, b: Getter) => (data: IValues) => a(data) / b(data),
  '*': (a: Getter, b: Getter) => (data: IValues) => a(data) * b(data),
  '=': (a: Getter, b: Getter) => (data: IValues) => a(data) === b(data),
  '%': (a: Getter, b: Getter) => (data: IValues) => a(data) % b(data),
  'and': (a: Getter, b: Getter) => (data: IValues) => a(data) && b(data),
  'or': (a: Getter, b: Getter) => (data: IValues) => a(data) || b(data),
  'not': (operand: Getter) => (data: IValues) => !operand(data),
  'every': (...list: Getter[]) => (data: IValues) => {
    const len = list.length;
    let i = 0;
    while (i < len && operations.toBool(list[i])(data)) {
      i++;
    }
    return i === len ? list : false;
  },
  'any': (...list: Getter[]) => (data: IValues) => {
    for (const item of list) {
      const val = operations.toBool(item)(data);
      if (val) {
        return val;
      }
    }
    return false;
  },
};

export class Generator {

  public static toHandler (handlerFlow: any[]): RuleHandler {
    const get = (array: any[], index: number) => {
        const el = array[index];
        if (el in operations) {
          return operations[el];
        }
        return el;
      };
    const isArr = (value: any) => Array.isArray(value);
    const perform = (flow: any[]): Getter[] => {
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
      return parameters;
    };
    const expression = perform(handlerFlow)[0];
    return (data: IValues) => expression(data);
  }

  private iterator: DateTimeIterator = new DateTimeIterator();
  private events: Event[] = [];
  private constraints: IConstraints = {};

  public register (dateTime: DateTime, value: any) {
    for (const event of this.events) {
      if (deepEqual(event.value, value)) {
        event.addPoint(dateTime);
        return event;
      }
    }
    this.events.push(new Event(value, dateTime));
  }

  public async load (schedule: ISchedule) {
    // Load constraints
    this.constraints = schedule.constraints;
    for (const key of Object.keys(this.constraints)) {
      const expression = schedule.constraints[key].expression;
      if (expression) {
        this.constraints[key].handler = Generator.toHandler(expression);
      }
    }
    // Load events
    for (const rule of schedule.rules) {
      rule.handler = Generator.toHandler(rule.expression);
      this.iterator.createRule(rule);
    }
    // Load extractor
    return this.iterator.createRule({
      id: schedule.name,
      require: [ 'year', 'month', 'date', 'week', 'day', 'hour', 'minute', schedule.extractor ],
      handler: (values) => this.register(values.dateTime, values[schedule.extractor]),
    });
  }

  public async run (start: Date, end: Date) {
    await this.iterator.start(start, end, this.constraints);
    return this.events;
  }

}
