import DateTime from './Events/DateTime/DateTime';
import DateTimeIterator from './Events/DateTime/DateTimeIterator';
import Grouper from './Grouper';
// Data
import Days from './Events/Days';
import Periods from './Events/Periods';
import Calls from './Events/Calls';
import Subjects from './Events/Subjects';

const iterator = new DateTimeIterator(),
  begin = new Date(2018, 8, 1),
  end = new Date(2018, 11, 29),
  grouper = new Grouper(begin, 'minutes');
iterator.load([
  ...Days,
  ...Periods,
  ...Calls,
  ...Subjects,
  {
    event: 'minutes',
    name: 'logger',
    require: ['subjects'],
    handler: (dt, v) => {
      grouper.add(v.subjects);
    },
  },
]);
iterator.start(begin, end);
grouper.print();
