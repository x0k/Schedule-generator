export default [
  // Days
  {
    name: 'monday',
    require: ['day'],
    flow: [ [ 1, 'day' ], 'equal' ]
  },
  {
    name: 'tuesday',
    require: ['day'],
    flow: [ [ 2, 'day' ], 'equal' ]
  },
  {
    name: 'wednesday',
    require: ['day'],
    flow: [ [ 3, 'day' ], 'equal' ]
  },
  {
    name: 'thursday',
    require: ['day'],
    flow: [ [ 4, 'day' ], 'equal' ]
  },
  {
    name: 'friday',
    require: ['day'],
    flow: [ [ 5, 'day' ], 'equal' ]
  },
  {
    name: 'saturday',
    require: ['day'],
    flow: [ [ 6, 'day' ], 'equal' ]
  },
  {
    name: 'sunday',
    require: ['day'],
    flow: [ [ 7, 'day' ], 'equal' ]
  },
  // Calls
  {
    name: 'call1',
    require: ['dateTime'],
    flow: [ [ [ 8, 0 ], 'time', [ 9, 30 ], 'time' ], 'in' ]
  },
  {
    name: 'call2',
    require: ['dateTime'],
    flow: [ [ [ 9, 40 ], 'time', [ 11, 10 ], 'time' ], 'in' ]
  },
  {
    name: 'call3',
    require: ['dateTime'],
    flow: [ [ [ 11, 20 ], 'time', [ 12, 50 ], 'time' ], 'in' ]
  },
  {
    name: 'call4',
    require: ['dateTime'],
    flow: [ [ [ 13, 50 ], 'time', [ 15, 20 ], 'time' ], 'in' ]
  },
  {
    name: 'call5',
    require: ['dateTime'],
    flow: [ [ [ 15, 30 ], 'time', [ 17, 0 ], 'time' ], 'in' ]
  },
  {
    name: 'call6',
    require: ['dateTime'],
    flow: [ [ [ 17, 10 ], 'time', [ 18, 40 ], 'time' ], 'in' ]
  },
  // Week types
  {
    name: 'numerator',
    require: ['weeks'],
    flow: [ [ 'weeks' ], 'odd' ]
  },
  {
    name: 'denumerator',
    require: ['numerator'],
    flow: [ [ [ 'numerator' ], 'get' ], 'not' ]
  },
  // Subjects
  {
    name: 'ERPSystem',
    require: [ 'dateTime' ],
    flow: [ [[
      [[ ['numerator'], 'get', ['call1'], 'get', [[
        [ [9, 24], 'date' ], 'today', [ [10, 8], 'date' ], 'today', [ [10, 22], 'date' ], 'today'
      ]], 'some' ]], 'every',
      [[ ['denumerator'], 'get', ['monday'], 'get', ['call1'], 'get', [ [ [9, 17], 'date' ], 'today' ], 'not' ]], 'every',
      [[ ['denumerator'], 'get', ['monday'], 'get', [ ['call1'], 'get', ['call2'], 'get' ], 'or', [ [ [9, 10], 'date' ], 'today' ], 'not' ]], 'every',
    ]], 'some' ] 
  }
];