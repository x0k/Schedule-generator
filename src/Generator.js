import DateTimeIterator from './dateTime/dateTimeIterator';
import { deepEqual } from 'fast-equals';

const operations = {
  'get': (name) => data => data[name(data)],
  'getDate': (name) => data => data['dateTime'][name(data)],
  'today': (date) => data => DateTimeIterator.isToday(data['dateTime'], date(data)),
  'before': (value) => data => DateTimeIterator.before(data['dateTime'], value(data)),
  'after': (value) => data => DateTimeIterator.after(data['dateTime'], value(data)),
  'in': (beginDate, endDate) => data => {
    let a = operations.after(beginDate)(data),
      b = operations.before(endDate)(data);
    return a && b;
  },
  'even': (name) => data => data[name(data)] % 2 === 0,
  'odd': (name) => data => data[name(data)] % 2 === 1,
  'time': (h, m) => data => {
    const timeDate = data['dateTime'].toDate();
    timeDate.setHours(h(data), m(data));
    return timeDate;
  },
  'date': (m, d) => data => {
    const date = data['dateTime'].toDate();
    date.setMonth(m(data), d(data));
    return date;
  },
  'fullDate': (y, m, d) => data => {
    const date = data['dateTime'].toDate();
    date.setFullYear(y(data), m(data), d(data));
    return date;
  },
  'map': (...list) => data => {
    let map = {};
    for (let name of list) {
      let eName = name(data);
      map[eName] = data[eName];
    }
    return map;
  },
  'toDate': (number) => data => new Date(number(data)),
  'toBool': (value) => data => {
    let val = value(data);
    return val || val === 0;
  },
  '+': (a, b) => data => a(data) + b(data),
  '-': (a, b) => data => a(data) - b(data),
  '/': (a, b) => data => a(data) / b(data),
  '*': (a, b) => data => a(data) * b(data),
  '=': (a, b) => data => a(data) == b(data),
  '%': (a, b) => data => a(data) % b(data),
  'and': (a, b) => data => a(data) && b(data),
  'or': (a, b) => data => a(data) || b(data),
  'not': (operand) => data => !operand(data),
  'every': (...list) => data => {
    let len = list.length, i = 0;
    while (i < len && operations.toBool(list[i])(data)) {
      i++;
    }
    return i === len ? list : false;
  },
  'any': (...list) => data => {
    for (let item of list) {
      let val = operations.toBool(item)(data);
      if (val) {
        return val;
      }
    }
    return false;
  },
};

class Event {

  constructor (value, dateTime) {
    this._value = value;
    this._points = [ dateTime.toTime() ];
  }

  addPoint (dateTime) {
    this._points.push(dateTime.toTime());
  }

  get value () {
    return this._value;
  }

  get points () {
    return this._points;
  }

}

export default class Generator {

  static toHandler (flow) {
    let get = (array, index) => {
        let el = array[index];
        if (el in operations)
          return operations[el];
        return el;
      },
      isArr = (value) => Array.isArray(value),
      perform = (flow) => {
        let parameters = [];
        for (let i = flow.length - 1; i >= 0; i--) {
          let element = get(flow, i);
          if (isArr(element)) {
            parameters.unshift(perform(element));
          } else if (typeof(element) === 'function') {
            if (isArr(parameters[0])) {
              parameters.unshift(element(...parameters.shift()));
            } else {
              let len = element.length;
              parameters.unshift(len ? element(...parameters.splice(0, len)) : element());
            }
          } else {
            parameters.unshift(() => element);
          }
        }
        return parameters;
      },
      expression = perform(flow)[0];
    return (data) => expression(data);
  }

  constructor () {
    this.iterator = new DateTimeIterator();
    this.events = [];
    this.constraints = {};
  }

  register (dateTime, value) {
    for (let event of this.events) {
      if (deepEqual(event.value, value)) {
        event.addPoint(dateTime);
        return event;
      }
    }
    this.events.push(new Event(value, dateTime));
  }

  async load (schedule) {
    // Load constraints
    this.constraints = schedule.constraints;
    // Load events
    for (let rule of schedule.rules) {
      rule.handler = Generator.toHandler(rule.expression);
      this.iterator.addRule(rule);
    }
    // Load extractor
    let extractor = schedule.extractor,
      extHandler = Generator.toHandler(extractor.expression);
    extractor.id = schedule.name;
    extractor.handler = data => this.register(data['dateTime'], extHandler(data));
    return this.iterator.addRule(extractor);
  }

  async run (start, end) {
    await this.iterator.start(start, end, this.constraints);
    return this.events;
  }

}
