import Generator from './../src/Generator';
import DateTime from './../src/iterator/DateTime';

let handler = Generator.toHandler2([ 'every', [[ 'string', true, 0, 'false' ]] ]),
  data = handler({});
console.log(data);
let handler2 = Generator.toHandler2([ 'in', ['time', [3, 0], 'time', [3, 50]] ]),
  data2 = handler2({
    'dateTime': new DateTime(new Date())
  });
console.log(data2.toString());
