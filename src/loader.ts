import { IConstraints } from './core/dateTime'
import { Generator } from './generator'
import { ISchedule } from './core/schedule'
import { IRuleData } from './core/rule'

export class Loader {
  private constraints: IConstraints = {};
  private rules: IRuleData[] = [];

  public async load (...schedules: ISchedule[]) {
    for (const schedule of schedules) {
      this.constraints = schedule.constraints
      this.rules = schedule.rules
    }
    return new Generator(this.rules, this.constraints)
  }
}
