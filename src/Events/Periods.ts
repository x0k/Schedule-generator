import DateTime from './DateTime/DateTime';

export default [
  {
    event: 'days',
    name: 'numerator',
    require: [],
    handler: (dt: DateTime, values: any) => {
      const date = new Date(dt.begin),
        day = date.getDay();
      date.setDate(date.getDate() - (day > 1 ? day - 1 : day - 1));
      const time = DateTime.getTimeBethwen(date, dt.toDate()),
        weeks = DateTime.toWeeks(time);
      return Math.floor(weeks)  % 2 === 0;
    },
  },
  {
    event: 'days',
    name: 'denumerator',
    require: ['numerator'],
    handler: (dt: DateTime, values: any) => !values.numerator,
  },
];
