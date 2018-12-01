import DateTimeIterator from './iterator/DateTimeIterator';

export default class Solver {

  private iterator;

  constructor () {
    this.iterator = new DateTimeIterator();
  }

  public run (begin: Date, end: Date, event: string): any[] {
    const data = [];
    this.iterator.addListner('solver', {
      require: ['subjects'],
      handler: (v) => data.push(v),
    });
    this.iterator.start(begin, end);
    return data;
  }

}
