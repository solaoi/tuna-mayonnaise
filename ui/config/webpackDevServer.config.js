const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const paths = require("./paths");
const getHttpsConfig = require("./getHttpsConfig");

module.exports = (allowedHost) => ({
  allowedHosts:
    process.env.DANGEROUSLY_DISABLE_HOST_CHECK === "true" ? "all" : allowedHost,
  compress: true,
  static: {
    directory: paths.appPublic,
    staticOptions: {},
    publicPath: paths.publicUrlOrPath,
    watch: {
      ignored: ignoredFiles(paths.appSrc),
    },
  },
  hot: true,
  webSocketServer: "ws",
  client: false,
  devMiddleware: {
    publicPath: paths.publicUrlOrPath.slice(0, -1),
  },
  https: getHttpsConfig(),
  historyApiFallback: {
    disableDotRule: true,
    index: paths.publicUrlOrPath,
  },
  onBeforeSetupMiddleware(devServer) {
    devServer.app.use(evalSourceMapMiddleware(devServer));
    devServer.app.use(errorOverlayMiddleware());
  },
  onAfterSetupMiddleware(devServer) {
    devServer.app.use(redirectServedPath(paths.publicUrlOrPath));
    devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
  },
});
