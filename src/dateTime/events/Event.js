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

  getValue (data, result, ...args) {
    if (this._value)
      return this._value(data, result, ...args);
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

  set handler (value) {
    this._handler = value;
  }

  get require () {
    return this._require;
  }

  get listners () {
    return this._listners;
  }

}
