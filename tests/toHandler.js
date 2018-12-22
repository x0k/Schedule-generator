import Generator from './../src/Generator';
import DateTime from './../src/dateTime/DateTime';

const dt = new DateTime(new Date()),
  data = { 'dateTime': dt, 'day': 4, 'weeks': 1 };

let handler1 = Generator.toHandler([ 'every', [ 'string', true, 0, 'false' ] ]),
  data1 = handler1(data);
console.log(data1);

let handler2 = Generator.toHandler([ 'in', 'time', 18, 0, 'time', 18, 20 ]),
  data2 = handler2(data);
console.log(data2.toString());

let handler3 = Generator.toHandler([ '=', 5, 'day' ], ['day']),
  data3 = handler3(data);
console.log(data3.toString());

let handler4 = Generator.toHandler([ 'any', [
    'today', 'date', 0, 11,
    'today', 'date', 11, 22,
    'today', 'date', 0, 19,
  ] ]),
  data4 = handler4(data);
console.log(data4);
