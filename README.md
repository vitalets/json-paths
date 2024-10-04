# json-paths

[![lint](https://github.com/vitalets/json-paths/actions/workflows/lint.yaml/badge.svg)](https://github.com/vitalets/json-paths/actions/workflows/lint.yaml)
[![test](https://github.com/vitalets/json-paths/actions/workflows/test.yaml/badge.svg)](https://github.com/vitalets/json-paths/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/json-paths)](https://www.npmjs.com/package/json-paths)
[![license](https://img.shields.io/npm/l/json-paths)](https://github.com/vitalets/json-paths/blob/main/LICENSE)

Collect different paths of JSON data. Allows to compare complex JSON structures by it's shape.

## Installation
Install from npm:
```
npm install json-paths
```

## Usage

Import `jsonPaths` and call it on some JSON data:
```ts
import { jsonPaths } from 'json-paths';

// given some data
const data = {
  foo: {
    bar: 'aaa',
    baz: 'bbb',
  }
};

// calculate json paths
const shape = jsonPaths(data);
/*
  { 
   'foo.bar': 1, 
   'foo.baz': 1 
  }
*/
```

For arrays all elements are counted as the same path with `#` as index:
```ts
const data = {
  foo: {
    bar: ['a', 'b', 'c']
  }
};

const shape = jsonPaths(data);
/*
  { 
    'foo.bar.#': 3
  }
*/
```

You can count each value inside a path:
```ts
const data = {
  foo: {
    bar: ['a', 'a', 'a', 'b', 'c']
  }
};

const shape = jsonPaths(data, { '*': 'value' });
/*
  { 
    'foo.bar.#': { 
      a: 3,
      b: 1,
      c: 1,
    }
  }
*/
```

Ignoring path:
```ts
const data = {
  foo: {
    bar: 'aaa',
    baz: 'bbb',
  }
};

const shape = jsonPaths(data, { 'foo.bar': false });
/*
  { 
   'foo.baz': 1, 
  }
*/
```

## API

#### `jsonPaths(obj, rules?, options?)`

**Params**
  * `obj` *object | array* - JSON data to calculate paths

  * `rules` *object* - rules for calculating different paths. Each key in that object serves as a path prefix (`*` matches any path). Each value is one of the following:
    - *any falsy value* - path is ignored
    - `"value"` - calculates count for each value in that path
    - *function* - the same as `"value"`, but value is transformed by the function
    - *any other value* - calculates count of that path (default)

  * `options` *object* - additional options
    - `sep` *string* - path separator (default `.`)
    - `sepReplacement` *string* - replacement if `sep` is found in original object key (default `~`)
    - `indexReplacement` *string* - replacement for array indexes (default `#`)

**Returns**: *object* - object with json paths

## License
[MIT](https://github.com/vitalets/json-paths/blob/main/LICENSE)