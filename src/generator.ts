import { DateTime, IConstraints } from './dateTime/dateTime';
import { RuleResolver } from './rules/ruleResolver';
import { before } from './dateTime/dateTimeHelper';
import { ISchedule } from './schedule';
import { IRuleData, Rule } from './rules/rule';

export class Generator {

  private constraints: IConstraints = {};
  private rules: IRuleData[] = [];
  private initialRules: Rule[] = [
    { id: 'dateTime', handler: (data: any, dt: DateTime) => dt, require: new Set() },
    { id: 'year', handler: (data: any, dt: DateTime) => dt.get('year'), require: new Set() },
    { id: 'month', handler: (data: any, dt: DateTime) => dt.get('month'), require: new Set() },
    { id: 'date', handler: (data: any, dt: DateTime) => dt.get('date'), require: new Set() },
    { id: 'week', handler: (data: any, dt: DateTime) => dt.get('week'), require: new Set() },
    { id: 'day', handler: (data: any, dt: DateTime) => dt.get('day'), require: new Set() },
    { id: 'hour', handler: (data: any, dt: DateTime) => dt.get('hour'), require: new Set() },
    { id: 'minute', handler: (data: any, dt: DateTime) => dt.get('minute'), require: new Set() },
  ];

  public async load (schedule: ISchedule) {
    this.constraints = schedule.constraints;
    this.rules = schedule.rules;
  }

  public async run (begin: Date, end: Date) {
    const resolver = new RuleResolver(this.initialRules);
    const dateTime = new DateTime(begin, this.constraints);
    for (const rule of this.rules) {
      resolver.addRule(rule);
    }
    // Init
    for (const rule of this.initialRules) {
      resolver.emit(rule.id, dateTime);
    }
    // Start
    while (before(dateTime, end)) {
      dateTime.next((id, ...args) => resolver.emit(id, ...args), 'minute');
    }
    return resolver.out;
  }

}
