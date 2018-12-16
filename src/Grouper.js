import { deepEqual } from 'fast-equals';

export default class Grouper {

  constructor (step = 60000) {
    this._step = step;
  }

  async toList (groups) {
    if (groups.length) {
      let line = [],
        result = [];
      for (let group of groups) {
        line.push(...group.points.map(point => ({ point, value: group.value, length: this._step })));
      }
      line.sort((a,b) => a.point - b.point);
      let last = line[0];
      for (let i = 1; i < line.length; i++) {
        let current = line[i];
        if (last.point + last.length === current.point && deepEqual(last.value, current.value)) {
          last.length += current.length;
        } else {
          result.push(last);
          last = current;
        }
      }
      result.push(last);
      return result;
    }
  }

}