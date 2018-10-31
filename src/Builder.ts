import DateTime from './Events/DateTime';
import { IHandler } from './Events/DateTimeEvent';
import EventProvider from './Events/EventProvider';

/*
        calls: {
          on: 'minutes',
          handler: (dt: DateTime, values: object) => {
            const before = (h: number, m: number) => dt.hours < h || (dt.hours === h && dt.minutes <= m),
              after = (h: number, m: number) => dt.hours > h || (dt.hours === h && dt.minutes >= m),
              inPeriod = (bh, bm, eh, em) => after(bh, bm) && before(eh, em);
            if (before(7, 59)) {
              return null;
            }
            if (inPeriod(8, 0, 9, 30)) {
              return 1;
            }
            if (inPeriod(9, 40, 11, 10)) {
              return 2;
            }
            if (inPeriod(11, 20, 12, 50)) {
              return 3;
            }
            if (inPeriod(13, 50, 15, 20)) {
              return 4;
            }
            if (inPeriod(15, 30, 17, 0)) {
              return 5;
            }
            if (inPeriod(17, 10, 18, 40)) {
              return 6;
            }
            if (inPeriod(18, 50, 20, 20)) {
              return 7;
            }
            if (inPeriod(20, 30, 22, 0)) {
              return 8;
            }
            return null;
          },
        },
*/
const provider = new EventProvider(),
  begin = new Date(2018, 8, 1),
  end = new Date(2018, 11, 29);
provider.load({
  days: [
    {
      name: 'numerator',
      require: [],
      handler: (dt: DateTime, values: any) => {
        const date = new Date(begin),
          day = date.getDay();
        date.setDate(date.getDate() - (day > 1 ? day - 1 : day - 1));
        const time = DateTime.getTimeBethwen(date, dt.toDate()),
          weeks = DateTime.toWeeks(time);
        return Math.floor(weeks)  % 2 === 0;
      },
    },
    {
      name: 'denumerator',
      require: ['numerator'],
      handler: (dt: DateTime, values: any) => !values.numerator,
    },
    {
      name: 'logger',
      require: ['numerator', 'denumerator'],
      handler: (dt: DateTime, values: any) =>
        console.log(`${dt.date}.${dt.month} ${values.numerator ? 'числитель' : 'знаменатель'}`),
    },
  ],
});
provider.start(begin, end);
