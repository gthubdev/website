// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: 'gthubweb',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [
	],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [
	],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://go.nuxtjs.dev/stylelint
		'@nuxtjs/stylelint-module'
	],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios'
	],

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {
	},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {
	},

	//  Server Middleware
	serverMiddleware: {
		'/api': '~/api'
	}
};
