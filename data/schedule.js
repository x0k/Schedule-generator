export default {
  name: '147a schedule',
  constraints: {
    minute: {
      step: 10
    },
    day: {
      expression: [ 'not', 'equal', 0, 'day' ]
    }
  },
  extractor: {
    require: [ 'ERPSystem', 'SED', 'Psychology', 'Reengineering', 'Projecting', 'Graphics', 'Corporate', 'KnowledgeEngineering', 'ITRegion' ],
    expression: [ 'any', [
      'get', ['ERPSystem'], 'get', ['SED'], 'get', ['Psychology'], 'get', ['Reengineering'],
      'get', ['Projecting'], 'get', ['Graphics'], 'get', ['Corporate'], 'get', ['KnowledgeEngineering'], 'get', ['ITRegion']
    ] ]
  },
  rules: [
    // Days
    {
      id: 'monday',
      require: ['day'],
      expression: [ 'equal', [ 1, 'day' ] ]
    },
    {
      id: 'tuesday',
      require: ['day'],
      expression: [ 'equal', [ 2, 'day' ] ]
    },
    {
      id: 'wednesday',
      require: ['day'],
      expression: [ 'equal', [ 3, 'day' ] ]
    },
    {
      id: 'thursday',
      require: ['day'],
      expression: [ 'equal', [ 4, 'day' ] ]
    },
    {
      id: 'friday',
      require: ['day'],
      expression: [ 'equal', [ 5, 'day' ] ]
    },
    {
      id: 'saturday',
      require: ['day'],
      expression: [ 'equal', [ 6, 'day' ] ]
    },
    // Calls
    {
      id: 'call1',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [ 8, 0 ], 'time', [ 9, 30 ] ], 1 ],
    },
    {
      id: 'call2',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [9, 40], 'time', [ 11, 10 ] ], 2 ],
    },
    {
      id: 'call3',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [ 11, 20 ], 'time', [ 12, 50 ] ], 3 ],
    },
    {
      id: 'call4',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [ 13, 50 ], 'time', [ 15, 20 ] ], 4 ],
    },
    {
      id: 'call5',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [ 15, 30 ], 'time', [ 17, 0 ] ], 5 ],
    },
    {
      id: 'call6',
      require: [ 'minute' ],
      expression: [ 'and', 'in', [ 'time', [ 17, 10 ], 'time', [ 18, 40 ] ], 6 ],
    },
    {
      id: 'calls',
      require: ['call1', 'call2', 'call3', 'call4', 'call5', 'call6'],
      expression: [ 'any', [ 'get', ['call1'], 'get', ['call2'], 'get', ['call3'], 'get', ['call4'], 'get', ['call5'], 'get', ['call6'] ] ],
    },
    // Week types
    {
      id: 'numerator',
      require: ['week'],
      expression: [ 'odd', [ 'week' ] ]
    },
    {
      id: 'denumerator',
      require: ['numerator'],
      expression: [ 'not', [ 'get', ['numerator'] ] ]
    },
    // Subjects
    {
      id: 'ERPSystem',
      require: [ 'numerator', 'call1', 'call2', 'monday' ],
      expression: [ 'and', 'any', [
        'every', [ 'get', ['numerator'], 'get', ['call1'], 'any', [
          'today', [ 'date', [8, 24] ], 'today', [ 'date', [9, 8] ], 'today', [ 'date', [9, 22] ]
        ] ],
        'every', [ 'get', ['denumerator'], 'get', ['monday'], 'get', ['call1'], 'not', [ 'today', [ 'date', [8, 17] ] ] ],
        'every', [ 'get', ['numerator'], 'get', ['monday'], 'or', [ 'get', ['call2'], 'get', ['call3'] ], 'not', [ 'today', [ 'date', [8, 10] ] ] ],
      ], 'ERP-системы' ],
    },
    {
      id: 'SED',
      require: [ 'monday', 'denumerator', 'call2', 'call1', 'call3', 'tuesday', 'numerator', 'wednesday' ],
      expression: [ 'and', 'any', [
        'every', [ 'get', ['monday'], 'get', ['denumerator'], 'get', ['call2'] ],
        'every', [ 'get', ['call1'], 'or', [
          'and', [ 'get', ['denumerator'], 'today', [ 'date', [10, 27] ] ],
          'every', [ 'get', ['tuesday'], 'get', ['numerator'], 'after', [ 'date', [8, 24] ] ]
        ] ],
        'every', [ 'get', ['wednesday'], 'get', ['call3'], 'in', [ 'date', [9, 10], 'date', [11, 6] ] ]
      ], 'Системы электронного документооборота' ],
    },
    {
      id: 'Psychology',
      require: [ 'call3', 'monday', 'call4', 'denumerator', 'numerator' ],
      expression: [ 'and', 'or', [
        'every', [ 'get', ['monday'], 'get', ['call3'], 'get', ['denumerator'] ],
        'every', [ 'get', ['monday'], 'get', ['call4'], 'or', [ 'get', ['numerator'], 'today', [ 'date', [8, 17] ] ] ]
      ], 'Психология и педагогика' ],
    },
    {
      id: 'Reengineering',
      require: [ 'tuesday', 'call2' ],
      expression: [ 'and', 'or', [
        'and', [ 'get', ['tuesday'], 'get', ['call2'] ],
        'and', [ 'today', [ 'date', [11, 19] ], 'get', ['call2'] ]
      ], 'Реинжиниринг и оптимизация бизнес-процессов' ],
    },
    {
      id: 'Projecting',
      require: [ 'call3', 'wednesday', 'call1', 'call2', 'numerator', 'call5' ],
      expression: [ 'and', 'any', [
        'and', [ 'get', ['call3'], 'or', [ 'today', [ 'date', [11, 11] ], 'today', [ 'date', [11, 18] ] ] ],
        'every', [ 'get', ['wednesday'], 'get', ['call1'], 'get', ['numerator'] ],
        'every', [ 'get', ['wednesday'], 'get', ['call2'], 'in', [ 'date', [10, 13], 'date', [11, 13] ] ],
        'and', [ 'today', [ 'date', [8, 5] ], 'get', ['call5'] ]
      ], 'Проектирование информационных систем' ],
    },
    {
      id: 'Graphics',
      require: [ 'wednesday', 'friday', 'numerator', 'call3', 'call6', 'call5' ],
      expression: [ 'and', 'or', [
        'every', [ 'get', ['wednesday'], 'get', ['call3'], 'before', [ 'date', [9, 4] ] ],
        'every', [ 'get', ['friday'], 'get', ['numerator'], 'or', [ 'get', ['call5'], 'get', ['call6'] ] ]
      ], 'Основы бизнес-графики и компьютерного дизайна' ],
    },
    {
      id: 'Corporate',
      require: [ 'wednesday', 'call4', 'denumerator', 'call5' ],
      expression: [ 'and', 'or', [
        'every', [ 'get', ['wednesday'], 'get', ['call4'], 'get', ['denumerator'], 'before', [ 'date', [11, 13] ] ],
        'and', [ 'or', [ 'get', ['call4'], 'get', ['call5'] ], 'any', [
          'today', [ 'date', [8, 13] ], 'today', [ 'date', [9, 11] ], 'today', [ 'date', [10, 8] ], 'today', [ 'date', [11, 6] ], 'today', [ 'date', [11, 20] ]
        ] ]
      ], 'Корпоративные бизнес модели в Интернете', ],
    },
    {
      id: 'KnowledgeEngineering',
      require: [ 'thursday', 'denumerator', 'call4', 'call5', 'call6' ],
      expression: [ 'and', 'every', [
        'get', ['thursday'], 'get', ['denumerator'],
        'any', [ 'get', ['call4'], 'get', ['call5'], 'get', ['call6'] ],
        'or', [ 'and', [ 'get', ['call6'], 'before', [ 'date', [11, 14] ] ], 'not', [ 'get', ['call6'] ] ],
      ], 'Основы инженерии знаний' ],
    },
    {
      id: 'ITRegion',
      require: [ 'saturday', 'call2', 'call3', 'call4', 'numerator' ],
      expression: [ 'and', 'any', [
        'every', [ 'get', ['saturday'], 'get', ['call2'], 'in', [ 'date', [9, 5], 'date', [11, 9] ] ],
        'every', [ 'get', ['saturday'], 'get', ['call3'], 'get', ['numerator'], 'after', [ 'date', [9, 12] ] ],
        'every', [ 'get', ['saturday'], 'get', ['call4'], 'or', [
          'today', [ 'date', [10, 6] ], 'today', [ 'date', [9, 20] ]
        ] ],
      ], 'ИТ в региональном управлении' ],
    }
  ]
};
