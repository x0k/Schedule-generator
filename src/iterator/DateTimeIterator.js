import DateTime from './DateTime';
import DateTimeEvent from './DateTimeEvent';
import EventProvider from './EventProvider';

export default class DateTimeIterator extends EventProvider {

  constructor () {
    super();
    const events = [
      {
        name: 'dateTime',
        handler: (data, dt) => dt,
        level: 0,
      },
      {
        name: 'minutes',
        handler: (data, dt) => dt.minutes,
        level: 0,
      },
      {
        name: 'hours',
        handler: (data, dt) => dt.hours,
        level: 1,
      },
      {
        name: 'days',
        handler: (data, dt) => dt.date,
        level: 2,
      },
      {
        name: 'day',
        handler: (data, dt) => dt.day,
        level: 2,
      },
      {
        name: 'weeks',
        handler: (data, dt) => dt.week,
        level: 3
      },
      {
        name: 'months',
        handler: (data, dt) => dt.month,
        level: 4
      },
      {
        name: 'years',
        handler: (data, dt) => dt.year,
        level: 5,
      },
    ];
    for (let event of events) {
      this.addEvent(new DateTimeEvent(event));
    }
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

  addListner (listner) {
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
      target.addListner(listner.name);
      listner.level = target.level;
    } else {
      throw new Error(`Target not found for ${listner.name}`);
    }
    this.addEvent(new DateTimeEvent(listner));
  }

}
