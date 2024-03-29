module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: ["airbnb", "airbnb/hooks", "prettier"],
  rules: {
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
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
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/no-array-index-key": "off",
  },
};
