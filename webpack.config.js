/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const plugins = [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ];

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[id].[contenthash].js',
      pathinfo: true,
    },
    plugins,
    stats: 'minimal',
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxInitialRequests: Infinity,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // Return the package name
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(bower_components)/,
          use: {
            loader: 'swc-loader',
            options: {
              // Set the SWC options as needed
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
              cacheDirectory: true, // Add cache options to speed up build time
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            // any other loaders for postcss, sass, etc.
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        react: path.resolve('./node_modules/react'),
      },
    },
  };
};
