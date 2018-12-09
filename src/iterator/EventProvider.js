export default class EventProvider {

  addEvent (event) {
    this.events[event.name] = event;
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
    let event = this.events[name],
      result = event.handler(this.values, ...args),
      value = result || result === 0 ? event.getValue(this.values, result) : false;
    this.values[name] = value;
    for (const eventName of event.listners) {
      this.emit(eventName, ...args);
    }
  }

}
