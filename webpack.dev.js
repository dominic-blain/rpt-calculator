const webpack = require('webpack');
const Merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv');
var path = require('path');
var buildPath = path.resolve(__dirname, 'dist');


const env = dotenv.config({path: path.resolve(process.cwd(), '.env.development')}).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = Merge(common, {
	devtool: 'eval',
	plugins: [
    	new webpack.DefinePlugin(envKeys)
	]
});