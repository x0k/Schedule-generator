import Generator from '../src/Generator';
import data from '../data/exams';
import estimated from './estimated';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20);

let gen = new Generator(),
  run = estimated(gen.run, gen);

gen.load(data)
  .then(gen => run(beginDate, endDate, 600000))
  //.then(groups => console.log(groups));