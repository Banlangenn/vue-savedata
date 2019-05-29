module.exports = {
    // extends: 'react-app',
    extends: 'eslint:recommended', // eslint  自带
    env: {
        node: true,
        es6: true,
        commonjs: true,
    },
    parserOptions: {
        "ecmaVersion": 2018
    },
    rules: {
       "no-console": 0,
       "indent": ['error', 4], //缩进风格
    }
  }