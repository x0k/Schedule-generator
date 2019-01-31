import { Loader, Grouper } from '../build/index';
import data from './data/exams';
import time from './time';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20),
  loader = new Loader(),
  groupBy = 'day';

time();
loader.load(data)
  .then(gen => gen.run(beginDate, endDate))
  .then(data => Grouper.createEvents(data))
  .then(events => Grouper.toList({
    events,
    constraints: data.constraints,
    from: beginDate,
    to: endDate,
  }))
  .then(data => Grouper.groupBy(groupBy, data))
  .then(groups => {
    time('Done');
    for (let group of groups) {
      console.log(Grouper.headerPartionToString(groupBy, new Date(group.start)))
      for (let item of group.items) {
        console.log('  ', Grouper.periodToString(groupBy, item));
        console.log('  ', item.value);
      }
    }
  });