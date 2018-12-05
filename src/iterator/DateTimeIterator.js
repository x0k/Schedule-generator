import DateTime from './DateTime';
import DateTimeEvent from './DateTimeEvent';
import EventProvider from './EventProvider';

export default class DateTimeIterator extends EventProvider {

  constructor () {
    super({
      dateTime: new DateTimeEvent((v, dt) => dt, 0),
      minutes: new DateTimeEvent((v, dt) => dt.minutes, 0),
      hours: new DateTimeEvent((v, dt) => dt.hours, 1),
      days: new DateTimeEvent((v, dt) => dt.date, 2),
      day: new DateTimeEvent((v, dt) => dt.day, 2),
      weeks: new DateTimeEvent((v, dt) => dt.week, 3),
      months: new DateTimeEvent((v, dt) => dt.month, 4),
      years: new DateTimeEvent((v, dt) => dt.year, 5),
    });
  }

  start (begin, end) {
    const dateTime = new DateTime(begin),
      onChange = this.emit.bind(this);
    // Init values
    const events = ['dateTime', 'minutes', 'hours', 'days', 'day', 'weeks', 'months', 'years'];
    for (const name of events) {
      this.emit(name, dateTime, this.values);
    }
    // Start
    while (dateTime.before(end)) {
      dateTime.next(onChange);
    }
  }

  addListner (name, listner) {
    let target = null;
    // Check required events and define target
    for (const eventName of listner.require) {
      if (this.hasEvent(eventName)) {
        const event = this.getEvent(eventName);
        if (!target) {
          target = event;
        } else if (event.level <= target.level) {
          target = event;
        }
      } else {
        throw new Error(`Required event: ${event} - not found.`);
      }
    }
    if (target) {
      target.addListner(name);
    } else {
      target = new DateTimeEvent(null, Number.MAX_VALUE);
    }
    this.addEvent(name, new DateTimeEvent(listner.handler, target.level));
  }

  /*delListner (name) {
    const event = this.getEvent(name);
    
  }*/

}
