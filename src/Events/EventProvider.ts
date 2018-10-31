import DateTime from './DateTime';
import { DateTimeEvent, IHandler } from './DateTimeEvent';

export default class EventProvider {

  private values: { [name: string]: any } = {};
  private events: { [name: string]: DateTimeEvent } = {
    days: new DateTimeEvent(),
    hours: new DateTimeEvent(),
    minutes: new DateTimeEvent(),
    months: new DateTimeEvent(),
    years: new DateTimeEvent(),
  };

  public start (begin: Date, end: Date) {
    const dateTime = new DateTime(begin),
      onChange = this.emit.bind(this);
    // Init values
    for (const name of Object.keys(this.events)) {
      this.events[name].run(dateTime, this.values);
    }
    // Start
    while (dateTime.before(end)) {
      dateTime.next(onChange);
    }
  }

  public on (name: string, handler: IHandler) {
    if (this.hasEvent(name)) {
      this.events[name].add(handler);
    }
  }

  public load (events: { [event: string]: IHandler[] }): void {

    for (const event of Object.keys(events)) {
      for (const handler of events[event]) {
        this.on(event, handler);
      }
    }

  }

  public hasEvent (name): boolean {
    return name in this.events;
  }

  private emit (name, dateTime: DateTime) {
    this.events[name].run(dateTime, this.values);
  }

}
