import Generator from '../src/Generator';
import data from '../data/schedule';
import estimated from './estimated';

const beginDate = new Date(2018, 11, 3),
  endDate = new Date(2018, 11, 29);

let gen = new Generator(),
  run = estimated(gen.run, gen);

gen.load(data)
  .then(gen => run(beginDate, endDate, 600000))
  //.then(groups => console.log(groups));
//from 41.35 to 2.03