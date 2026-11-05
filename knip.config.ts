import type { KnipConfig } from 'knip';

// ts/ is consumed by other repos through package.json exports, so its exports
// are public API rather than dead code.
const config: KnipConfig = {
  entry: ['ts/**/*.ts', 'tests/**/*.ts'],
  project: ['ts/**/*.ts', 'tests/**/*.ts'],
  include: ['files', 'dependencies', 'unlisted', 'unresolved', 'binaries'],
  ignoreBinaries: [
    'cz', // commitizen CLI
    'python3',
  ],
};

export default config;
