const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin').default;

const robotOptions = {
  policy: [
    {
      userAgent: 'Googlebot',
      allow: '/',
      crawlDelay: 2
    },
    {
      userAgent: '*',
      disallow: '/',
      crawlDelay: 10,
    },
  ],
  sitemap: 'https://#{baseUrl}/sitemap.xml'
};

const config = {
  devtool: 'cheap-module-source-map',

  entry: {
    main: [
      'babel-polyfill',
      'whatwg-fetch',
      'url-search-params-polyfill',
      './main.js',
      './assets/scss/main.scss'
    ],
    admin: [
      './admin.js',
      './assets/scss/main.scss'
    ],
  },

  context: resolve(__dirname, 'app'),

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new ExtractTextPlugin({ filename: './styles/[name].css', disable: false}),
    new RobotstxtPlugin(robotOptions),
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, 'html'),
        to: resolve(__dirname, 'dist'),
      }
    ])
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'sass-loader', query: { sourceMap: false } },
          ],
          publicPath: '../'
        }),
      },
      {
        test: /manifest\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ],
      },
      {
        test: /backend-cache-worker\.js$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              mimetype: 'application/octet-stream',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              mimetype: 'image/svg+xml',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /favicon\.ico$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 0,
              name: '[name].[ext]',
            }
          }
        ],
      },
      {
        test: /sitemap\.xml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 0,
              name: '[name].[ext]',
            }
          }
        ],
      },
    ]
  },
};

module.exports = config;
