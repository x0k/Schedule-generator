import Calls from './Events/Calls';
import DateTime from './Events/DateTime/DateTime';
import DateTimeIterator from './Events/DateTime/DateTimeIterator';
import Days from './Events/Days';
import Periods from './Events/Periods';
import Subjects from './Events/Subjects';
import Grouper from './Grouper';

const iterator = new DateTimeIterator(),
  begin = new Date(2018, 10, 12, 8), // new Date(2018, 8, 1),
  end = new Date(2018, 11, 29),
  grouper = new Grouper(begin, 'minutes'),
  listners = {};
// Global events
Object.assign(listners, Days, Periods, Calls);
// Schedule events
Object.assign(listners, Subjects, {
  logger: {
    require: ['subjects'],
    handler: (v) => grouper.add(v),
  },
});
for (const name of Object.keys(listners)) {
  iterator.addListner(name, listners[name]);
}
iterator.start(begin, end);
grouper.print();
