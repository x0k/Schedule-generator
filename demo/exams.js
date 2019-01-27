import { Loader, Grouper } from '../build/index';
import data from './data/exams';
import time from './time';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20),
  loader = new Loader();

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
  .then(data => Grouper.groupBy('day', data))
  .then(grouped => console.log(grouped));