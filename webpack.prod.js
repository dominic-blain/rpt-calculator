const Merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = Merge(common, {
	plugins: [
		new UglifyJSPlugin({
			sourceMap: true
		})
	]
});