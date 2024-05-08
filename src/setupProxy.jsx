const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api/v1/*",], // the base api route you can change it
    createProxyMiddleware({
      target: "http://localhost:3082", // the local server endpoint 
    })
  );
};