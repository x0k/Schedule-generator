import Generator from './../src/Generator';
import data from './../data/exams';

let gen = new Generator(),
  margin = 0,
  print = (name) => {
    let m = '';
    for (let i = 1; i < margin; i++)
      m += '  ';
    console.log(m + name);
  },
  draw = (events) => {
    margin += 1;
    for (let event of events) {
      print(event.name);
      let ls = event.listners;
      if (ls.length) {
        draw(ls);
      }
    }
    margin -= 1;
  }
gen.load(data)
  .then(gen => draw(gen.iterator.events));
