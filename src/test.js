import Generator from './Generator';
import DateTime from './iterator/DateTime';

let handler = Generator.toHandler([ [ [ 8, 0 ], 'time', [ 9, 30 ], 'time' ], 'in' ]);
console.log(handler({
  'dateTime': new DateTime(new Date())
}));