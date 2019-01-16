import { DateTime, IConstraints } from './dateTime';
import { RuleResolver } from '../rules/ruleResolver';
import { before } from './dateTimeHelper';

export class DateTimeIterator extends RuleResolver {

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
    while (before(dateTime, end)) {
      dateTime.next(this.values, this.emit.bind(this), 'minute');
    }
  }

}
