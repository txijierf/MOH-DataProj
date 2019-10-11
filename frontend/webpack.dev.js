const common = require("./webpack.common");
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
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
});
