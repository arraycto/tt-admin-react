const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack-base.config')
const merge = require('webpack-merge')
const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    publicPath: '/'
  },
  devServer: {
    port: 8080,
    contentBase: './dist',
    proxy: {
      '/': 'http://localhost:9090'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    })]
}
module.exports = merge(baseConfig, dev)
