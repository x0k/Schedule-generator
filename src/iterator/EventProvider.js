import { deepEqual } from 'fast-equals';

export default class EventProvider {

  constructor () {
    this._events = {};
    this.eventsCount = 0;
    this.values = {};
    this.executed = new Set();
  }

  addEvent (event) {
    if (this.hasEvent(event.name)) {
      throw new Error(`Event ${event.name} already exist`);
    }
    this._events[event.name] = event;
    this.eventsCount++;
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
      this.eventsCount--;
      if (this.values[name]) {
        delete this.values[name];
      }
    }
  }

  emit (name, ...args) {
    let event = this._events[name],
      result = event.handler(this.values, ...args),
      value = result || result === 0 ? event.getValue(this.values, result) : null;
    this.executed.add(name);
    if (!deepEqual(this.values[name], value)) {
      this.values[name] = value;
      if (this.executed.size < this.eventsCount) {
        for (let listner of event.listners) {
          if (!this.executed.has(listner)) {
            this.emit(listner, ...args);
          }
        }
      }
    }
  }

  clear () {
    this.executed.clear();
  }

  get events () {
    return this._events;
  }

}
