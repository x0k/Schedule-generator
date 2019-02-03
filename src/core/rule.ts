import { Interpreter, THandler } from './interpreter';

export interface IRuleData {
  id: string;
  expression: any[];
  require?: string[];
}

export class Rule {

  public id: string;
  public handler: THandler;
  public require: Set<string>;

  constructor (data: IRuleData, builder: Interpreter ) {
    this.id = data.id;
    this.handler = builder.toHandler(data.expression);
    this.require = data.require ? new Set(data.require) : new Set();
  }

}
