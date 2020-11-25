module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  env: { node: true, mocha: true },
  rules: {
    'prettier/prettier': 'error',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
}
