// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import muiPathImports from 'eslint-plugin-mui-path-imports';

export default [
  {
    ignores: [
      ".next/",
      "build/",
      "node_modules/",
      "dist/",
      "**/*.min.js"
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'mui-path-imports': muiPathImports,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'mui-path-imports/mui-path-imports': 'error',
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
