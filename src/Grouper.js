import { deepEqual } from 'fast-equals';

export class Group {

  constructor (value, dateTime) {
    this._value = value;
    this._points = [ dateTime.toTime() ];
  }

  addPoint (dateTime) {
    this._points.push(dateTime.toTime());
  }

  get value () {
    return this._value;
  }

  get points () {
    return this._points;
  }

}

export class Grouper {

  constructor (extraxtor) {
    this._groups = [];
    this._extraxtor = extraxtor;
  }

  async register (data) {
    let dateTime = data['dateTime'],
      value = this._extraxtor(data);
    for (let group of this._groups) {
      if (deepEqual(group.value, value)) {
        group.addPoint(dateTime);
        return group;
      }
    }
    let group = new Group(value, dateTime);
    this._groups.push(group);
    return group;
  }

  get groups () {
    return this._groups;
  }

}