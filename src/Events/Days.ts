import DateTime from './DateTime/DateTime';

export default {
  monday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 1,
  },
  tuesday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 2,
  },
  wednesday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 3,
  },
  thursday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 4,
  },
  friday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 5,
  },
  saturday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 6,
  },
  sunday: {
    require: ['days'],
    handler: (v, dt: DateTime) => dt.day === 7,
  },
};
