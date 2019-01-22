import { IConstraint } from './dateTime/dateTime';
import { IRuleData } from './rules/rule';

export interface ISchedule {
  name: string;
  extractor: string;
  constraints: { [name: string]: IConstraint };
  rules: IRuleData[];
}
