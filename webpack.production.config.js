const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  mode: "production",
  entry: [
    './src/utils/polyfills.js',
    './src/index.jsx',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'deploy'), // hasil build ke folder deploy
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|ico|svg|ttf|eot|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
    },
  },
  plugins: [
    new Dotenv({
      systemvars: true,
      safe: false,
      silent: true,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/favicon.ico', to: 'favicon.ico' },
        { from: 'src/assets/apple-touch-icon.png', to: 'apple-touch-icon.png' },
        { from: 'src/assets/regular-icon.png', to: 'regular-icon.png' },
        { from: 'src/assets/coindrop-img.png', to: 'coindrop-img.png' },
        { from: 'public/_redirects', to: './' },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'css/main.css',
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  target: "web",
  stats: "minimal",
};
