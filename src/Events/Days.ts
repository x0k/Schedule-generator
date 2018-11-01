import DateTime from './DateTime/DateTime';

export default [
  {
    event: 'days',
    name: 'monday',
    handler: (dt: DateTime, values: object) => dt.day === 1,
  },
  {
    event: 'days',
    name: 'tuesday',
    handler: (dt: DateTime, values: object) => dt.day === 2,
  },
  {
    event: 'days',
    name: 'wednesday',
    handler: (dt: DateTime, values: object) => dt.day === 3,
  },
  {
    event: 'days',
    name: 'thursday',
    handler: (dt: DateTime, values: object) => dt.day === 4,
  },
  {
    event: 'days',
    name: 'friday',
    handler: (dt: DateTime, values: object) => dt.day === 5,
  },
  {
    event: 'days',
    name: 'saturday',
    handler: (dt: DateTime, values: object) => dt.day === 6,
  },
  {
    event: 'days',
    name: 'sunday',
    handler: (dt: DateTime, values: object) => dt.day === 7,
  },
];
