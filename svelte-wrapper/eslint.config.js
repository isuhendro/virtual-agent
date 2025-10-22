import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['static/widget.js', 'node_modules'],
  },
  {
    rules: {
      // File size limits (300 lines per file, excluding blank lines and comments)
      'max-lines': [
        'error',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      // Function size limits (100 lines per function, excluding blank lines and comments)
      'max-lines-per-function': [
        'error',
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      // Cyclomatic complexity limit
      complexity: ['error', 10],
      // Max depth of nested callbacks
      'max-depth': ['error', 4],
      // Max number of parameters in function definitions
      'max-params': ['error', 5],
    },
  },
];
