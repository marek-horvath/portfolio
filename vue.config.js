const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/portfolio/",
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/portfolio\/admin\/?$/, to: "/portfolio/" },
        { from: /^\/portfolio\/.*$/, to: "/portfolio/" }
      ]
    }
  }
});
