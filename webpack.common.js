const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const inputPath = path.resolve(__dirname, 'src', 'index.js');
const outputPath = path.resolve(__dirname, 'public');
const templatePath = path.resolve(__dirname, 'src', 'index.html');

const common = {
  entry: {
    main: inputPath
  },
  output: {
    filename: '[name].bundle.[hash].js',
    path: outputPath
  },
  module: {
    rules: [
      // Javascript
      {
        test: /\.js$/,
        exclude: [nodeModulesPath],
        use: 'babel-loader'
      },
      // HTML
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // CSS
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      // Less
			{
				test: /\.less$/,
				use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'less-loader'
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(__dirname, 'src/styles/theme/*.less')
            }
          }
				]
      }
    ]
  },
  plugins: [
    // Clears the build folder before each build
    new CleanWebpackPlugin([outputPath]),
    // Generates new indexl.html file with correct filename
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: 'index.html'
    })
  ]
};

module.exports = common;