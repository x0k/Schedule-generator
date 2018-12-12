export default [
  // Days
  {
    name: 'monday',
    require: ['day'],
    flow: [ 'equal', [ 1, 'day' ] ]
  },
  {
    name: 'tuesday',
    require: ['day'],
    flow: [ 'equal', [ 2, 'day' ] ]
  },
  {
    name: 'wednesday',
    require: ['day'],
    flow: [ 'equal', [ 3, 'day' ] ]
  },
  {
    name: 'thursday',
    require: ['day'],
    flow: [ 'equal', [ 4, 'day' ] ]
  },
  {
    name: 'friday',
    require: ['day'],
    flow: [ 'equal', [ 5, 'day' ] ]
  },
  {
    name: 'saturday',
    require: ['day'],
    flow: [ 'equal', [ 6, 'day' ] ]
  },
  {
    name: 'sunday',
    require: ['day'],
    flow: [ 'equal', [ 7, 'day' ] ]
  },
  // Calls
  {
    name: 'call1',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [ 8, 0 ], 'time', [ 9, 30 ] ] ],
    result: 1,
  },
  {
    name: 'call2',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [9, 40], 'time', [ 11, 10 ] ] ],
    result: 2,
  },
  {
    name: 'call3',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [ 11, 20 ], 'time', [ 12, 50 ] ] ],
    result: 3,
  },
  {
    name: 'call4',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [ 13, 50 ], 'time', [ 15, 20 ] ] ],
    result: 4,
  },
  {
    name: 'call5',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [ 15, 30 ], 'time', [ 17, 0 ] ] ],
    result: 5,
  },
  {
    name: 'call6',
    require: [ 'minutes' ],
    flow: [ 'in', [ 'time', [ 17, 10 ], 'time', [ 18, 40 ] ] ],
    result: 6
  },
  {
    name: 'calls',
    require: ['call1', 'call2', 'call3', 'call4', 'call5', 'call6'],
    flow: [ 'any', [[ 'get', ['call1'], 'get', ['call2'], 'get', ['call3'], 'get', ['call4'], 'get', ['call5'], 'get', ['call6'] ]] ],
  },
  // Week types
  {
    name: 'numerator',
    require: ['weeks'],
    flow: [ 'odd', [ 'weeks' ] ]
  },
  {
    name: 'denumerator',
    require: ['numerator'],
    flow: [ 'not', [ 'numerator' ] ]
  },
  // Subjects
  {
    name: 'ERPSystem',
    require: [ 'numerator', 'call1', 'call2', 'monday', 'days' ],
    flow: [ 'any', [[
      'every', [[ 'get', ['numerator'], 'get', ['call1'], 'any', [[
        'today', [ 'date', [9, 24] ], 'today', [ 'date', [10, 8] ], 'today', [ 'date', [10, 22] ]
      ]] ]],
      'every', [[ 'get', ['denumerator'], 'get', ['monday'], 'get', ['call1'], 'not', [ 'today', [ 'date', [9, 17] ] ] ]],
      'every', [[ 'get', ['denumerator'], 'get', ['monday'], 'or', [ 'get', ['call1'], 'get', ['call2'] ], 'not', [ 'today', [ 'date', [9, 10] ] ] ]],
    ]] ],
    result: 'ERP-системы',
  },
  /*{
    name: 'SED',
    require: [ 'monday', 'denumerator', 'call2', 'call1', 'days', 'call3', 'thursday', 'numerator', 'wednesday' ],
    flow: [ 'any', [[
      'every', [[ 'get', ['monday'], 'get', ['denumerator'], 'get', ['call2'] ]],
      'every', [[ 'get', ['call1'], 'or', [
        'and', [ 'get', ['denumerator'], 'today', [ 'date', [11, 27] ] ],
        'every', [[ 'get', ['thursday'], 'get', ['numerator'], 'after', [ 'date', [9, 24] ] ]]
      ] ]],
      'every', [[ 'get', ['wednesday'], 'get', ['call3'], 'in', [ 'date', [10, 10], 'date', [12, 6] ] ]]
    ]] ],
    result: 'Системы электронного документооборота',
  },
  {
    name: 'Psychology',
    require: [ 'call3', 'days', 'monday', 'call4', 'denumerator', 'numerator' ],
    flow: [ 'or', [
      'every', [[ 'get', ['monday'], 'get', ['call3'], 'get', ['denumerator'] ]],
      'every', [[ 'get', ['monday'], 'get', ['call4'], 'or', [ 'get', ['numerator'], 'today', [ 'date', [9, 17] ] ] ]]
    ] ],
    result: 'Психология и педагогика',
  },
  {
    name: 'Reengineering',
    require: [ 'tuesday', 'call2', 'days' ],
    flow: [ 'or', [
      'and', [ 'get', ['tuesday'], 'get', ['call2'] ],
      'and', [ 'today', [ 'date', [12, 19] ], 'get', ['call2'] ]
    ] ],
    result: 'Реинжиниринг и оптимизация бизнес-процессов',
  },
  {
    name: 'Projecting',
    require: [ 'call3', 'days', 'wednesday', 'call1', 'call2', 'numerator', 'call5' ],
    flow: [ 'any', [[
      'and', [ 'get', ['call3'], 'or', [ 'today', [ 'date', [12, 11] ], 'today', [ 'date', [12, 18] ] ] ],
      'every', [[ 'get', ['wednesday'], 'get', ['call1'], 'get', ['numerator'] ]],
      'every', [[ 'get', ['wednesday'], 'get', ['call2'], 'in', [ 'date', [11, 13], 'date', [12, 13] ] ]],
      'and', [ 'today', [ 'date', [9, 5] ], 'get', ['call5'] ]
    ]] ],
    result: 'Проектирование информационных систем',
  },
  {
    name: 'Graphics',
    require: [ 'wednesday', 'friday', 'numerator', 'call3', 'call6', 'call5', 'days' ],
    flow: [ 'or', [
      'every', [[ 'get', ['wednesday'], 'get', ['call3'], 'before', [ 'date', [10, 4] ] ]],
      'every', [[ 'get', ['friday'], 'get', ['numerator'], 'or', [ 'get', ['call5'], 'get', ['call6'] ] ]]
    ] ],
    result: 'Основы бизнес-графики и компьютерного дизайна',
  },
  {
    name: 'Corporate',
    require: [ 'wednesday', 'call4', 'denumerator', 'days', 'call5' ],
    flow: [ 'or', [
      'every', [[ 'get', ['wednesday'], 'get', ['call4'], 'get', ['denumerator'], 'before', [ 'date', [12, 13] ] ]],
      'and', [ 'or', [ 'get', ['call4'], 'get', ['call5'] ], 'any', [[
        'today', [ 'date', [9, 13] ], 'today', [ 'date', [10, 11] ], 'today', [ 'date', [11, 8] ], 'today', [ 'date', [12, 6] ], 'today', [ 'date', [12, 20] ]
      ]] ]
    ] ],
    result: 'Корпоративные бизнес-модели в Интернет',
  },
  {
    name: 'KnowledgeEngineering',
    require: [ 'thursday', 'denumerator', 'call4', 'call5', 'call6', 'days' ],
    flow: [ 'every', [[
      'get', ['thursday'], 'get', ['denumerator'],
      'any', [[ 'get', ['call4'], 'get', ['call5'], 'get', ['call6'] ]],
      'or', [ 'and', [ 'get', ['call6'], 'before', [ 'date', [12, 14] ] ], 'not', [ 'get', ['call6'] ] ],
    ]] ],
    result: 'Основы инженерии знаний',
  },
  {
    name: 'ITRegion',
    require: [ 'saturday', 'call2', 'call3', 'call4', 'days', 'numerator' ],
    flow: [ 'any', [[
      'every', [[ 'get', ['saturday'], 'get', ['call2'], 'in', [ 'date', [10, 5], 'date', [12, 9] ] ]],
      'every', [[ 'get', ['saturday'], 'get', ['call3'], 'get', ['numerator'], 'after', [ 'date', [10, 12] ] ]],
      'every', [[ 'get', ['saturday'], 'get', ['call4'], 'or', [
        'today', [ 'date', [10, 6] ], 'today', [ 'date', [10, 20] ]
      ] ]],
    ]] ],
    result: 'ИТ в региональном управлении',
  },
  {
    name: 'subjects',
    require: [ 'ERPSystem', 'SED', 'Psychology', 'Reengineering', 'Projecting', 'Graphics', 'Corporate', 'KnowledgeEngineering', 'ITRegion' ],
    flow: [ 'any', [[
      'get', ['ERPSystem'], 'get', ['SED'], 'get', ['Psychology'], 'get', ['Reengineering'],
      'get', ['Projecting'], 'get', ['Graphics'], 'get', ['Corporate'], 'get', ['KnowledgeEngineering'], 'get', ['ITRegion']
    ]] ]
  }*/
];