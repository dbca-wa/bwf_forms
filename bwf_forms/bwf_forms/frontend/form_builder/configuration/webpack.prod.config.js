/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const environment = require('./environment');

const webpackConfiguration = require('../webpack.config');

console.log(`Running in production mode`);

environment.paths.output = path.resolve(__dirname, '../../../../static/form_builder/');
environment.entry.app = path.resolve(environment.paths.source, 'js', 'fb.js');

module.exports = merge(webpackConfiguration, {
  mode: 'production',

  output: {
    filename: 'js/form-builder.js',
    path: environment.paths.output,
    clean: true,
  },

  externals: {
    jquery: 'jQuery',
    bootstrap: 'bootstrap',
    '@popperjs/core': 'Popper.js',
  },


  /* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
  devtool: false,

  /* Optimization configuration */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },

  /* Performance treshold configuration values */
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  /* Additional plugins configuration */
  plugins: [],
});
