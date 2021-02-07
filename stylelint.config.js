module.exports = {
	extends: [
		'stylelint-config-standard'
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
		'selector-list-comma-newline-after': 'always-multi-line'
	}
};
