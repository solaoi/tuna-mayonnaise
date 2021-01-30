const { override } = require("customize-cra");
const webpack = require("webpack");

module.exports = override((config) => {
  config.plugins.push(
    new webpack.ContextReplacementPlugin(/\/pug\-filters\//, (data) => {
      delete data.dependencies[0].critical;
      return data;
    })
  );
  return config;
});
