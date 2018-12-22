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

  static _getPaths (identifiers, events) {
    let result = [],
      path = [],
      find = nodes => {
        for (let i = 0; i < nodes.length; i++) {
          path.push(i);
          let { id, listners } = nodes[i];
          if (identifiers.has(id)) {
            result.push(path.slice(0));
            identifiers.delete(id);
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
      path = [ category ],
      filteredPaths = paths.filter(path => path[0] === category);
    if (filteredPaths.length === 1)
      return path;
    // Extraction of the max common path
    let len = Math.min(...filteredPaths.map(path => path.length));
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

  static _getEvent (tree, path) {
    let event;
    while (path.length) {
      let index = path.shift();
      event = tree[index];
      tree = event.listners;
    }
    return event;
  }

  _getEventPath (id) {
    let paths = EventProvider._getPaths(new Set([ id ]), this._events);
    if (!paths.length)
      throw new Error(`Event ${id} doesn't exist!`);
    return paths[0];
  }

  constructor () {
    this._events = new Set();
    this._tree = [];
    this._values = {};
  }

  hasEvent (id) {
    return this._events.has(id);
  }

  getEvent (id) {
    let path = this._getEventPath(id);
    return EventProvider._getEvent(this._tree, path);
  }

  addEvent (event) {
    if (event.require && event.require.size) {
      let paths = EventProvider._getPaths(event.require, this._tree);
      let path = EventProvider._selectPath(paths),
        parent = EventProvider._getEvent(this._tree, path);
      parent.addListner(event);
    } else {
      this._tree.push(event);
    }
    this._events.add(event.id);
  }

  emit (event, ...args) {
    let value = event.handler(this._values, ...args);
    if (!deepEqual(this._values[event.id], value)) {
      this._values[event.id] = value;
      for (let listner of event.listners) {
        this.emit(listner, ...args);
      }
    }
  }

  get events () {
    return this._events;
  }

  get eventsTree () {
    return this._tree;
  }

}
