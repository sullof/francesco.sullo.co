var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'production',
  // devtool: 'cheap-module-eval-source-map',
  entry: './client/js/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test:'/\.css$/',
        loader:'style!css!'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'js/bundle.min.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]

}
