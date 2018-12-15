import DateTime from './DateTime';
import Event from './events/Event';
import EventProvider from './events/EventProvider';

export default class DateTimeIterator extends EventProvider {

  constructor () {
    super();
    const events = [
      { name: 'dateTime', handler: (data, dt) => dt, value: (data, result, dt) => dt },
      { name: 'years', handler: (data, dt) => dt.year, value: (data, result, dt) => dt.year },
      { name: 'months', handler: (data, dt) => dt.month, value: (data, result, dt) => dt.month },
      { name: 'weeks', handler: (data, dt) => dt.week, value: (data, result, dt) => dt.week },
      { name: 'date', handler: (data, dt) => dt.date, value: (data, result, dt) => dt.date },
      { name: 'day', handler: (data, dt) => dt.day, value: (data, result, dt) => dt.day },
      { name: 'hours', handler: (data, dt) => dt.hours, value: (data, result, dt) => dt.hours },
      { name: 'minutes', handler: (data, dt) => dt.minutes, value: (data, result, dt) => dt.minutes },
    ];
    this.initialEvents = {};
    for (let data of events) {
      this.initialEvents[data.name] = new Event(data);
      super.addEvent(this.initialEvents[data.name]);
    }
  }

  async start (begin, end, step = 60000) {
    const dateTime = new DateTime(begin),
      minutes = Math.round(DateTime.toMinutes(step)) || 1,
      events = {
        'years': 'dateTime',
        'months': 'years',
        'weeks': 'months',
        'date': 'weeks',
        'day': 'date',
        'hours': 'day',
        'minutes': 'hours',
      },
      enabled = (name, data) => {
        let event = events[name],
          val = data[event];
        return val || val === 0;
      };
    // Init
    for (let event of Object.values(this.initialEvents)) {
      this.emit(event, dateTime);
    }
    // Start
    while (dateTime.before(end)) {
      dateTime.next((name, ...args) => {
        if (enabled(name, this._values))
          this.emit(this.initialEvents[name], ...args);
      }, minutes);
    }
  }

  async addEvent (data) {
    let name = data.name;
    if (this.hasEvent(name)) {
      if (name in this.initialEvents) {
        let event = this.initialEvents[name];
        event.handler = data.handler;
      } else {
        throw new Error(`Event ${name} are exist!`);
        /*
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
        */
      }
    } else {
      let event = new Event(data);
      await super.addEvent(event);
    }
  }

}
