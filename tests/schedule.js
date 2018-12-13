import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import data from '../data/schedule';

const beginDate = new Date(2018, 11, 3),
  endDate = new Date(2018, 11, 4);

let gen = new Generator(),
  partion = 'minutes',
  extractor = val => val.subject,
  gp = new Grouper(beginDate, partion, extractor),
  action = val => gp.add(val);

gen.load(data)
  .then(gen => gen.run(beginDate, endDate, partion, action))
  .then(() => gp.print());
 