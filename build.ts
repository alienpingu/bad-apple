import { build, type BuildConfig } from 'bun';
import { $ } from 'bun';

const outdir = './dist';

const common: Partial<BuildConfig> = {
  entrypoints: ['./src/index.ts'],
  outdir,
  minify: true,
  target: 'browser',
  sourcemap: 'external',
};

console.log('Building ESM...');
await build({
  ...common,
  format: 'esm',
  naming: 'index.mjs',
} as BuildConfig);

console.log('Building CJS...');
await build({
  ...common,
  format: 'cjs',
  naming: 'index.cjs',
} as BuildConfig);

console.log('Building IIFE...');
await build({
  ...common,
  format: 'iife',
  naming: 'index.iife.js',
} as BuildConfig);

console.log('Building type declarations...');
await $`tsc -p tsconfig.types.json`;

console.log('Done! Artifacts in ./dist');
