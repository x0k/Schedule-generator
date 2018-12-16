import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import data from '../data/exams';
import estimated from './estimated';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20);

let gen = new Generator(),
  gp = new Grouper(data.step),
  load = estimated(gen.load, gen),
  run = estimated(gen.run, gen);

load(data)
  .then(event => run(beginDate, endDate))
  .then(groups => gp.toList(groups))
  .then(data => data.filter(el => el.value))
  .then(filtered => console.log(filtered));