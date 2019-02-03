import { Operation } from 'rule-interpreter';
import { isToday, after, before } from './dateTimeHelper';

export interface IValues {
  [name: string]: any;
}

type TAction = (...values: any[]) => any;

interface IActionDescription {
  action: (input: IValues, output: any[]) => TAction;
  arity: number;
}

interface IActions {
  [name: string]: IActionDescription;
}

const actions: IActions = {
  '+': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc + val, a),
    arity: 2,
  },
  '-': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc - val, a),
    arity: 2,
  },
  '/': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc / val, a),
    arity: 2,
  },
  '*': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc * val, a),
    arity: 2,
  },
  '=': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc === val ? acc : false, a),
    arity: 2,
  },
  '%': {
    action: (input, output) => (a, ...b) => b.reduce((acc, val) => acc % val, a),
    arity: 2,
  },
  '!': {
    action: (input, output) => (operand) => !operand,
    arity: 1,
  },
  '&': {
    action: (input, output) => (...list) => {
      const len = list.length;
      let i = 0;
      let result = true;
      while (i < len && result) {
        result = list[i++];
      }
      return i === len ? result : false;
    },
    arity: 0,
  },
  '|': {
    action: (input, output) => (...list) => {
      for (const item of list) {
        const val = item;
        if (val) {
          return val;
        }
      }
      return false;
    },
    arity: 0,
  },
  "get": {
    action: (input, output) => (name) => input[name],
    arity: 1,
  },
  "getDate": {
    action: (input, output) => (name) => input.dateTime.get(name),
    arity: 1,
  },
  "today": {
    action: (input, output) => (date) => isToday(input.dateTime, date),
    arity: 1,
  },
  "before": {
    action: (input, output) => (value) => before(input.dateTime, value),
    arity: 1,
  },
  "after": {
    action: (input, output) => (value) => after(input.dateTime, value),
    arity: 1,
  },
  "in": {
      action: (input, output) => (beginDate: any, endDate: any) => {
      const a = actions.after.action(input, output)(beginDate);
      const b = actions.before.action(input, output)(endDate);
      return a && b;
    },
    arity: 2,
  },
  "even": {
    action: (input, output) => (name) => input[name] % 2 === 0,
    arity: 1,
  },
  "odd": {
    action: (input, output) => (name) => input[name] % 2 === 1,
    arity: 1,
  },
  "time": {
    action: (input, output) => (h: any, m: any) => {
      const timeDate = input.dateTime.toDate();
      timeDate.setHours(h, m);
      return timeDate;
    },
    arity: 2,
  },
  "date": {
    action: (input, output) => (m: any, d: any) => {
      const date = input.dateTime.toDate();
      date.setMonth(m, d);
      return date;
    },
    arity: 2,
  },
  "fullDate": {
    action: (input, output) => (y: any, m: any, d: any) => {
      const date = input.dateTime.toDate();
      date.setFullYear(y, m, d);
      return date;
    },
    arity: 3,
  },
  "toDate": {
    action: (input, output) => (num) => new Date(num),
    arity: 1,
  },
  "toBool": {
    action: (input, output) => (value) => {
      const val = value;
      return val || val === 0;
    },
    arity: 1,
  },
  "every": {
    action: (input, output) => (...list) => {
      const len = list.length;
      let i = 0;
      while (i < len && actions.toBool.action(input, output)(list[i])) {
        i++;
      }
      return i === len ? list : false;
    },
    arity: 0,
  },
  "any": {
    action: (input, output) => (...list) => {
      for (const item of list) {
        const val = actions.toBool.action(input, output)(item);
        if (val) {
          return list;
        }
      }
      return false;
    },
    arity: 0,
  },
  "save" : {
    action: (input, output) => (item) => output.push([input.dateTime.toTime(), item]),
    arity: 1,
  },
};

class DateOperation extends Operation<any> {

  public eval (...values: any[]) {
    return (input: IValues, output: any[]) => super.eval(input, output, ...values);
  }

  protected evaluator (action: TAction, input: IValues, output: any[], ...values: any[]) {
    return super.evaluator(action(input, output), ...values.map((val) => val(input, output)));
  }

}

export interface IOprations {
  [name: string]: DateOperation;
}

const operations: IOprations = {};

for (const key of Object.keys(actions)) {
  const { action, arity } = actions[key];
  operations[key] = new DateOperation(key, action, arity);
}

export { operations };
