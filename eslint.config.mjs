import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            js,
            prettier,
        },
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'no-unused-vars': 'error',
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
