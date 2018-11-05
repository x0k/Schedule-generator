interface IGroup {
  start: number;
  length: number;
  value: any;
}

export default class Grouper {

  private static getOffsetSize (offsetSize: string): number {
    switch (offsetSize) {
    case 'minutes':
      return 60000;
    case 'hours':
      return 3600000;
    case 'days':
      return 86400000;
    case 'weeks':
      return 604800000;
    }
  }

  private offsetSize: number;
  private groups: IGroup[] = [];
  private initialOffset: number;

  constructor (private now: Date, offsetSize: string) {
    this.offsetSize = Grouper.getOffsetSize(offsetSize);
    this.initialOffset = now.getTime();
  }

  public add (value: any): void {
    const last = (this.groups.length > 0) ? this.groups[this.groups.length - 1] : null;
    if (!last) {
      this.groups.push({
        length: this.offsetSize,
        start: this.initialOffset,
        value,
      });
    } else if (!(last.value === value)) {
      this.groups.push({
        length: this.offsetSize,
        start: last.start + last.length,
        value,
      });
    } else {
      last.length += this.offsetSize;
    }
  }

  public print (): void {
    for (const group of this.groups) {
      if (group.value) {
        console.log(`${this.dateToString(group.start, group.length)} - ${group.value}`);
      }
    }
  }

  private dayToName (day: number) {
    switch (day) {
    case 0:
      return 'Вс';
    case 1:
      return 'Пн';
    case 2:
      return 'Вт';
    case 3:
      return 'Ср';
    case 4:
      return 'Чт';
    case 5:
      return 'Пт';
    case 6:
      return 'Сб';
    }
  }

  private dateToString (start: number, length: number): string {
    const sDate = new Date(start),
      eDate = new Date(start + length);
    return `${sDate.getDate()}.${sDate.getMonth() + 1} ${this.dayToName(sDate.getDay())} ` +
      `${sDate.getHours()}:${sDate.getMinutes()} - ${eDate.getHours()}:${eDate.getMinutes()}`;
  }

}
