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
  'every': list => list.every(operations.toBool),
  'any': list => list.some(operations.toBool),
};

export default class Generator {

  static toHandler (flow) {
    let len = (array) => array.length - 1,
      last = (array) => array[len(array)],
      add = (array, value) => array.push(value),
      isFun = (value) => typeof value === 'function' || value in operations,
      isArr = (value) => Array.isArray(value),
      memorize = (flow) => {
        let result = [];
        for (let i = 0; i < flow.length; i++) {
          let el = flow[i];
          if (el in operations) {
            el = operations[el];
          }
          while (isFun(el) && i < flow.length && !isFun(flow[i+1]) && !isArr(flow[i+1])) {
            el = el(flow[++i]);
          }
          if (isArr(el)) {
            el = memorize(el);
          }
          add(result, el);
        }
        return result;
      },
      memory = memorize(flow),
      solve = (flow, data) => {
        let result = [];
        for (let i = len(flow); i >= 0; i--) {
          let el = flow[i];
          if (isFun(el)) {
            let params = isArr(last(result)) ? result.pop() : result;
            while (params.length && isFun(el) && !isFun(last(flow))) {
              el = el(params.pop());
            }
            if (!params.length && isFun(el)) {
              el = el(data);
            }
          }
          if (isArr(el)) {
            el = solve(el, data);
          }
          add(result, el);
        }
        return result;
      };
    return (data) => last(solve(memory, data));
  }

  constructor () {
    this.iterator = new DateTimeIterator();
  }

  load (events) {
    for (let event of events) {
      event.handler = Generator.toHandler(event.flow);
      if (event.result) {
        event.value = Generator.toHandler(event.result);
      }
      this.iterator.addListner(event);
    }
  }

  run (begin, end, event) {
    const data = [];
    this.iterator.addListner({
      name: 'solver',
      require: [event],
      handler: value => data.push(value[event]),
    });
    this.iterator.start(begin, end);
    return data;
  }

}
