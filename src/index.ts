/**
 * Builds json paths - an object with all possible paths in json data.
 * Paths are calculated to primitive values and separated by dot.
 * Array indexes are represented by #.
 */

import { getAllPaths } from './getAllPaths';

export type JsonPathsResult = Record<string, number | Record<string, number>>;
export type JsonPathsRules = Record<
  string,
  boolean | null | 'value' | ((origValue: unknown, pathStr: string) => unknown)
>;

export type JsonPathsOptions = {
  sep?: string;
  sepReplacement?: string;
  indexReplacement?: string;
};

export const defaultOptions: Required<JsonPathsOptions> = {
  sep: '.',
  sepReplacement: '~',
  indexReplacement: '#',
};

export function jsonPaths(
  data: unknown,
  rules: JsonPathsRules = {},
  options: JsonPathsOptions = {},
) {
  return new JsonPaths(data, rules, options).calc();
}

class JsonPaths {
  options: Required<JsonPathsOptions>;
  result: JsonPathsResult = {};

  constructor(
    protected data: unknown,
    protected rules: JsonPathsRules,
    options: JsonPathsOptions,
  ) {
    this.options = { ...defaultOptions, ...options };
  }

  calc() {
    const { data } = this;
    if (!data || typeof data !== 'object') return this.result;
    const arr = Array.isArray(data) ? data : [data];
    arr.forEach((obj) => this.handleObj(obj));
    return this.result;
  }

  private handleObj(obj: Record<string, unknown>) {
    getAllPaths(obj).forEach(({ path, value }) => this.handlePath(path, value));
  }

  // eslint-disable-next-line visual/complexity
  private handlePath(path: string[], value: unknown) {
    const pathStr = getPathStr(path, this.options);
    let ruleValue = getRuleForLongestPrefix(pathStr, this.rules);
    if (!ruleValue) return;
    if (ruleValue === 'value') ruleValue = (value) => value;
    if (typeof ruleValue === 'function') {
      const transformedValue = ruleValue(value, pathStr);
      if (transformedValue === undefined) return;
      this.result[pathStr] = this.result[pathStr] || {};
      incrementByKey(
        this.result[pathStr] as Record<string, number>,
        String(transformedValue),
      );
    } else {
      incrementByKey(this.result as Record<string, number>, pathStr);
    }
  }
}

/**
 * Stringifies object path, replaces index with #.
 * E.g. ['pickle', 'steps', '0', 'type'] -> 'pickle.steps.#.type'
 */
function getPathStr(path: string[], opts: Required<JsonPathsOptions>) {
  const { sep, sepReplacement, indexReplacement } = opts;
  return path
    .map((key) => (/^\d+$/.test(key) ? indexReplacement : key))
    .map((key) => key.replaceAll(sep, sepReplacement))
    .join(sep);
}

function getRuleForLongestPrefix(pathStr: string, rules: JsonPathsRules) {
  const prefixes = Object.keys(rules).sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (prefix === '*' || pathStr.startsWith(prefix)) {
      return rules[prefix];
    }
  }

  return true;
}

function incrementByKey(obj: Record<string, number>, key: string) {
  obj[key] = obj[key] || 0;
  obj[key]++;
}
