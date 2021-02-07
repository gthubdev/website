module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		commonjs: true,
		mocha: true,
		es6: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended',
		'plugin:vue/recommended'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		indent: [2, 'tab'],
		'no-tabs': 0,
		semi: ['error', 'always'],
		quotes: ['error', 'single'],
		curly: ['error', 'multi', 'consistent'],
		'arrow-parens': ['error', 'as-needed'],
		'no-console': 'off',
		camelcase: 'off',
		'object-shorthand': 'off',
		'space-before-function-paren': ['error', {
			anonymous: 'always',
			named: 'never',
			asyncArrow: 'always'
		}],
		'vue/html-indent': ['error', 'tab', {
			baseIndent: 0
		}]
	}
};
