import DateTime from './DateTime';
import Event from './events/Event';
import EventProvider from './events/EventProvider';

export default class DateTimeIterator extends EventProvider {

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
    const events = [
      { id: 'dateTime', handler: (data, dt) => dt },
      { id: 'year', handler: (data, dt) => dt.year },
      { id: 'month', handler: (data, dt) => dt.month },
      { id: 'date', handler: (data, dt) => dt.date },
      { id: 'week', handler: (data, dt) => dt.week },
      { id: 'day', handler: (data, dt) => dt.day },
      { id: 'hour', handler: (data, dt) => dt.hour },
      { id: 'minute', handler: (data, dt) => dt.minute },
    ];
    this.initialEvents = {};
    for (let data of events) {
      this.initialEvents[data.id] = new Event(data);
      super.addEvent(this.initialEvents[data.id]);
    }
  }

  async start (begin, end, constraints) {
    const dateTime = new DateTime(begin, constraints);
    // Init
    for (let event of Object.values(this.initialEvents)) {
      this.emit(event, dateTime);
    }
    // Start
    while (DateTimeIterator.before(dateTime, end)) {
      dateTime.next((id, ...args) => this.emit(this.initialEvents[id], ...args), 'minute');
    }
  }

  async addEvent (data) {
    let id = data.id;
    if (this.hasEvent(id)) {
      throw new Error(`Event ${id} are exist!`);
    } else {
      let event = new Event(data);
      await super.addEvent(event);
      return event;
    }
  }

  setStep (time) {
    let minutes = Math.round(time / 60000);
    this._step = minutes || 1;
  }

}
