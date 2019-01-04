const path = require('path');

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
		        // data: `
		        //   @import "@/scss/_variables.scss";
		        //   @import "@/scss/_mixins.scss";
		        // `
			},
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@npm': path.join(__dirname, 'node_modules'),
				'@libs': path.resolve(__dirname, './src/libs'),
				'@components': path.resolve(__dirname, './src/components'),
				'@assets': path.resolve(__dirname, 'assets')
			}
		}
	}
}