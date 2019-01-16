import { Grouper } from '../build/index';

const date = new Date();
const partions = ['hour', 'day', 'week', 'month', 'year'];
const types = ['header', 'item'];
for (let type of types)
  for (let partion of partions)
    console.log(Grouper.partionToString(partion, date, type, 'ru-RU'));


console.log(Grouper.periodToString('year', {
  start: date.getTime(),
  length: 3600000
}));