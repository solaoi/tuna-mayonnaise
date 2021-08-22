module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  ignorePatterns: ["config-overrides.js"],
  rules: {
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "react/react-in-jsx-scope": "off",
    "no-param-reassign": "off",
    "react/prop-types": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
    "no-return-assign": "off",
    "class-methods-use-this": ["error", { exceptMethods: ["worker"] }],
  },
};
