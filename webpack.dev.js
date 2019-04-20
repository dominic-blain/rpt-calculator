const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const Merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = () => {
	const dotenvParsed = dotenv.config({path: path.resolve(process.cwd(), '.env.development')}).parsed;
	const envKeys = Object.keys(dotenvParsed).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(dotenvParsed[next]);
		return prev;
	}, {});

	return Merge(common, {
		devtool: 'eval',
		plugins: [
			new webpack.DefinePlugin(envKeys)
		]
	});
};