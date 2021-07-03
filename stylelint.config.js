module.exports = {
	extends: [
		'stylelint-config-recommended',
		'stylelint-config-concentric-order',
		'stylelint-config-sass-guidelines'
	],
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	ignoreFiles: [
		'public/css/main.css',
		'**/*.js',
		'**/*.vue'
	],
	rules: {
		indentation: 'tab',
		'selector-list-comma-newline-after': 'always-multi-line',
		'order/properties-alphabetical-order': null,
		'max-nesting-depth': null
	}
};
