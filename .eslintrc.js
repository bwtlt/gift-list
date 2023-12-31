module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    eqeqeq: 1,
    'react/no-unknown-property': [
      2,
      {
        ignore: [
          'jsx', 'global'
        ]
      }
    ]
  }
}
