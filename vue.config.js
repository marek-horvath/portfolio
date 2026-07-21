const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/portfolio/",
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      const redirectToAdmin = (request, response) => {
        response.redirect(302, "/portfolio/?admin=1");
      };
      const redirectToBlog = (request, response) => {
        response.redirect(302, "/portfolio/?blog=1");
      };

      devServer.app.get("/admin", redirectToAdmin);
      devServer.app.get("/portfolio/admin", redirectToAdmin);
      devServer.app.get("/blog", redirectToBlog);
      devServer.app.get("/portfolio/blog", redirectToBlog);

      return middlewares;
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/blog\/?$/, to: "/portfolio/" },
        { from: /^\/portfolio\/admin\/?$/, to: "/portfolio/" },
        { from: /^\/portfolio\/blog\/?$/, to: "/portfolio/" },
        { from: /^\/portfolio\/.*$/, to: "/portfolio/" }
      ]
    }
  }
});
