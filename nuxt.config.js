const pkg = require('./package');

module.exports = {
	mode: 'universal',

	/*
	 ** Headers of the page
	 */
	head: {
		title: 'GTHub',
		meta: [{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: pkg.description
			}
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}],
		link: [{
			rel: 'stylesheet',
			href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
		}]
	},

	/*
	 ** Customize the progress-bar color
	 */
	loading: {
		color: '#fff'
	},

	/*
	 ** Global CSS
	 */
	css: [
		'@/assets/scss/main.scss'
	],

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [],

	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'nuxt-vue-material'
	],
	/*
	 ** Vue Material config
	*/
	vueMaterial: {
		theme: 'default-dark'
	}, 
	/*
	 ** Axios module configuration
	 */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},

	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			// Run ESLint on save
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				});
			}
		}
	},
	serverMiddleware: [
		// API middleware
		'~/api/index.js'
	]
};
