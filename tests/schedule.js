import Generator from '../src/generator';
import Grouper from '../src/grouper';
import data from '../data/schedule';
import time from './time';

const beginDate = new Date(2018, 8, 1),
  endDate = new Date(2018, 11, 29),
  gen = new Generator();

time();
gen.load(data)
  .then(event => {
    time('Load time');
    return gen.run(beginDate, endDate);
  })
  .then(groups => {
    time('Calculation time');
    return Grouper.toList(data.step, groups, true);
  })
  .then(data => {
    time('Grouping time');
    return Grouper.groupBy('day', data);
  })
  .then(grouped => console.log(grouped));