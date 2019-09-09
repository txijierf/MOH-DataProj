const common = require("./webpack.common");
const path = require("path");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: ".",
    hot: true,
    port: 3003,
    // open: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // include: path.join(__dirname, "/node_modules"),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        // include: path.join(__dirname, "/node_modules"),
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
});
