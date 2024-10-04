/**
 * Returns all possible paths in object.
 * See: https://stackoverflow.com/questions/37759768/get-all-paths-in-json-object
 */

/* eslint-disable visual/complexity, max-depth */

export function getAllPaths(o: unknown) {
  if (!o || typeof o !== 'object') return [];

  const paths: { path: string[]; value: unknown }[] = [];
  const stack: { path: string[]; obj: unknown }[] = [{ obj: o, path: [] }];

  while (stack.length > 0) {
    const { obj, path } = stack.shift()!;

    if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj) as (keyof typeof obj)[];
      for (const key of keys) {
        stack.push({ obj: obj[key], path: [...path, key] });
      }
    } else {
      paths.push({ path, value: obj });
    }
  }

  return paths;
}
