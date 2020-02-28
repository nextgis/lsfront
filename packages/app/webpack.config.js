const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { packagesAliases } = require('../../build/aliases');

let alias = packagesAliases();
try {
  const { getAliases } = require('../../nextgisweb_frontend/build/aliases');
  alias = { ...alias, ...getAliases() };
} catch (er) {
  // ignore
}

const sassLoaderOptions = {
  implementation: require('sass')
};

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const ASSET_PATH = process.env.ASSET_PATH || (isProd ? '/' : '/');

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      enforce: 'pre',
      test: /\.(t|j)sx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '..', '..', 'packages'),
      options: {
        fix: true
      }
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.s(c|a)ss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: sassLoaderOptions
        }
      ]
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    }
  ];

  let plugins = [
    // new HardSourceWebpackPlugin(),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      'process.env.BASE_URL': JSON.stringify('./src')
    })
  ];

  if (isProd) {
    plugins = plugins.concat([
      // new BundleAnalyzerPlugin()
    ]);
  }

  const config = {
    mode: argv.mode || 'development',

    devtool: isProd ? '#source-map' : 'eval-source-map',

    entry: './src/index.ts',

    output: {
      filename: '[name]-[hash:7].js',
      publicPath: ASSET_PATH
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      modules: [path.resolve(__dirname, '..', '..', 'node_modules')],
      alias: {
        ...alias,
        ...{
          vue$: 'vue/dist/vue.esm.js'
        }
      }
    },
    module: {
      rules
    },
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      noInfo: true
    },
    plugins,
    performance: {
      hints: false
    },
    optimization: {
      usedExports: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000
      }
    }
  };
  return config;
};
