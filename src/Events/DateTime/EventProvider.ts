import Event from './Event';

export default class EventProvider {

  protected values: { [name: string]: any } = {};
  protected events: { [name: string]: Event } = {};

  constructor (events: { [name: string]: Event }) {
    for (const eventName of Object.keys(events)) {
      const event = events[eventName];
      this.addEvent(eventName, event);
    }
  }

  public addEvent (name: string, event: Event) {
    this.events[name] = event;
  }

  public hasEvent (name: string): boolean {
    return name in this.events;
  }

  public getEvent (name: string): Event {
    return this.events[name];
  }

  public emit (name: string, ...args): void {
    const event = this.events[name];
    this.values[name] = event.handler(this.values, ...args);
    for (const eventName of event.listners) {
      this.emit(eventName, ...args);
    }
  }

}
