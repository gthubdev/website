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
		link: [
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: '/favicon.ico'
			},
			{
				rel: 'stylesheet',
				href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
			}
		]
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
		{ src: 'primevue/resources/primevue.min.css' },
		{ src: 'primevue/resources/themes/nova-light/theme.css' },
		{ src: 'primeicons/primeicons.css' },
		'@/assets/scss/main.scss'
	],

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		// initialize external libraries here
		{ src: '~/plugins/init', mode: 'client' },
		// define all used PrimeVUE components here
		{ src: '~/plugins/primevue.js', mode: 'client' }
	],

	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/auth',
		'nuxt-vue-material'
	],
	/*
	** Axios module configuration
	*/
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
		credentials: true
	},
	/*
	** Auth module configuration
	*/
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {
						url: '/api/auth/login',
						method: 'post',
						propertyName: 'token'
					},
					logout: {
						url: '/api/auth/logout',
						method: 'post'
					},
					user: {
						url: '/api/auth/me',
						method: 'get',
						propertyName: false
					}
				},
				tokenRequired: true,
				tokenType: 'Bearer'
			}
		},
		redirect: {
			login: '/',
			logout: '/',
			home: '/',
			callback: '/'
		}
	},
	/*
	 ** Vue Material config
	*/
	vueMaterial: {
		theme: 'default-dark'
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
