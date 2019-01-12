import DateTime from './dateTime';
import RuleResolver from './rules/ruleResolver';
import Rule from './rules/rule';

export default class DateTimeIterator extends RuleResolver {

  static before (dateTime, date) {
    if (dateTime.year < date.getFullYear())
      return true;
    if (dateTime.year === date.getFullYear()) {
      if (dateTime.month < date.getMonth())
        return true;
      if (dateTime.month === date.getMonth()) {
        if (dateTime.date < date.getDate())
          return true;
        if (dateTime.date === date.getDate()) {
          if (dateTime.hour < date.getHours())
            return true;
          if ((dateTime.hour === date.getHours()) && dateTime.minute < date.getMinutes())
            return true;
        }
      }
    }
    return false;
  }

  static after (dateTime, date) {
    if (dateTime.year > date.getFullYear())
      return true;
    if (dateTime.year === date.getFullYear()) {
      if (dateTime.month > date.getMonth())
        return true;
      if (dateTime.month === date.getMonth()) {
        if (dateTime.date > date.getDate())
          return true;
        if (dateTime.date === date.getDate()) {
          if (dateTime.hour > date.getHours())
            return true;
          if ((dateTime.hour === date.getHours()) && dateTime.minute >= date.getMinutes())
            return true;
        }
      }
    }
    return false;
  }

  static isToday (dateTime, date) {
    return (dateTime.date === date.getDate()) && (dateTime.month === date.getMonth()) && (dateTime.year === date.getFullYear());
  }

  constructor () {
    super();
    const rules = [
      { id: 'dateTime', handler: (data, dt) => dt },
      { id: 'year', handler: (data, dt) => dt.year },
      { id: 'month', handler: (data, dt) => dt.month },
      { id: 'date', handler: (data, dt) => dt.date },
      { id: 'week', handler: (data, dt) => dt.week },
      { id: 'day', handler: (data, dt) => dt.day },
      { id: 'hour', handler: (data, dt) => dt.hour },
      { id: 'minute', handler: (data, dt) => dt.minute },
    ];
    this.initialRules = [];
    for (let rule of rules) {
      this.initialRules.push(rule.id);
      this.addRule(rule);
    }
  }

  addRule (data) {
    return super.addRule(new Rule(data));
  }

  async start (begin, end, constraints) {
    const dateTime = new DateTime(begin, constraints);
    // Init
    for (let id of this.initialRules) {
      this.emit(id, dateTime);
    }
    // Start
    while (DateTimeIterator.before(dateTime, end)) {
      dateTime.next(this.emit.bind(this), 'minute');
    }
  }

}
