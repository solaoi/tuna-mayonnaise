const { override } = require("customize-cra");
const eslintConfigOverrides = require("customize-cra-eslint");
const webpack = require("webpack");

module.exports = override(eslintConfigOverrides(), (config) => {
  config.plugins.push(
    new webpack.ContextReplacementPlugin(/\/pug-filters\//, (data) => {
      delete data.dependencies[0].critical;
      return data;
    })
  );
  return config;
});
