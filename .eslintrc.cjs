module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // allows parsing without a Babel config
    ecmaVersion: 2023, // latest ECMAScript features
    sourceType: 'module', // for import/export
  },
  extends: ['airbnb-base'],
  env: {
    browser: true,
    node: true,
    es2023: true,
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always', // allow .js extension for local JS files
      },
    ],
  },
};
