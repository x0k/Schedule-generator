export default class Event {

  constructor (data) {
    this._name = data.name;
    this._handler = data.handler;
    if (data.value) {
      this._value = data.value;
    }
    this._require = new Set(data.require || []);
    this._listners = [];
  }

  getValue (data, result) {
    if (this._value)
      return this._value(data, result);
    return result;
  }

  addListner (name) {
    this._listners.push(name);
  }

  get name () {
    return this._name;
  }

  set name (name) {
    this._name = name;
  }

  get handler () {
    return this._handler;
  }

  get require () {
    return this._require;
  }

  get listners () {
    return this._listners;
  }

}
