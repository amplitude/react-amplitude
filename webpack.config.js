'use strict';

const path = require('path');
const webpack = require('webpack');

var env = process.env.NODE_ENV;

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

module.exports = {
  mode: 'production',
  externals: {
    'react': reactExternal,
  },
  entry: {
    'react-amplitude': './src/index.js'
  },
  output: {
    path: path.resolve('dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactAmplitude',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
    ]
  }
};
