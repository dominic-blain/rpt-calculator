const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const Merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
	const dotenvPath = env.ENVIRONMENT === 'staging' ? '.env.development' : '.env';
	const dotenvParsed = dotenv.config({path: path.resolve(process.cwd(), dotenvPath)}).parsed;
	const envKeys = Object.keys(dotenvParsed).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(dotenvParsed[next]);
		return prev;
	}, {});

	return Merge(common, {
		plugins: [
			new UglifyJSPlugin({
				sourceMap: true
			}),
			new webpack.DefinePlugin(envKeys)
		]
	});
}