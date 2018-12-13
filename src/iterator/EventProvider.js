import { deepEqual } from 'fast-equals';

export default class EventProvider {

  static _comparePaths (pathA, pathB) {
    let lenA = pathA.length,
      lenB = pathB.length;
    for (let i = 0; i < Math.min(lenA, lenB); i++) {
      let valA = pathA[i],
        valB = pathB[i];
      if (valA > valB) {
        return -1;
      } else if (valA < valB) {
        return 1;
      }
    }
    if (lenA > lenB) {
      return -1;
    } else if (lenA < lenB) {
      return 1;
    }
    return 0;
  }

  static _getPaths (names, events) {
    let result = [],
      path = [],
      find = nodes => {
        for (let i = 0; i < nodes.length; i++) {
          path.push(i);
          let { name, listners } = nodes[i];
          if (names.has(name)) {
            result.push(path.slice(0));
            names.delete(name);
          }
          if (listners.length) {
            find(listners);
          }
          path.pop();
        }
      };
    find(events);
    return result;
  }

  static _selectPath (paths) {
    if (paths.length === 1)
      return paths[0];
    // Sort and filter paths
    paths.sort(EventProvider._comparePaths);
    let category = paths[0][0],
      filteredPaths = paths.filter(path => path[0] === category);
    if (filteredPaths.length === 1)
      return filteredPaths[0];
    // Extraction of the max common path
    let path = [ category ],
      len = Math.min(...filteredPaths.map(path => path.length));
    for (let i = 1; i < len; i++) {
      let standard = filteredPaths[0][i],
        flag = true;
      for (let j = 1; j < filteredPaths.length; j++) {
        flag = flag && filteredPaths[j][i] === standard;
      }
      if (flag) {
        path.push(standard);
      } else {
        break;
      }
    }
    return path;
  }

  static _getEvent (events, path) {
    let event;
    while (path.length) {
      let index = path.shift();
      event = events[index];
      events = event.listners;
    }
    return event;
  }

  static _setEvent (events, path, newEvent) {
    let event;
    while (path.length > 1) {
      let index = path.shift();
      event = events[index];
      events = event.listners;
    }
    event.listners[path[0]] = newEvent;
  }

  _getEventPath (name) {
    let paths = EventProvider._getPaths(new Set([ name ]), this._events);
    if (!paths.length)
      throw new Error(`Event ${name} doesn't exist!`);
    return paths[0];
  }

  constructor () {
    this._events = [];
    this._eventNames = new Set();
    this._eventsCount = 0;
    this._values = {};
  }

  hasEvent (name) {
    return this._eventNames.has(name);
  }

  getEvent (name) {
    let path = this._getEventPath(name);
    return EventProvider._getEvent(this._events, path);
  }

  addEvent (event) {
    if (event.require.size) {
      let paths = EventProvider._getPaths(event.require, this._events),
        path = EventProvider._selectPath(paths),
        parent = EventProvider._getEvent(this._events, path);
      parent.addListner(event);
    } else {
      this._events.push(event);
    }
    this._eventNames.add(event.name);
    this._eventsCount++;
  }

  updateEvent (newEvent) {
    let path = this._getEventPath(newEvent.name);
    EventProvider._setEvent(this._events, path, newEvent);
  }

  emit (event, ...args) {
    let result = event.handler(this._values, ...args),
      value = result || result === 0 ? event.getValue(this._values, result) : null;
    if (!deepEqual(this._values[event.name], value)) {
      this._values[event.name] = value;
      for (let listner of event.listners) {
        this.emit(listner, ...args);
      }
    }
  }

  get events () {
    return this._events;
  }

}
