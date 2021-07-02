/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';
const path = require('path');
//const sass = require('node-sass');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
//    page2: './src/page2.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    library: ['AppLib', '[name]'], 
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
       chunks: 'all',
    },
  },
  module: {  // todo add file and url loader (webpack 4)
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // `autoprefixer` is a requirement for Carbon core Sass code
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                includePaths: ['node_modules'],
                // `enable-css-custom-properties` and `grid-columns-16` feature flags
                // are requirements for Carbon for IBM.com styles
                data: `
                  $feature-flags: (
                    enable-css-custom-properties: true,
                    grid-columns-16: true,
                  );
                `,
              },
            },
          },
        ],
      },
      { test: /\.handlebars$/,
        loader: "handlebars-loader",
      }
    ],
  },
  plugins: [
    // generate html files according to template and chunks
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.html',
      chunks: ['index'],
    }),
//    new HtmlWebpackPlugin({
//      filename: 'page2.html',
//      template: './src/templates/page2.html',
//      chunks: ['page2'],
//    }),
  ],
  devtool: 'inline-source-map',
};