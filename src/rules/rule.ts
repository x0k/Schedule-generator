export type RuleHandler = (...args: any[]) => any;

export interface IRuleData {
  id: string;
  expression: any[];
  require?: string[];
}

export class Rule {

  public id: string;
  public handler: RuleHandler;
  public require: Set<string>;

  constructor (data: IRuleData, toHandler: (expression: any[]) => RuleHandler) {
    this.id = data.id;
    this.handler = toHandler(data.expression);
    this.require = data.require ? new Set(data.require) : new Set();
  }

}
