import DateTimeIterator from './iterator/DateTimeIterator';

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

  constructor () {
    this.iterator = new DateTimeIterator();
  }

  async load (events) {
    for (let event of events) {
      event.handler = Generator.toHandler(event.flow);
      if (event.result) {
        if (Array.isArray(event.result)) {
          event.value = Generator.toHandler(event.result);
        } else {
          event.value = () => event.result;
        }
      }
      this.iterator.addEvent(event);
    }
    return this;
  }

  async run (begin, end, partion, action) {
    this.iterator.addEvent({
      name: 'solver',
      require: [ partion ],
      handler: action,
    });
    await this.iterator.start(begin, end);
    return this;
  }

}
