import Generator from './../src/Generator';
import DateTime from './../src/iterator/DateTime';

const dt = new DateTime(new Date()),
  data = { 'dateTime': dt, 'day': 4, 'weeks': 1 };

let handler1 = Generator.toHandler([ 'every', [[ 'string', true, 0, 'false' ]] ]),
  data1 = handler1(data);
console.log(data1);

let handler2 = Generator.toHandler([ 'in', ['time', [19, 0], 'time', [19, 25]] ]),
  data2 = handler2(data);
console.log(data2.toString());

let handler3 = Generator.toHandler([ 'equal', [ 4, 'day' ] ]),
  data3 = handler3(data);
console.log(data3.toString());

let handler4 = Generator.toHandler([ 'odd', [ 'weeks' ] ]),
  handler5 = Generator.toHandler([ 'not', [ 'numerator' ] ])
  data['numerator'] = handler4(data);
  data5 = handler5(data);
console.log(data3.toString());
