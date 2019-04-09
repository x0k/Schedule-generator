export interface IConstraints {
  step?: number
}
export interface IRuleData {
  id: string;
  expression: any[];
  require?: string[];
}

export interface ISchedule {
  name: string;
  from: number;
  to: number;
  constraints: IConstraints;
  rules: IRuleData[];
}
