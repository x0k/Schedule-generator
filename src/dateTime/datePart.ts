export class DatePart {

  constructor (
    public value: number,
    public limitNames: string[] = [],
    private step: number,
    private handler: (value: any) => any,
    private limit = (() => Number.MAX_VALUE),
  ) { }

  public next (value?: number) {
    this.value += value ? (value % this.step ? Math.ceil(value / this.step) * this.step : value) : this.step;
    const limit = this.limit();
    if (this.value < limit) {
      return 0;
    }
    const count = Math.floor(this.value / limit);
    this.value %= limit;
    return count;
  }

  get done () {
    return this.handler(this.value);
  }

}
