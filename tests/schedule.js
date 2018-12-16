import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import data from '../data/schedule';
import estimated from './estimated';

const beginDate = new Date(2018, 8, 1),
  endDate = new Date(2018, 11, 29);

let gen = new Generator(),
  gp = new Grouper(data.step),
  load = estimated(gen.load, gen),
  run = estimated(gen.run, gen);

load(data)
  .then(event => run(beginDate, endDate))
  .then(groups => gp.toList(groups))
  .then(data => data.filter(el => el.value))
  .then(filtered => console.log(filtered));