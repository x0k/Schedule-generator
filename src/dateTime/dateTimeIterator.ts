import { DateTime, IConstraints } from './dateTime';
import { RuleResolver } from '../rules/ruleResolver';

export class DateTimeIterator extends RuleResolver {

  public static before (dateTime: DateTime, date: Date) {
    if (dateTime.get('year') < date.getFullYear()) {
      return true;
    }
    if (dateTime.get('year') === date.getFullYear()) {
      if (dateTime.get('month') < date.getMonth()) {
        return true;
      }
      if (dateTime.get('month') === date.getMonth()) {
        if (dateTime.get('date') < date.getDate()) {
          return true;
        }
        if (dateTime.get('date') === date.getDate()) {
          if (dateTime.get('hour') < date.getHours()) {
            return true;
          }
          if ((dateTime.get('hour') === date.getHours()) && dateTime.get('minute') < date.getMinutes()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public static after (dateTime: DateTime, date: Date) {
    if (dateTime.get('year') > date.getFullYear()) {
      return true;
    }
    if (dateTime.get('year') === date.getFullYear()) {
      if (dateTime.get('month') > date.getMonth()) {
        return true;
      }
      if (dateTime.get('month') === date.getMonth()) {
        if (dateTime.get('date') > date.getDate()) {
          return true;
        }
        if (dateTime.get('date') === date.getDate()) {
          if (dateTime.get('hour') > date.getHours()) {
            return true;
          }
          if ((dateTime.get('hour') === date.getHours()) && dateTime.get('minute') >= date.getMinutes()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public static isToday (dateTime: DateTime, date: Date) {
    return (dateTime.get('date') === date.getDate()) &&
      (dateTime.get('month') === date.getMonth()) && (dateTime.get('year') === date.getFullYear());
  }

  private initialRules: string[] = [];

  constructor () {
    super();
    const rules = [
      { id: 'dateTime', handler: (data: any, dt: DateTime) => dt },
      { id: 'year', handler: (data: any, dt: DateTime) => dt.get('year') },
      { id: 'month', handler: (data: any, dt: DateTime) => dt.get('month') },
      { id: 'date', handler: (data: any, dt: DateTime) => dt.get('date') },
      { id: 'week', handler: (data: any, dt: DateTime) => dt.get('week') },
      { id: 'day', handler: (data: any, dt: DateTime) => dt.get('day') },
      { id: 'hour', handler: (data: any, dt: DateTime) => dt.get('hour') },
      { id: 'minute', handler: (data: any, dt: DateTime) => dt.get('minute') },
    ];
    for (const rule of rules) {
      this.initialRules.push(rule.id);
      this.createRule(rule);
    }
  }

  public async start (begin: Date, end: Date, constraints: IConstraints) {
    const dateTime = new DateTime(begin, constraints);
    // Init
    for (const id of this.initialRules) {
      this.emit(id, dateTime);
    }
    // Start
    while (DateTimeIterator.before(dateTime, end)) {
      dateTime.next(this.emit.bind(this), 'minute');
    }
  }

}