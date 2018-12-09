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
  '+': a => b => a + b,
  '-': a => b => a - b,
  '/': a => b => a / b,
  '*': a => b => a * b,
  '=': a => b => a == b,
  'and': a => b => a && b,
  'or': a => b => a || b,
  'not': operand => !operand,
  'every': list => list.every(value => !!value || value === 0),
  'any': list => list.some(value => !!value || value === 0),
};

export default class Generator {

  static toHandler (flow) {
    let len = (array) => array.length - 1,
      first = (array) => array[0],
      last = (array) => array[len(array)],
      ext = (array) => array.shift(),
      del = (array) => array.pop(),
      add = (array, value) => array.push(value),
      isFun = (value) => typeof value === 'function',
      isArr = (value) => Array.isArray(value),
      isMem = (element, params) => params.length && isFun(element) && !isFun(first(params)),
      params = (flow, data) => {
        let result = [];
        for (let element of flow) {
          if (isArr(element)) {
            add(result, params(element, data));
          } else {
            if (element in operations) {
              element = operations[element];
            }
            if (typeof(element) === 'function') {
              let params = last(result);
              if (data) {
                add(params, data);
              }
              while (isMem(element, params) && (!isArr(first(params)) || data)) {
                element = element(ext(params));
              }
              if (typeof(element) !== 'function') {
                del(result);
              }
            }
            add(result, element);
          }
        }
        return result;
      },
      instructions = params(flow);
    return (data) => last(params(instructions, data));
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
