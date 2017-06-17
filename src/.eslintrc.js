module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        'airbnb-base',
        'plugin:react/recommended',
    ],
    plugins: [
        'react'
    ],
    env: {
        browser: true,
    },
    globals: {
        test: true,
        expect: true,
        it: true,
        describe: true,
    },
    rules: {
        'linebreak-style': 0,
        'class-methods-use-this': ['error', {
            exceptMethods: [
                'render',
                'getInitialState',
                'getDefaultProps',
                'getChildContext',
            ],
        }]
    }
};