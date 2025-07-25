const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
  mode: 'development',
  stats: 'none',
  devtool: 'eval',
  devServer: {
    static: path.join(__dirname, 'build'),
    port: 3000,
    https: false,
    historyApiFallback: true,
  },
  output: {
    assetModuleFilename: 'assets/[name][ext][query]',
  },
});
