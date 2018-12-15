import Generator from '../src/Generator';
import { Grouper } from '../src/Grouper';
import data from '../data/exams';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20);

let gen = new Generator(),
  extractor = val => val.event ? val.event.join(', ') : null,
  partion = 'minutes',
  gp = new Grouper(extractor);

gen.load(data)
  .then(gen => gen.run(beginDate, endDate, partion, gp))
  .then(gp => console.log(gp.groups));
 