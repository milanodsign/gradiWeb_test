module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
