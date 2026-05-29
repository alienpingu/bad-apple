import { build, type BuildConfig } from 'bun';
import { $ } from 'bun';

const outdir = './dist';

const common: Partial<BuildConfig> = {
  entrypoints: ['./src/index.ts'],
  outdir,
  minify: true,
  target: 'browser',
};

console.log('Building ESM...');
await build({
  ...common,
  format: 'esm',
  naming: 'index.mjs',
} as BuildConfig);

console.log('Building IIFE (demo)...');
await build({
  ...common,
  format: 'iife',
  naming: 'index.iife.js',
} as BuildConfig);

console.log('Building type declarations...');
await $`tsc -p tsconfig.types.json`;

console.log('Done! Artifacts in ./dist');
