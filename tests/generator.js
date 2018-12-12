import Generator from './../src/Generator';
import Grouper from './../src/Grouper';
import data from './../src/data';

let gen = new Generator(),
  gp = new Grouper(new Date(), 'minutes');
gen.load(data)
  .then(gen => gen.run(new Date(), new Date(2018, 11, 29), val => gp.add(val)))
  .then(() => gp.print());
