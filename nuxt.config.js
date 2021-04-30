// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
	ssr: false,

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: 'GTHub',
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
		{ src: 'primevue/resources/primevue.min.css' },
		{ src: 'primeicons/primeicons.css' },
		{ src: 'primeflex/primeflex.css' },
		// main SCSS file in the project
		'@/assets/scss/main.scss'
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
		'@nuxtjs/stylelint-module',
		'@nuxtjs/tailwindcss'
	],

	tailwindcss: {
		// jit: true
	},

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'primevue/nuxt',
		'@nuxtjs/dayjs'
	],

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {
	},

	// Primevue config
	primevue: {
		theme: 'mdc-dark-indigo',
		ripple: true,
		components: [
			'AutoComplete',
			'Button',
			'Card',
			'Chip',
			'DataView',
			'Dropdown',
			'InputText',
			'MultiSelect',
			'OverlayPanel',
			'TabPanel',
			'TabView'
		],
		directives: ['Tooltip']
	},

	dayjs: {
		locales: ['en'],
		defaultLocale: 'en',
		defaultTimeZone: 'Europe/Stockholm',
		plugins: [
			'utc', // import 'dayjs/plugin/utc'
			'timezone', // import 'dayjs/plugin/timezone'
			'advancedFormat'
		]
	},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {
		babel: {
			plugins: [
				['@babel/plugin-proposal-private-methods', { loose: true }]
			]
		}
	},

	// Server Middleware
	serverMiddleware: {
		'/api': '~/api'
	},

	// Disable telemetry
	telemetry: false
};
