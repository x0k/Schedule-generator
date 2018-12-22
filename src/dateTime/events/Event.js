export default class Event {

  constructor (data) {
    this._id = data.id;
    this._handler = data.handler;
    this._require = new Set(data.require);
    this._listners = [];
  }

  addListner (name) {
    this._listners.push(name);
  }

  get id () {
    return this._id;
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
