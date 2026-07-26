const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // relaxed for a learning team, downgrade errors to warnings
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
);