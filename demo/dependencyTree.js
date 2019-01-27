import { Loader } from '../build/index';
import schedule from './data/exams';

let gen = new Loader(),
  margin = 0,
  print = (name) => {
    let m = '';
    for (let i = 1; i < margin; i++)
      m += '| ';
    console.log(m + name);
  },
  draw = tree => {
    margin += 1;
    for (let [id, values] of tree) {
      print(id);
      if (values.size) {
        draw(values);
      }
    }
    margin -= 1;
  }
gen.load(schedule)
  .then(gen => draw(gen.tree));
