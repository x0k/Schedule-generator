export default {
  name: '147a exams',
  from: 1547067600000,
  to: 1547931600000,
  constraints: {
    minute: {
      step: 30
    },
    date: {
      expression: [ 2019, 0, 10, 'fullDate', 2019, 0, 20, 'fullDate', 'in' ]
    },
  },
  rules: [
    // Teachers
    {
      id: 'Babenko',
      require: ['minute'],
      expression: [[[[
          9, 0, 'time', 10, 30, 'time', 'in',
          [
            0, 11, 'date', 'today',
            0, 15, 'date', 'today',
          ], '|',
        ], '&', [
          10, 0, 'time', 11, 0, 'time', 'in', [
            0, 10, 'date', 'today',
             0, 14, 'date', 'today',
          ] ], '&',], '|', 'Бабенко В. В.'], '&' ],
    },
    {
      id: 'Mironov',
      require: ['minute'],
      expression: [[[[
          0, 19, 'date', 'today',
          9, 0, 'time', 10, 30, 'time', 'in',
        ], '&', [
          0, 18, 'date', 'today',
          15, 0, 'time', 16, 0, 'time', 'in',
        ], '&', ], '|', 'Миронов В. В.'], '&', ]
    },
    {
      id: 'teacher',
      require: [ 'Babenko', 'Mironov' ],
      expression: [ [ 'Babenko', 'get', 'Mironov', 'get', ], '|', ]
    },
    // Types
    {
      id: 'exam',
      require: ['date'],
      expression: [[[
        0, 11, 'date', 'today',
        0, 15, 'date', 'today',
        0, 19, 'date', 'today',
      ], '|', 'Экзамен'], '&', ],
    },
    {
      id: 'consultation',
      require: ['date'],
      expression: [[[
        0, 10, 'date', 'today',
        0, 14, 'date', 'today',
        0, 18, 'date', 'today',
      ], '|', 'Консультация'], '&', ],
    },
    {
      id: 'type',
      require: ['exam', 'consultation'],
      expression: [ [ 'exam', 'get', 'consultation', 'get', ], '|', ]
    },
    // Subjects
    {
      id: 'Reengineering',
      require: ['date'],
      expression: [ [0, 10, 'date', 0, 12, 'date', 'in', 'Реинжиниринг и оптимизация бизнес процессов'], '&', ],
    },
    {
      id: 'KnowledgeEngineering',
      require: ['date'],
      expression: [ [0, 18, 'date', 0, 20, 'date', 'in', 'Основы инженерии знаний'], '&', ],
    },
    {
      id: 'SystemDesign',
      require: ['date'],
      expression: [ [0, 14, 'date', 0, 16, 'date', 'in', 'Проектирование информационных систем'], '&', ],
    },
    {
      id: 'subject',
      require: [ 'Reengineering', 'KnowledgeEngineering', 'SystemDesign' ],
      expression: [ [ 'Reengineering', 'get', 'KnowledgeEngineering', 'get', 'SystemDesign', 'get', ], '|', ],
    },
    {
      id: 'extractor',
      require: [ 'type', 'teacher', 'subjects' ],
      expression: [[
        'type', 'get', 'teacher', 'get', 'subject', 'get', [
          'type', 'get', ', ', 'subject', 'get', ', ', 'teacher', 'get',
        ], '+', ], '&', 'save', ],
    },
  ]
};
