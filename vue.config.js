const path = require('path');
const webpack = require('webpack');

module.exports = {
	// outputDir: path.resolve(__dirname, '/dist'),
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:5000'
			}
		}
	},
	css: {
		loaderOptions: {
			sass: {
				data: `
				  @import "@/styles/_variables.scss";
				`
			},
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@npm': path.join(__dirname, 'node_modules'),
				'@libs': path.resolve(__dirname, './src/libs'),
				'@components': path.resolve(__dirname, './src/components'),
				'@styles': path.resolve(__dirname, './src/styles'),
				'@assets': path.resolve(__dirname, 'assets')
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				THREE: 'three'
			})
		]
	}
}