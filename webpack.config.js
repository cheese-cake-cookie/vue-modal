const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env) => {
  return {
    mode: env === 'production' ? 'production' : 'development',
    entry: {
      index: './src/index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              targets: {
                chrome: '58',
                ie: '11',
              },
            },
          },
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /(\.scss$|\.css$)/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [new VueLoaderPlugin()],
  };
};
