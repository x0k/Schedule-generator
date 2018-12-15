import Generator from '../src/Generator';
import data from '../data/schedule';
import estimated from './estimated';

const beginDate = new Date(2018, 11, 3),
  endDate = new Date(2018, 11, 29);

let gen = new Generator(),
  load = estimated(gen.load, gen),
  run = estimated(gen.run, gen);

load(data)
  .then(gen => run(beginDate, endDate))
  .then(groups => console.log(groups));