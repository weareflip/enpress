const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsManager = require('assets-webpack-plugin');
const chokidar = require('chokidar');
const env = process.env.NODE_ENV || 'development';

// Load .env file
require('dotenv').config({path: __dirname + '/.env'});

const config = {
  entry: {
    polyfill: '@babel/polyfill',
    'app': path.resolve(__dirname, 'resources', 'assets', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    publicPath: '/dist/',
    filename: (env === 'development') ? '[name].[hash].js' : '[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        shared: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          enforce: true,
          chunks: 'all'
        }
      }
    },
    minimizer: (env === 'development') ? [
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin()
    ] : undefined,
  },
  mode: env,
  devtool: (env === 'development') ? 'cheap-module-eval-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: []
      },
      {
        test: /icons\.js$/,
        use: [
          // For hot reload in dev https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
          (env === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'webfonts-loader',
            options: {
              fileName: '../fonts/[fontname].[hash].[ext]',
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          // For hot reload in dev https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
          (env === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            context: 'resources/assets'
          }
        }]
      },

    ],
  },
  plugins: [
    new CleanWebpackPlugin('./public/dist', {}),
    new MiniCssExtractPlugin({
      filename: (env === 'development') ? '[name].css' : '[name].[hash].css',
      chunkFilename: (env === 'development') ? '[id].css' : '[id].[hash].css',
    }),
    new AssetsManager({
      filename: 'manifest.json',
      path: path.resolve('public', 'dist')
    })
  ],
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'resources', 'assets')
    }
  },

  devServer: {
    hot: true,
    overlay: true,
    clientLogLevel: 'none',
    historyApiFallback: true,
    before(app, server) {
      const files = [
        path.resolve(__dirname, 'resources/views/*.php'),
        path.resolve(__dirname, 'resources/views/**/*.php')
      ];

      chokidar.watch(files, {
        alwaysStat: true,
        atomic: false,
        followSymlinks: false,
        ignoreInitial: true,
        ignorePermissionErrors: true,
        persistent: true,
        usePolling: true
      })
        .on('all', () => {
          server.sockWrite(server.sockets, "content-changed");
        });
    },
    proxy: [
      {
        path: ['**'],
        target: process.env.APP_URL,
        secure: false,
        changeOrigin: true
      }
    ]
  },
};

module.exports = config;
