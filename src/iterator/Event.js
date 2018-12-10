export default class Event {

  constructor (data) {
    this._name = data.name;
    this.handler = data.handler;
    if (data.value) {
      this.value = data.value;
    }
    this.listners = [];
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
    this.listners.push(name);
  }

  delListner (name) {
    const index = this.listners.indexOf(name);
    if (index >= 0) {
      this.listners.splice(index, 1);
    }
  }

}
