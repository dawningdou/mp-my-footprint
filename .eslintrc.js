// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    // parser: 'babel-eslint',
    // parserOptions: {
    //   sourceType: 'module'
    // },
    parserOptions: {
      "parser": "babel-eslint",
      "ecmaVersion": 2017,
      "sourceType": "module"
    },
    env: {
      browser: false,
      node: true,
      es6: true
    },
    "extends": ["plugin:vue/base", "standard" ],
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // extends: 'standard',
    // required to lint *.vue files
    plugins: [
      'vue'
    ],
    // add your custom rules here
    'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    globals: {
      App: true,
      Page: true,
      wx: true,
      swan: true,
      tt: true,
      my: true,
      getApp: true,
      getPage: true,
      getCurrentPages: true,
      requirePlugin: true,
      uni: true,
      mpvue: true
    }
  }
  