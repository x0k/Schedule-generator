import DateTimeIterator from './DateTimeIterator';
import Grouper from './Grouper';

const operations = {
  // Data depended
  'get': name => data => data[name],
  'equal': value => name => data => data[name] === value,
  'today': date => data => data['dateTime'].isToday(date),
  'before': value => data => data['dateTime'].before(value),
  'after': value => data => data['dateTime'].after(value),
  'in': beginDate => endDate => data => operations.after(beginDate)(data) && operations.before(endDate)(data),
  'even': name => data => data[name] % 2 === 0,
  'odd': name => data => data[name] % 2 === 1,
  'time': h => m => data => {
    const timeDate = data['dateTime'].toDate();
    timeDate.setHours(h, m);
    return timeDate;
  },
  'date': m => d => data => {
    const date = data['dateTime'].toDate();
    date.setMonth(m - 1, d);
    return date;
  },
  'fullDate': y => m => d => data => {
    const date = data['dateTime'].toDate();
    date.setFullYear(y, m - 1, d);
    return date;
  },
  'map': list => data => {
    let map = {};
    for (let name of list) {
      map[name] = data[name];
    }
    return map;
  },
  // Data independent
  'toDate': number => new Date(number),
  'toBool': value => value || value === 0,
  '+': a => b => a + b,
  '-': a => b => a - b,
  '/': a => b => a / b,
  '*': a => b => a * b,
  '=': a => b => a == b,
  'and': a => b => a && b,
  'or': a => b => a || b,
  'not': operand => !operand,
  'every': list => {
    if (list.every(operations.toBool)) {
      return list;
    }
    return false;
  },
  'any': list => {
    for (let el of list) {
      if (operations.toBool(el)) {
        return el;
      }
    }
    return false;
  },
};

export default class Generator {

  static toHandler (flow) {
    let len = (array) => array.length - 1,
      first = (array) => array[0],
      add = (array, ...values) => array.push(...values),
      pre = (array, ...values) => array.unshift(...values),
      get = (array, index) => {
        let el = array[index];
        if (el in operations)
          return operations[el];
        return el;
      },
      isFun = (value) => typeof value === 'function',
      isArr = (value) => Array.isArray(value),
      perform = (flow, data) => {
        let result = [];
        for (let i = len(flow); i >= 0; i--) {
          let el = get(flow, i);
          if (isArr(el)) {
            add(result, perform(el, data));
          } else {
            let params;
            if (isFun(el) && result.length) {
              params = result.pop();
              while (params.length && isFun(el) && !isFun(first(params)) && (!isArr(first(params)) || data)) {
                let ps = params.shift();
                el = el(ps);
              }
            }
            if (isFun(el) && params) {
              if (data) {
                add(result, el(data));
              } else {
                add(result, el, params);
              }
            } else {
              pre(result, el);
            }
          }
        }
        return result;
      },
      memory = perform(flow);
    return (data) => first(perform(memory, data));
  }

  static toEvent (data) {
    data.handler = Generator.toHandler(data.flow);
    if (data.result) {
      if (Array.isArray(data.result)) {
        data.value = Generator.toHandler(data.result);
      } else {
        data.value = () => data.result;
      }
    }
    return data;
  }

  constructor (partion) {
    this.iterator = new DateTimeIterator(partion);
    this.grouper = new Grouper(data => data['extractor']);
    this.partion = partion;
  }

  async load (schedule) {
    for (let data of schedule.events) {
      let event = Generator.toEvent(data);
      await this.iterator.addEvent(event);
    }
    let extractor = Generator.toEvent(schedule.extractor);
    await this.iterator.addEvent(extractor);
    return this;
  }

  async run (start, end) {
    this.iterator.addEvent({
      name: 'grouper',
      require: [ this.partion, 'extractor' ],
      handler: data => this.grouper.register(data),
    });
    await this.iterator.start(start, end);
    return this.grouper.groups;
  }

}
