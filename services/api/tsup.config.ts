import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  /**
   * The common package is using the internal packages approach, so it needs to
   * be transpiled / bundled together with the deployed code.
   */
  noExternal: [
    '@calmpulse-app/ai',
    '@calmpulse-app/config',
    '@calmpulse-app/db',
    '@calmpulse-app/shared',
    '@calmpulse-app/ts-rest',
    '@calmpulse-app/types',
    '@calmpulse-app/utils',
  ],
  /**
   * Configure esbuild to handle automatic extensions and path mapping
   */
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.js', '.json'];
    options.mainFields = ['module', 'main'];
    // Configure path mapping for @/ alias
    options.alias = {
      '@': './src',
    };
  },
  /**
   * Do not use tsup for generating d.ts files because it can not generate type
   * the definition maps required for go-to-definition to work in our IDE. We
   * use tsc for that.
   */
});
