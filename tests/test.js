import Generator from '../src/Generator';
import Grouper from '../src/Grouper';
import events from '../src/data';


let gen = new Generator(),
  grouper = new Grouper(new Date(), 'minutes');
gen.load(events);
console.log('start');
//gen.run(new Date(), new Date(2018, 11, 29), value => console.log(value));
//grouper.print();
