import Generator from '../src/Generator';
import { Grouper } from '../src/Grouper';
import data from '../data/schedule';

const beginDate = new Date(2018, 11, 3),
  endDate = new Date(2018, 11, 29);

let gen = new Generator('minutes');

gen.load(data)
  .then(gen => gen.run(beginDate, endDate, partion, gp))
  .then(gp => console.log(gp.groups));
