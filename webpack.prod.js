const webpack = require('webpack');
const Merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = dotenv.config({path: path.resolve(process.cwd(), '.env.development')}).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = Merge(common, {
	plugins: [
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new webpack.DefinePlugin(envKeys)
	]
});