import { deepEqual } from 'fast-equals';

export default class RuleResolver {

  static _getPaths (identifiers, tree) {
    let result = new Map();
    for (let [id, value] of tree) {
      let childrens = value.size ? this._getPaths(identifiers, value) : new Map();
      if (identifiers.has(id) || childrens.size)
        result.set(id, childrens);
    }
    return result;
  }

  constructor () {
    this.rules = {};
    this.values = {};
    this.tree = new Map();
  }

  hasRule (id) {
    return id in this.rules;
  }

  getRule (id) {
    return this.rules[id];
  }

  addRule (rule) {
    if (this.hasRule(rule.id))
      throw new Error(`Rule ${rule.id} are exist`);
    let paths = rule.require.size ? RuleResolver._getPaths(rule.require, this.tree) : new Map();
    let parent = this.tree;
    let init = true;
    while (paths.size === 1 || paths.size > 1 && init) {
      let last = Array.from(paths.keys()).pop();
      paths = paths.get(last);
      parent = parent.get(last);
      init = false;
    }
    parent.set(rule.id, new Map());
    this.rules[rule.id] = rule;
    return rule;
  }

  getRuleListners (id) {
    let find = tree => {
      if (tree.has(id))
        return tree.get(id);
      for (let value of tree.values())
        if (value.size > 0) {
          let result = find(value);
          if (result)
            return result;
        }
      return false;
    }
    return find(this.tree);
  }

  emit (ruleId, ...args) {
    let raise = (id, listners) => {
      let rule = this.getRule(id);
      let value = rule.handler(this.values, ...args);
      if (!deepEqual(this.values[id], value)) {
        this.values[id] = value;
        for (let [listnerId, value] of listners) {
          raise(listnerId, value);
        }
      }
    }
    raise(ruleId, this.getRuleListners(ruleId));
  }

}
