const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, "/src/index.js"),
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "webpack.bundle.js",
    publicPath: "/"
  },
  resolve: {
    // alias: {
    //   constants: path.join(__dirname, "/src/constants"),
    //   images: path.join(__dirname, "/src/images"),
    //   tools: path.join(__dirname, "/src/tools"),
    //   store: path.join(__dirname, "/src/store"),
    //   actions: path.join(__dirname, "/src/store/actions"),
    //   actionCreators: path.join(__dirname, "/src/store/actions/actionCreators"),
    //   styles: path.join(__dirname, "/src/styles")
    // },
    extensions: ["*", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              disable: true,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/src/index.html"),
      filename: "index.html",
      inject: true,
      hash: true
    })
  ]
};
