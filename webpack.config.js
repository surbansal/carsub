const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const RobotstxtPlugin = require("robotstxt-webpack-plugin").default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const robotOptions = {
  policy: [
    {
      userAgent: "Googlebot",
      disallow: "",
      crawlDelay: 2
    },
    {
      userAgent: "*",
      disallow: "/",
      crawlDelay: 10,
    }
  ]
};

const properties = {
  apiBackend: 'http://localhost:8080/api',
  dmaBackend: 'http://localhost:8082/api',
  enablePWA: 'true',
  segmentIntegrationEnabled: 'true',
  gaTrackingId: 'UA-120231128-5'
};

const stringReplacementLoader = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: /\#{(.*)}/g,
      replacement: function (match, propertyName) {
        return properties[propertyName];
      }
    }
  ]
});

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'babel-polyfill',
      'whatwg-fetch',
      'url-search-params-polyfill',
      'react-hot-loader/patch',
      'react',
      'react-dom',
      './main.js',
      './assets/scss/main.scss',
    ],
    admin: [
      'webpack/hot/only-dev-server',
      './admin.js',
      './assets/scss/main.scss',
    ],
    devServerClient: 'webpack-dev-server/client?http://localhost:9000/',
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  context: resolve(__dirname, 'app'),

  devServer: {
    hot: true,
    port: 9000,
    contentBase: resolve(__dirname, 'build'),
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/admin/, to: '/admin/index.html' },
        { from: /./, to: '/index.html' }
      ]
    },
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['eslint-loader', stringReplacementLoader]
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
        test: /\.jsx?$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false,
              },
            },
          ],
          publicPath: '../'
        })),
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
              limit: 8192,
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
              limit: 8192,
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
              limit: 8192,
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

  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.jsx?$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
        }
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:9000' }),
    new webpack.HotModuleReplacementPlugin(),
    new StringReplacePlugin(),
    new RobotstxtPlugin(robotOptions),
    new ExtractTextPlugin({ filename: './styles/[name].css', disable: false}),
    new BundleAnalyzerPlugin()
  ],
};

module.exports = config;
