import DateTimeIterator from './iterator/DateTimeIterator';

const operations = {
  // Data depended
  'before': value => data => data['dateTime'].before(value),
  'after': value => data => data['dateTime'].after(value),
  'in': beginDate => endDate => data => operations.after(beginDate)(data) && operations.before(endDate)(data),
  'time': h => m => data => {
    const timeDate = data['dateTime'].toDate();
    timeDate.setHours(h, m);
    return timeDate;
  },
  'date': number => new Date(number),
  '+': a => b => a + b,
  '-': a => b => a - b,
  '/': a => b => a / b,
  '*': a => b => a * b,
  'and': a => b => a && b,
  'or': a => b => a || b,
  'not': operand => !operand,
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
              while (params.length && isFun(element) && !isFun(first(params)) && !isArr(first(params))) {
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
    return (data) => params(instructions, data)[0];
  }

  constructor () {
    this.iterator = new DateTimeIterator();
  }

  load (events) {
    for (let event of events) {
      event.handler = Generator.toHandler(event.flow);
      this.iterator.addListner(event);
    }
  }

  run (begin, end, event) {
    const data = [];
    this.iterator.addListner('solver', {
      require: [event],
      handler: value => data.push(value),
    });
    this.iterator.start(begin, end);
    return data;
  }

}
