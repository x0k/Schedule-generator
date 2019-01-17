import { deepEqual } from 'fast-equals';
import { DateTimeIterator } from './rules/dateTimeIterator';
import { Event } from './event';
import { IConstraints, DateTime } from './dateTime/dateTime';
import { ISchedule } from './schedule';
import { toHandler } from './rules/handlerBuilder';

export class Generator {

  private iterator: DateTimeIterator = new DateTimeIterator();
  private events: Event[] = [];
  private constraints: IConstraints = {};

  public async load (schedule: ISchedule) {
    // Load constraints
    this.constraints = schedule.constraints;
    for (const key of Object.keys(this.constraints)) {
      const expression = schedule.constraints[key].expression;
      if (expression) {
        this.constraints[key].handler = toHandler(expression);
      }
    }
    // Load events
    for (const rule of schedule.rules) {
      rule.handler = toHandler(rule.expression);
      this.iterator.createRule(rule);
    }
    // Load extractor
    return this.iterator.createRule({
      id: schedule.name,
      require: [ 'year', 'month', 'date', 'week', 'day', 'hour', 'minute', schedule.extractor ],
      handler: (values) => this.register(values.dateTime, values[schedule.extractor]),
    });
  }

  public async run (start: Date, end: Date) {
    await this.iterator.start(start, end, this.constraints);
    return this.events;
  }

  private register (dateTime: DateTime, value: any) {
    for (const event of this.events) {
      if (deepEqual(event.value, value)) {
        event.addPoint(dateTime);
        return event;
      }
    }
    this.events.push(new Event(value, dateTime));
  }

}
