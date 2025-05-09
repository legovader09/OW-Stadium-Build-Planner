const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
  mode: 'production',
  stats: 'verbose',
  output: {
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
});
