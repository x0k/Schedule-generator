import DateTime from './DateTime/DateTime';

const before = (dt: DateTime, h: number, m: number) => dt.hours < h || (dt.hours === h && dt.minutes <= m),
  after = (dt: DateTime, h: number, m: number) => dt.hours > h || (dt.hours === h && dt.minutes >= m),
  inPeriod = (dt: DateTime, bh, bm, eh, em) => after(dt, bh, bm) && before(dt, eh, em);

export default [
  {
    event: 'minutes',
    name: 'call1',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 8, 0, 9, 30),
  },
  {
    event: 'minutes',
    name: 'call2',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 9, 40, 11, 10),
  },
  {
    event: 'minutes',
    name: 'call3',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 11, 20, 12, 50),
  },
  {
    event: 'minutes',
    name: 'call4',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 13, 50, 15, 20),
  },
  {
    event: 'minutes',
    name: 'call5',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 15, 30, 17, 0),
  },
  {
    event: 'minutes',
    name: 'call6',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 17, 10, 18, 40),
  },
  {
    event: 'minutes',
    name: 'call7',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 18, 50, 20, 20),
  },
  {
    event: 'minutes',
    name: 'call8',
    handler: (dt: DateTime, values: any) => inPeriod(dt, 20, 30, 22, 0),
  },
  {
    event: 'minutes',
    name: 'calls',
    requires: ['call1', 'call2', 'call3', 'call4', 'call5', 'call6', 'call7', 'call8'],
    handler: (dt: DateTime, values: any) => {
      if (values.call1) {
        return 1;
      }
      if (values.call2) {
        return 2;
      }
      if (values.call3) {
        return 3;
      }
      if (values.call4) {
        return 4;
      }
      if (values.call5) {
        return 5;
      }
      if (values.call6) {
        return 6;
      }
      if (values.call7) {
        return 7;
      }
      if (values.call8) {
        return 8;
      }
      return null;
    },
  },
];
