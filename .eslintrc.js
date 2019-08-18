
module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': 'google',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'comma-dangle': 0,
    'max-len': 1,
    'semi': 1,
    'no-unused-vars': 1
  },
};
