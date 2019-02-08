/*
 *  Copyright © 2016-2017, RWTH Aachen University
 *  Authors: Richard Marston
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  A copy of the GNU General Public License is in the LICENSE file
 *  in the top level directory of this source tree.
 */

const webpack = require('webpack');
const path = require('path');
const libraryName = "libcimmenu";
let _devtool = process.env.npm_config_mode == "debug" ? "inline-sourcemap" : false;
let _minimize = process.env.npm_config_mode == "debug" ? false : true;
let _mode = process.env.npm_config_mode == "debug" ? "development" : "production";

module.exports = {
  context: __dirname,
  devtool: _devtool,
  entry: "./src/cimmenu.js",
  optimization: { "minimize": _minimize },
  mode: _mode,
  output: {
    path: __dirname + "/lib",
    library: libraryName,
    filename: libraryName + ".js",
    libraryTarget: "umd",
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(_mode)
      }
    })
  ],
  module: {
    rules: [{
      test: /\.(png|jp(e*)g|svg)$/,
      use: [{
        loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          }
      }]
    },
    {
      test: /\.handlebars$/, loader: "handlebars-loader",
      options: {
        helperDirs: [ path.join(__dirname, "templates/handlebars/helpers/") ],
      }
    },
    {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }]
    }]
  },
};

