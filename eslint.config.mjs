import { fileURLToPath } from 'url';
import createJiti from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-object-type': 'off'
  }
};

export default config;
