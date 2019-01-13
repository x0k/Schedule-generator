import { Generator, Grouper } from '../build/index';
import data from '../data/exams';
import time from './time';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20),
  gen = new Generator();

time();
gen.load(data)
  .then(rule => {
    time('Load time');
    return gen.run(beginDate, endDate);
  })
  .then(events => {
    time('Calculation time');
    return Grouper.toList(data.step, events, true);
  })
  .then(data => Grouper.groupBy('day', data))
  .then(grouped => console.log(grouped));