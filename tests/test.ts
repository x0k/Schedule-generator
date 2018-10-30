import Iterator from '../src/DateTimeIterator';

const begin = new Date(2018, 9, 30, 19, 0),
  end = new Date(2085, 9, 30, 21, 0),
  val = new Date(2018, 9, 30, 19, 0),
  iter = new Iterator(begin, end);

for (const date of iter) {
  val.setMinutes(val.getMinutes() + 1);
  if (date.year !== val.getFullYear() || date.month !== val.getMonth() + 1 || date.date !== val.getDate()
    || date.minutes !== val.getMinutes()) {
      console.log(date);
      console.log(val);
      break;
    }
}
