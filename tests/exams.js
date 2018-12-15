import Generator from '../src/Generator';
import data from '../data/exams';

const beginDate = new Date(2019, 0, 10),
  endDate = new Date(2019, 0, 20);

let gen = new Generator('minutes');

gen.load(data)
  .then(gen => gen.run(beginDate, endDate))
  .then(groups => console.log(groups));