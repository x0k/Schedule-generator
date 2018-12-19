import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import data from '../data/exams';
import time from './time';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20),
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
  .then(data => Grouper.groupBy('day', data))
  .then(grouped => console.log(grouped));