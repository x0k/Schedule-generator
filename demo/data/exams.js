export default {
  name: '147a exams',
  from: 1547067600000,
  to: 1547931600000,
  constraints: {
    minute: {
      step: 30
    },
    date: {
      expression: [ 'in', 'fullDate', 2019, 0, 10, 'fullDate', 2019, 0, 20 ]
    },
  },
  rules: [
    // Teachers
    {
      id: 'Babenko',
      require: ['minute'],
      expression: [ 'and', 'or', [
        'and', [
          'in', 'time', 9, 0, 'time', 10, 30,
          'or', [
            'today', 'date', 0, 11,
            'today', 'date', 0, 15,
          ] ],
        'and', [
          'in', 'time', 10, 0, 'time', 11, 0,
          'or', [
            'today', 'date', 0, 10,
            'today', 'date', 0, 14,
          ] ],
      ], 'Бабенко В. В.' ],
    },
    {
      id: 'Mironov',
      require: ['minute'],
      expression: [ 'and', 'or', [
        'and', [
          'today', 'date', 0, 19,
          'in', 'time', 9, 0, 'time', 10, 30,
        ],
        'and', [
          'today', 'date', 0, 18,
          'in', 'time', 15, 0, 'time', 16, 0,
        ] ],
      'Миронов В. В.' ]
    },
    {
      id: 'teacher',
      require: [ 'Babenko', 'Mironov' ],
      expression: [ 'any', [ 'get', 'Babenko', 'get', 'Mironov' ] ]
    },
    // Types
    {
      id: 'exam',
      require: ['date'],
      expression: [ 'and', 'any', [
        'today', 'date', 0, 11,
        'today', 'date', 0, 15,
        'today', 'date', 0, 19,
      ], 'Экзамен' ],
    },
    {
      id: 'consultation',
      require: ['date'],
      expression: [ 'and', 'any', [
        'today', 'date', 0, 10,
        'today', 'date', 0, 14,
        'today', 'date', 0, 18,
      ], 'Консультация' ],
    },
    {
      id: 'type',
      require: ['exam', 'consultation'],
      expression: [ 'any', [ 'get', 'exam', 'get', 'consultation' ] ]
    },
    // Subjects
    {
      id: 'Reengineering',
      require: ['date'],
      expression: [ 'and', 'in', 'date', 0, 10, 'date', 0, 12, 'Реинжиниринг и оптимизация бизнес процессов' ],
    },
    {
      id: 'KnowledgeEngineering',
      require: ['date'],
      expression: [ 'and', 'in', 'date', 0, 18, 'date', 0, 20, 'Основы инженерии знаний' ],
    },
    {
      id: 'SystemDesign',
      require: ['date'],
      expression: [ 'and', 'in', 'date', 0, 14, 'date', 0, 16, 'Проектирование информационных систем' ],
    },
    {
      id: 'subject',
      require: [ 'Reengineering', 'KnowledgeEngineering', 'SystemDesign' ],
      expression: [ 'any', [ 'get', 'Reengineering', 'get', 'KnowledgeEngineering', 'get', 'SystemDesign' ] ]
    },
    {
      id: 'extractor',
      require: [ 'type', 'teacher', 'subjects' ],
      expression: [ 'every', [ 'get', 'type', 'get', 'teacher', 'get', 'subject', 'save', '+', '+', '+', '+', 'get', 'type', ', ', 'get', 'subject', ', ', 'get', 'teacher'] ],
    },
  ]
};
