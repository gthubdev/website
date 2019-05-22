module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true,
		'node': true,
		'mocha': true
	},
	'plugins': ['vue'],
	'extends': [
		'eslint:recommended',
		'plugin:vue/recommended'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'parser': 'babel-eslint',
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'rules': {
		'indent': 'off',
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'vue/html-indent': ["error", 'tab', {
			"attribute": 1,
			"baseIndent": 0,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": []
		}],
		'no-console': 'off',
		'no-undef': 'warn'
	}
};
