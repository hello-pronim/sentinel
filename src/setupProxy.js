const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://2d4hj0r9gf.execute-api.us-east-1.amazonaws.com/dev/",
      changeOrigin: true,
      pathRewrite: {
        "^/api/dev": "",
      },
    })
  );
};
