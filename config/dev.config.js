const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge([
{
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    contentBase: 'build',
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  devtool: 'inline-source-map',
  plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
  ]
}

]);
