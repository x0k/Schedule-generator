import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import schedule from '../data/schedule';
import exams from '../data/exams';

const beginDate = new Date(2018, 11, 17),
  endDate = new Date(2019, 0, 20);

let gen = new Generator(),
  partion = 'minutes',
  extractor = val => {
    if (val.subjects)
      return val.subjects;
    if (val.event)
      return val.event.join(', ');
    return null;
  },
  gp = new Grouper(beginDate, partion, extractor),
  action = val => gp.add(val);

gen.load(schedule)
  .then(gen => gen.load(exams))
  .then(gen => gen.run(beginDate, endDate, partion, action))
  .then(() => gp.print());
 