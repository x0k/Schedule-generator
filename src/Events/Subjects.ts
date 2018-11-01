import DateTime from './DateTime/DateTime';

const year = 2018,
  toDate = (y: number, d: number, m: number): Date => new Date(y, m - 1, d),
  today = (dt: DateTime, d: number, m: number) => dt.isToday(toDate(year, d, m)),
  before = (dt: DateTime, d: number, m: number) => dt.before(toDate(year, d, m)),
  after = (dt: DateTime, d: number, m: number) => dt.after(toDate(year, d, m));

export default [
  {
    event: 'minutes',
    name: 'ERPSystem',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.numerator && v.call1 && (today(dt, 24, 9) || today(dt, 8, 10) || today(dt, 22, 10)))
        || (v.monday && v.denumerator && v.call1 && !today(dt, 17, 9))
        || (v.monday && v.numerator && (v.call2 || v.call3) && !today(dt, 10, 9))
      ) {
        return 'ERP-системы';
      }
    },
  },
  {
    event: 'minutes',
    name: 'SED',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.monday && v.denumerator && v.call2)
        || (v.call1 && (v.denumerator && today(dt, 27, 11) || v.tuesday && v.numerator && after(dt, 24, 9)))
        || (v.wednesday && v.call3 && after(dt, 9, 10) && before(dt, 6, 12))
      ) {
        return 'Системы электрнонного документооборота';
      }
    },
  },
  {
    event: 'minutes',
    name: 'Psihology',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.monday && v.call3 && v.denumerator)
        || (v.monday && v.call4 && (v.numerator || today(dt, 17, 9)))
      ) {
        return 'Психология и педагогика';
      }
    },
  },
  {
    event: 'minutes',
    name: 'Reengineering',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.tuesday && v.call2)
        || (today(dt, 19, 12) && v.call2)
      ) {
        return 'Реинжиниринг и оптимизация бизнес-процессов';
      }
    },
  },
  {
    event: 'minutes',
    name: 'Projecting',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.call3 && (today(dt, 11, 12) || today(dt, 18, 12)))
        || (v.wednesday && v.call1 && v.numerator)
        || (v.wednesday && v.call2 && after(dt, 11, 9) && before(dt, 13, 12))
        || (today(dt, 5, 9) && v.call5)
      ) {
        return 'Проектирование информационных систем';
      }
    },
  },
  {
    event: 'minutes',
    name: 'Graphics',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.wednesday && v.call3 && before(dt, 4, 10))
        || (v.friday && (v.call5 || v.call6) && v.numerator)
      ) {
        return 'Основы бизнес-графики и компьютерного дизайна';
      }
    },
  },
  {
    event: 'minutes',
    name: 'Corporate',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.wednesday && v.call4 && v.denumerator && before(dt, 13, 12))
        || ((v.call4 || v.call5)
          && (today(dt, 13, 9) || today(dt, 11, 10) || today(dt, 8, 11) || today(dt, 6, 12) || today(dt, 20, 12)))
      ) {
        return 'Корпоративные бизнес-модели в Интернет';
      }
    },
  },
  {
    event: 'minutes',
    name: 'KnowledgeEngenering',
    handler: (dt: DateTime, v: any) => {
      if (v.thursday && (v.call4 || v.call5 || v.call6) && v.denumerator && (v.call6 ? before(dt, 14, 12) : true)) {
        return 'Основы инженерии знаний';
      }
    },
  },
  {
    event: 'minutes',
    name: 'ITRegion',
    handler: (dt: DateTime, v: any) => {
      if (
        (v.saturday && v.call2 && after(dt, 5, 10) && before(dt, 9, 12))
        || (v.saturday && v.call3 && v.numerator && after(dt, 12, 10))
        || (v.saturday && v.call4 && (today(dt, 6, 10) || today(dt, 20, 10)))
      ) {
        return 'ИТ в региональном управлении';
      }
    },
  },
  {
    event: 'minutes',
    name: 'subjects',
    handler: (dt: DateTime, values: any) => {
      const subjects = ['ERPSystem', 'SED', 'Psihology', 'Reengineering',
        'Projecting', 'Graphics', 'Corporate', 'KnowledgeEngenering', 'ITRegion'];
      for (const subject of subjects) {
        if (values[subject]) {
          return values[subject];
        }
      }
      return null;
    },
  },
];
