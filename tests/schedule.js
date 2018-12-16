import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import data from '../data/schedule';
import estimated from './estimated';

const beginDate = new Date(2018, 8, 1),
  endDate = new Date(2018, 11, 29);

let gen = new Generator(),
  load = estimated(gen.load, gen),
  run = estimated(gen.run, gen);

load(data)
  .then(event => run(beginDate, endDate))
  .then(groups => Grouper.toList(data.step, groups, true))
  .then(data => Grouper.groupBy('day', data))
  .then(grouped => console.log(grouped));