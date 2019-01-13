import { deepEqual } from 'fast-equals';

import { IRuleData, Rule } from './rule';

type RuleTree = Map<string, IRuleTree>;
interface IRuleTree extends Map<string, RuleTree> { }

export class RuleResolver {

  public static _getPaths (identifiers: Set<string>, tree: IRuleTree) {
    const result = new Map();
    for (const [id, value] of tree) {
      const childrens = value.size ? this._getPaths(identifiers, value) : new Map();
      if (identifiers.has(id) || childrens.size) {
        result.set(id, childrens);
      }
    }
    return result;
  }

  private rules: { [id: string]: Rule } = {};
  private values: { [id: string]: any } = {};
  private tree: IRuleTree = new Map();

  public hasRule (id: string) {
    return id in this.rules;
  }

  public getRule (id: string) {
    return this.rules[id];
  }

  public addRule (rule: Rule) {
    if (this.hasRule(rule.id)) {
      throw new Error(`Rule ${rule.id} are exist`);
    }
    let paths = rule.require.size ? RuleResolver._getPaths(rule.require, this.tree) : new Map();
    let parent = this.tree;
    let init = true;
    while ((paths.size === 1 || paths.size > 1) && init) {
      init = false;
      const last = Array.from(paths.keys()).pop();
      paths = paths.get(last);
      const p = parent.get(last);
      if (!p) {
        throw new Error(`Parent ${last} doesn't exist`);
      }
      parent = p;
    }
    parent.set(rule.id, new Map());
    this.rules[rule.id] = rule;
    return rule;
  }

  public createRule (ruleData: IRuleData) {
    const rule = new Rule(ruleData);
    return this.addRule(rule);
  }

  public getRuleListners (id: string) {
    const find = (tree: IRuleTree): IRuleTree | false => {
      if (tree.has(id)) {
        const ls = tree.get(id);
        if (!ls) {
          throw new Error(`Listner of ${id} are undefined`);
        }
        return ls;
      }
      for (const value of tree.values()) {
        if (value.size > 0) {
          const result = find(value);
          if (result) {
            return result;
          }
        }
      }
      return false;
    };
    return find(this.tree);
  }

  public emit (ruleId: string, ...args: any[]) {
    const raise = (id: string, listners: IRuleTree | false) => {
      const rule = this.getRule(id);
      const value = rule.handler(this.values, ...args);
      if (!deepEqual(this.values[id], value)) {
        this.values[id] = value;
        if (listners && listners.size) {
          for (const [listnerId, listnerValue] of listners) {
            raise(listnerId, listnerValue);
          }
        }
      }
    };
    raise(ruleId, this.getRuleListners(ruleId));
  }

}
