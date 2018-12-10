export default class EventProvider {

  constructor () {
    this._events = {};
    this.values = {};
  }

  addEvent (event) {
    this._events[event.name] = event;
  }

  hasEvent (name) {
    return name in this._events;
  }

  getEvent (name) {
    return this._events[name];
  }

  delEvent (name) {
    if (this.hasEvent(name)) {
      delete this._events[name];
      if (this.values[name]) {
        delete this.values[name];
      }
    }
  }

  emit (name, ...args) {
    let event = this._events[name],
      result = event.handler(this.values, ...args),
      value = result || result === 0 ? event.getValue(this.values, result) : null;
    this.values[name] = value;
    for (const eventName of event.listners) {
      this.emit(eventName, ...args);
    }
  }

  get events () {
    return this._events;
  }

}
