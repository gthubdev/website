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
		// 'linebreak-style': [
		// 	'error',
		// 	'unix'
		// ],
		'linebreak-style': 'off',
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'vue/html-indent': ['error', 'tab', {
			'attribute': 1,
			'baseIndent': 0,
			'closeBracket': 0,
			'alignAttributesVertically': true,
			'ignores': []
		}],
		'no-console': 'off',
		'no-undef': 'warn',
		'vue/html-self-closing': ['error', {
			'html': {
				'void': 'always',
				'normal': 'always',
				'component': 'always'
			},
			'svg': 'always',
			'math': 'always'
		}],
		'vue/max-attributes-per-line': 'off',
		'no-useless-escape': 'off'
	}
};
