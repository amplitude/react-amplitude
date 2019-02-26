const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

module.exports = {
  externals: {
    react: reactExternal,
  },
  entry: {
    'react-amplitude': './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactAmplitude',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.join(__dirname, 'src'),
      },
    ],
  },
};
