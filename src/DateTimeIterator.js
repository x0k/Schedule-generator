import DateTime from './DateTime';
import Event from './Event';
import EventProvider from './EventProvider';

export default class DateTimeIterator extends EventProvider {

  constructor (partion) {
    super();
    const events = [
      { name: 'dateTime', handler: (data, dt) => dt, },
      { name: 'years', handler: (data, dt) => dt.year, },
      { name: 'months', handler: (data, dt) => dt.month, },
      { name: 'weeks', handler: (data, dt) => dt.week, },
      { name: 'date', handler: (data, dt) => dt.date, },
      { name: 'hours', handler: (data, dt) => dt.hours, },
      { name: 'minutes', handler: (data, dt) => dt.minutes, },
    ];
    this.initialEvents = {};
    for (let data of events) {
      this.initialEvents[data.name] = new Event(data);
      super.addEvent(this.initialEvents[data.name]);
    }
    this.addEvent({
      name: 'day',
      require: [ 'date' ],
      handler: (data, dt) => dt.day,
    });
  }

  async start (begin, end) {
    const dateTime = new DateTime(begin);
    // Init
    for (let event of Object.values(this.initialEvents)) {
      this.emit(event, dateTime);
    }
    // Start
    while (dateTime.before(end)) {
      dateTime.next((name, ...args) => this.emit(this.initialEvents[name], ...args));
    }
  }

  async addEvent (data) {
    // TODO: Check if this event exist then update them
    let name = data.name;
    if (this.hasEvent(name)) {
      let oldEvent = this.getEvent(name),
        addedEvent = new Event(data),
        oldName = name + 'Old',
        addedName = name + 'Added',
        newEvent = new Event({
          name,
          require: [ oldName, addedName ],
          handler: (data) => data[oldName] || data[addedName],
        });
      oldEvent.name = oldName;
      addedEvent.name = addedName;
      await super.addEvent(addedEvent);
      await super.addEvent(newEvent);
    } else {
      let event = new Event(data);
      await super.addEvent(event);
    }
  }

}
