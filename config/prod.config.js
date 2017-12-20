const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
module.exports = merge([
{
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: process.cwd()
    }),
    new UglifyJSPlugin()
  ],
  devtool: 'none',
  externals: {
    'rxjs/Rx': 'rxjs/Rx',
    'socket.io-client': 'socket.io-client'
  }
}

]);
