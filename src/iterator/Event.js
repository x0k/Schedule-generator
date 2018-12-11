export default class Event {

  constructor (data) {
    this._name = data.name;
    this.handler = data.handler;
    if (data.value) {
      this.value = data.value;
    }
    this._listners = new Set();
  }

  get name () {
    return this._name;
  }

  getValue (data, result) {
    if (this.value)
      return this.value(data);
    return result;
  }

  addListner (name) {
    this._listners.add(name);
  }

  delListner (name) {
    this._listners.delete(name);
  }

  get listners () {
    return this._listners;
  }

}
