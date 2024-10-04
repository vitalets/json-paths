import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.ts'],
  ignoreDependencies: ['lint-staged', 'np', 'publint'],
};

export default config;
