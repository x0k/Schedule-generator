import { DateTime, IConstraints } from './core/dateTime';
import { RuleResolver } from './ruleResolver';
import { ISchedule } from './core/schedule';
import { IRuleData, Rule } from './core/rule';

const initResolver = async (
  initialRules: Rule[],
  begin: Date,
  end: Date,
  constraints: IConstraints,
  rules: IRuleData[],
) => {
  const dateTime = new DateTime(begin, end, constraints);
  const resolver = new RuleResolver(dateTime, initialRules);
  for (const rule of rules) {
    resolver.addRule(rule);
  }
  for (const rule of initialRules) {
    resolver.emit(rule.id, dateTime);
  }
  return resolver;
};

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

  public async load (...schedules: ISchedule[]) {
    for (const schedule of schedules) {
      this.constraints = schedule.constraints;
      this.rules = schedule.rules;
    }
    return this;
  }

  public async run (begin: Date, end: Date) {
    return await initResolver(this.initialRules, begin, end, this.constraints, this.rules);
  }

  public async show ({ from, to, constraints, rules }: ISchedule, begin?: Date, end?: Date) {
    if (!begin) {
      begin = new Date(from);
    }
    if (!end) {
      end = new Date(to);
    }
    return await initResolver(this.initialRules, begin, end, constraints, rules);
  }

}
