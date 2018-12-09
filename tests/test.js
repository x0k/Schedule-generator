import Generator from '../src/Generator';
import events from '../src/data';


let gen = new Generator();
gen.load(events);
let data = gen.run(new Date(), new Date(2018, 11, 29), 'subjects');
