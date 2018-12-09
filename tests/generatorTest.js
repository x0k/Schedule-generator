import Generator from './../src/Generator';

let handler = Generator.toHandler([ [[ 'string', true, 0, 'false' ]], 'every' ]),
  data = handler({});
console.log(data);

