import DateTime from './DateTime';
import EventProvider from './EventProvider';

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

const numToDay = (num: number) => {
  switch (num) {
  case 1:
    return 'Пн';
  case 2:
    return 'Вт';
  case 3:
    return 'Ср';
  case 4:
    return 'Чт';
  case 5:
    return 'Пт';
  case 6:
    return 'Сб';
  default:
    return 'Вс';
  }
};

class Bilder {

  private provider: EventProvider;

  constructor () {
    this.provider = new EventProvider(
      new Date(2018, 8, 1),
      new Date(2018, 11, 29),
      {
        days: [
          {
            handler: (dt: DateTime, values: object) => {
              numToDay(dt.day);
              return null;
            },
            name: 'dayName',
          },
        ],
      },
    );
  }

}
