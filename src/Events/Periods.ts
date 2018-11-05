import DateTime from './DateTime/DateTime';

export default {
  numerator: {
    require: ['weeks'],
    handler: (v, dt: DateTime) => dt.week % 2 === 1,
  },
  denumerator: {
    require: ['numerator'],
    handler: (v, dt: DateTime) => !v.numerator,
  },
};
