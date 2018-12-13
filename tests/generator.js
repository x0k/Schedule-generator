import Generator from './../src/Generator';
import Grouper from './../src/Grouper';
import data from './../src/data';

const beginDate = new Date(2018, 11, 3),
  endDate = new Date(2018, 11, 4);

let gen = new Generator(),
  gp = new Grouper(beginDate, 'minutes'),
  action = val => gp.add(val);

gen.load(data)
  .then(gen => gen.run(beginDate, endDate, action))
  .then(() => gp.print());
