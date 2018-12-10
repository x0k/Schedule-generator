import Generator from './../src/Generator';
import DateTime from './../src/iterator/DateTime';

let handler = Generator.toHandler([ 'every', [[ 'string', true, 0, 'false' ]] ]),
  data = handler({});
console.log(data);
let handler2 = Generator.toHandler([ 'in', ['time', [14, 0], 'time', [14, 25]] ]),
  data2 = handler2({
    'dateTime': new DateTime(new Date())
  });
console.log(data2.toString());
