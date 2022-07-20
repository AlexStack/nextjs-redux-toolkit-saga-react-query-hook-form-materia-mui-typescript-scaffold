module.exports = {
  env: {
    browser: true,
    es2021 : true,
  },
  extends: [
    'plugin:react/recommended',
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
  ],
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    ecmaVersion: 'latest',
    sourceType : 'module',
    project: ['./tsconfig.json'],
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'align-assignments',
  ],
  rules: {
    'react/jsx-filename-extension'       : [1, { extensions: ['.tsx', '.jsx'] }],
    'react/function-component-definition': [1, {
      namedComponents  : 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'max-lines': [
      'warn',
      { max: 300, skipBlankLines: true, skipComments: true },
    ],
    indent                               : ['error', 2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
    'no-multi-spaces'                    : ['error', { exceptions: { VariableDeclarator: true, Property: true } }],
    'align-assignments/align-assignments': [2, { requiresOnly: false }],
    'key-spacing'                        : ['error', { align: 'colon' }],
    'no-param-reassign': ["error", { "props": false }],
    "react/prop-types": "off" ,
    "react/require-default-props": "off",
  },
};
