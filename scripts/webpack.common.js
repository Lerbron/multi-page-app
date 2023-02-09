const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const os = require('os');
const threadPool = os.cpus().length - 1;

const {
  separator,
  isDev
} = require('./utils/constant')
const {
  getEntryTemplate
} = require('./utils/helper')
const {
  getCssLoaders
} = require("./utils/getCssLoaders");

// 将packages拆分成为数组 ['editor','home']
const packages = process.env.packages.split(separator)

// 调用getEntryTemplate 获得对应的entry和htmlPlugins
const {
  entry,
  htmlPlugins
} = getEntryTemplate(packages)

module.exports = {
  entry,
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: "/",
    // assetModuleFilename: 'assets/[name][ext]'
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@packages': path.resolve(__dirname, '../src/packages'),
      "@utils": path.resolve(__dirname, '../src/utils')
    },
    mainFiles: ['index', 'main'],
    extensions: ['.ts', '.tsx', '.scss', 'json', '.js'],
  },
  module: {
    rules: [{
        test: /\.(tsx?|jsx?)$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: threadPool
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            },
          }
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, './../assets/common.scss')
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset',
        generator: {
          filename: "assets/[name][ext]",
          // publicPath: "https://www.xxx.com/"
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, './../favicon.ico'),
        to: path.resolve(__dirname, './../dist/favicon.ico')
      }, ],
    }),
  ],
  stats: "errors-only",
};