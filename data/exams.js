export default [
  // Teachers
  {
    name: 'Babenko',
    require: [ 'minutes' ],
    flow: [ 'any', [[
      'and', [ 'in' [ 'time' [9, 0], 'time', [10, 30] ], 'or', [ 'today', [ 'date', [1, 11] ], 'today', [ 'date', [1, 15] ] ], ],
      'and', [ 'in' [ 'time' [10, 0], 'time', [11, 0] ], 'or', [ 'today', [ 'date', [1, 10] ], 'today', [ 'date', [1, 14] ] ], ],
    ]] ],
    result: 'Бабенко В. В.'
  },
  {
    name: 'Mironov',
    require: [ 'minutes' ],
    flow: [ 'or', [
      'and', [ 'today', [ 'date', [1, 19] ], 'in' [ 'time' [9, 0], 'time', [10, 30] ] ],
      'and', [ 'today', [ 'date', [1, 18] ], 'in', [ 'time', [15, 0], 'time', [16, 0] ] ],
    ] ],
    result: 'Миронов В. В.'
  },
  {
    name: 'teacher',
    require: [ 'Babenko', 'Mironov' ],
    flow: [ 'any', [[ 'get', ['Babenko'], 'get', ['Mironov'] ]] ]
  },
  // Types
  {
    name: 'exam',
    require: ['date'],
    flow: [ 'any', [[
      'today', [ 'date', [1, 11] ],
      'today', [ 'date', [1, 15] ],
      'today', [ 'date', [1, 19] ],
    ]] ],
    result: 'Экзамен',
  },
  {
    name: 'consultation',
    require: ['date'],
    flow: [ 'any', [[
      'today', [ 'date', [1, 10] ],
      'today', [ 'date', [1, 14] ],
      'today', [ 'date', [1, 18] ],
    ]] ],
    result: 'Консультация',
  },
  {
    name: 'type',
    require: [ 'exam', 'consultation' ],
    flow: [ 'any', [[ 'get', ['exam'], 'get', ['consultation'] ]] ]
  },
  // Subjects
  {
    name: 'Reengineering',
    require: ['date'],
    flow: [ 'in', [ 'date', [1, 10], 'date', [1, 11] ] ],
    result: 'Реинжиниринг и оптимизация бизнес процессов',
  },
  {
    name: 'KnowledgeEngineering',
    require: ['date'],
    flow: [ 'in', [ 'date', [1, 18], 'date', [1, 19] ] ],
    result: 'Основы инженерии знаний',
  },
  {
    name: 'SystemDesign',
    require: ['date'],
    flow: [ 'in', [ 'date', [1, 14], 'date', [1, 15] ] ],
    result: 'Проектирование информационных систем',
  },
  {
    name: 'subject',
    require: [ 'Reengineering', 'KnowledgeEngineering', 'SystemDesign' ],
    flow: [ 'any', [[ 'get', ['Reengineering'], 'get', ['KnowledgeEngineering'], 'get', ['SystemDesign'] ]] ]
  },
  // Data
  {
    name: 'event',
    require: [ 'teacher', 'type', 'subject' ],
    flow: [ 'every', [[ 'get', ['type'], 'get', ['teacher'], 'get', ['subject'] ]] ]
  }
];
