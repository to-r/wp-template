const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",
  stats: {
    colors: true,
    preset: "minimal",
    children: true,
  },
  performance: { hints: isDev ? false : "warning" },
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "theme/build"),
    publicPath: "build/",
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new CleanWebpackPlugin(),
  ].concat(
    isDev
      ? [
          new BrowserSyncPlugin({
            host: "localhost",
            port: 3000,
            proxy: "http://localhost:8888",
            files: [`theme/**/*`],
          }),
        ]
      : []
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")({ grid: true })],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
};
