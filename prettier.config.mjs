// prettier.config.js
/** @type {import("prettier").Config} */
module.exports = {
	overrides: [
		{
			files: ["**/*.tsx", "**/*.jsx"],
			options: {
				printWidth: 160,
				useTabs: true,
				arrowParens: "always",
				tabWidth: 2,
				semi: true,
			},
		},
		{
			files: ["**/*.ts", "**/*.js"],
			options: {
				printWidth: 160,
				useTabs: true,
				arrowParens: "always",
				tabWidth: 2,
				semi: true,
			},
		},
		{
			files: ["**/*.json"],
			options: {
				printWidth: 160,
				useTabs: true,
				tabWidth: 2,
				trailingComma: "es5",
				semi: false,
				singleQuote: true,
			},
		},
	],
};
