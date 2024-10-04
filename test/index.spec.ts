import { test, expect } from 'vitest';
import { jsonPaths } from '../src';

test('object paths', () => {
  const data = {
    a: {
      b: 'foo',
      c: 'bar',
    },
  };
  expect(jsonPaths(data)).toEqual({
    'a.b': 1,
    'a.c': 1,
  });
  expect(jsonPaths(data, { '*': 'value' })).toEqual({
    'a.b': { foo: 1 },
    'a.c': { bar: 1 },
  });
});

test('array paths', () => {
  const data = {
    a: [1, 2, 3],
  };
  expect(jsonPaths(data)).toEqual({
    'a.#': 3,
  });
  expect(jsonPaths(data, { '*': 'value' })).toEqual({
    'a.#': {
      1: 1,
      2: 1,
      3: 1,
    },
  });
});

test('transform value', () => {
  const data = {
    a: [1, 2, 3, 'str', false, true, { foo: 'bar' }],
  };
  const shape = jsonPaths(data, { a: (v) => typeof v });
  expect(shape).toEqual({
    'a.#': {
      boolean: 2,
      number: 3,
      string: 1,
    },
    'a.#.foo': {
      string: 1,
    },
  });
});

test('dot in key', () => {
  const data = {
    a: {
      b: 'foo',
      '.b': 'bar',
    },
    'a.': {
      b: 'qux',
    },
    'a.b': 'bar',
    'a..b': 'baz',
  };
  expect(jsonPaths(data)).toEqual({
    'a.b': 1,
    'a.~b': 1,
    'a~.b': 1,
    'a~b': 1,
    'a~~b': 1,
  });
});
