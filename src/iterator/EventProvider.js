export default class EventProvider {

  constructor (events) {
    for (const eventName of Object.keys(events)) {
      const event = events[eventName];
      this.addEvent(eventName, event);
    }
  }

  addEvent (name, event) {
    this.events[name] = event;
  }

  hasEvent (name) {
    return name in this.events;
  }

  getEvent (name) {
    return this.events[name];
  }

  delEvent (name) {
    if (this.hasEvent(name)) {
      delete this.events[name];
      if (this.values[name]) {
        delete this.values[name];
      }
    }
  }

  emit (name, ...args) {
    const event = this.events[name];
    this.values[name] = event.handler(this.values, ...args);
    for (const eventName of event.listners) {
      this.emit(eventName, ...args);
    }
  }

}
