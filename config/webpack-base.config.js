const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: `img/[name].[ext]`
          }
        }

      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: `font/[name].[ext]`
          }
        }
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules', './node_modules'],
    extensions: ['.jsx', '.js', '.json', '.png'],
    alias: {
      '@': path.resolve(__dirname, '../src/')
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `css/[name].css`,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}
