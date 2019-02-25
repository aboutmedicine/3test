const path = require('path');
const webpack = require('webpack');

module.exports = {
	// outputDir: path.resolve(__dirname, '/dist'),
    productionSourceMap: false,
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:5000'
			}
		},
		disableHostCheck: true
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
		devtool: 'eval-source-map',
		resolve: {
			alias: {
				'@npm': path.join(__dirname, 'node_modules'),
				'@modules': path.resolve(__dirname, './src/modules'),
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
	},
}