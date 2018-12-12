import DateTime from './DateTime';
import Event from './Event';
import EventProvider from './EventProvider';

export default class DateTimeIterator extends EventProvider {

  _raiseEvent (name, ...args) {
    let event = this.initialEvents[name];
    this.emit(event, ...args);
  }

  constructor () {
    super();
    const events = [
      {
        name: 'years',
        handler: (data, dt) => dt.year,
      },
      {
        name: 'months',
        handler: (data, dt) => dt.month,
      },
      {
        name: 'weeks',
        handler: (data, dt) => dt.week,
      },
      {
        name: 'day',
        handler: (data, dt) => dt.day,
      },
      {
        name: 'days',
        handler: (data, dt) => dt.date,
      },
      {
        name: 'hours',
        handler: (data, dt) => dt.hours,
      },
      {
        name: 'minutes',
        handler: (data, dt) => dt.minutes,
      },
      {
        name: 'dateTime',
        handler: (data, dt) => dt,
      },
    ];
    this.initialEvents = {};
    for (let data of events) {
      this.initialEvents[data.name] = new Event(data);
      this.addEvent(this.initialEvents[data.name]);
    }
  }

  async start (begin, end) {
    const dateTime = new DateTime(begin),
      onChange = this._raiseEvent.bind(this);
    // Start
    while (dateTime.before(end)) {
      dateTime.next(onChange);
    }
  }

  addEvent (data) {
    // TODO: Check if this event exist then update them
    let event = new Event(data);
    super.addEvent(event);
  }

}
