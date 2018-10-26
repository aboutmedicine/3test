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
				},
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
		],
	},
	resolve: {
		alias: {
			'@libs': path.resolve(__dirname, 'libs'),
			'@components': path.resolve(__dirname, './src/components'),
			'@assets': path.resolve(__dirname, 'assets')
		}
	}
}