export type RuleHandler = (...args: any[]) => any;

export interface IHandlerBuilder {
  toHandler: (expression: any[]) => RuleHandler;
}

export interface IRuleData {
  id: string;
  expression: any[];
  require?: string[];
}

export class Rule {

  public id: string;
  public handler: RuleHandler;
  public require: Set<string>;

  constructor (data: IRuleData, builder: IHandlerBuilder ) {
    this.id = data.id;
    this.handler = builder.toHandler(data.expression);
    this.require = data.require ? new Set(data.require) : new Set();
  }

}
