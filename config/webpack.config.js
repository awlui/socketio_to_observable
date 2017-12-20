// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const developmentConfig = require('./dev.config');
const productionConfig = require('./prod.config');
const PATHS = {
  src: path.join(process.cwd(), 'src'),
  build: path.join(process.cwd(), 'build'),
};
const commonConfig = merge([
  {
    entry: {
      index: './index'
    },
    context: PATHS.src,
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          loader: 'tslint-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        }
      ]
    }
  }
  ]);

module.exports = (env) => {
  switch(env) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      break;
  }
};
