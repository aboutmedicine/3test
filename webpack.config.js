const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		],
	},
	resolve: {
		alias: {
			'@libs': path.resolve(__dirname, './src/libs'),
			'@components': path.resolve(__dirname, './src/components'),
		}
	}
}