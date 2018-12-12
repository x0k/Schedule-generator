export default class EventProvider {

  static _sortEvents (a, b) {
    let ap = a.path,
      al = ap.length,
      bp = b.path,
      bl = bp.length;
    for (let i = 0; i < Math.min(al, bl); i++) {
      let av = ap[i],
        bv = bp[i];
      if (av > bv) {
        return -1;
      } else if (av < bv) {
        return 1;
      }
    }
    if (al > bl) {
      return -1;
    } else if (al < bl) {
      return 1;
    }
    return 0;
  }

  static _findEvents (names, events) {
    let result = [],
      path = [],
      find = nodes => {
        for (let i = 0; i < nodes.length; i++) {
          path.push(i);
          let { name, listners } = nodes[i];
          if (names.has(name)) {
            result.push({ name, path: path.slice(0) });
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

  static _getByPath (events, path) {
    let result;
    while (path.length) {
      let index = path.shift();
      result = events[index];
      events = result.listners;
    }
    return result;
  }

  constructor () {
    this._events = [];
    this._eventsCount = 0;
    this._values = {};
  }

  addEvent (event) {
    if (event.require.size) {
      let order = EventProvider._findEvents(event.require, this._events);
      if (order.length > 1) {
        order.sort(EventProvider._sortEvents);
      }
      let parent = EventProvider._getByPath(this._events, order[0].path);
      parent.addListner(event);
    } else {
      this._events.push(event);
    }
    this._eventsCount++;
  }

  emit (event, ...args) {
    let result = event.handler(this._values, ...args),
      value = result || result === 0 ? event.getValue(this._values, result) : null;
    console.log(`name: ${event.name}, result: ${result}, value: ${result}`);
    this._values[event.name] = value;
    for (let listner of event.listners) {
      this.emit(listner, ...args);
    }
  }

  get events () {
    return this._events;
  }

}
