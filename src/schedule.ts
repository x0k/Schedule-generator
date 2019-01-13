import { IConstraints } from './dateTime/dateTime';
import { IRuleData } from './rules/rule';

export interface IScheduleHandler extends IRuleData {
  expression: any[];
}

export interface ISchedule {
  name: string;
  extractor: string;
  constraints: IConstraints;
  rules: IScheduleHandler[];
}
