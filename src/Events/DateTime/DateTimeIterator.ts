import DateTime from './DateTime';
import { DateTimeEvent, THandler } from './DateTimeEvent';

interface IListner {
  event: string;
  name: string;
  require?: string[];
  handler: THandler;
}

export default class DateTimeIterator {

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

  public addListner (listner: IListner) {
    if (this.hasEvent(listner.event)) {
      const event = this.events[listner.event];
      event.add(listner.name, listner.handler);
    }
  }

  public load (listners: IListner[]): void {
    for (const listner of listners) {
      this.addListner(listner);
    }
  }

  public hasEvent (name): boolean {
    return name in this.events;
  }

  private emit (name, dateTime: DateTime) {
    this.events[name].run(dateTime, this.values);
  }

}
