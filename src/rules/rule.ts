export type RuleHandler = (values: { [id: string]: any }, ...args: any[]) => any;

export interface IRuleData {
  id: string;
  handler: RuleHandler;
  require?: string[];
}

export class Rule {

  public id: string;
  public handler: RuleHandler;
  public require: Set<string>;

  constructor (data: IRuleData) {
    this.id = data.id;
    this.handler = data.handler;
    this.require = data.require ? new Set(data.require) : new Set();
  }

}
