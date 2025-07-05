import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import tsEslint from 'typescript-eslint';

export default defineConfig([
    js.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {
            js,
            prettier,
        },
        languageOptions: {
            parser: tsEslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
            globals: globals.node,
        },
        rules: {
            'no-unused-vars': 'off', // Handled by TypeScript ESLint
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^' },
            ],
            'consistent-return': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            camelcase: 'warn',
            'no-var': 'error',
            'prefer-const': 'warn',
            'prettier/prettier': 'error',
        },
    },
    {
        ignores: ['node_modules', 'dist'],
    },
]);
