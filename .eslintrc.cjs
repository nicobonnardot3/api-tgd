module.exports = {
	extends: [
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:prettier/recommended",
		"prettier/react"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	root: true
	// rules: {
	// 	"arrow-spacing": ["warn", { "before": true, "after": true }],
	// 	"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
	// 	"semi": "never",
	// 	"comma-dangle": ["error", "always-multiline"],
	// 	"comma-spacing": "error",
	// 	"comma-style": "error",
	// 	"curly": ["error", "multi-line", "consistent"],
	// 	"dot-location": ["error", "property"],
	// 	"handle-callback-err": "off",
	// 	"keyword-spacing": "error",
	// 	"max-nested-callbacks": ["error", { "max": 4 }],
	// 	"max-statements-per-line": ["error", { "max": 2 }],
	// 	"no-console": "off",
	// 	"no-empty-function": "error",
	// 	"no-floating-decimal": "error",
	// 	"no-inline-comments": "error",
	// 	"no-lonely-if": "error",
	// 	"no-multi-spaces": "error",
	// 	"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
	// 	"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
	// 	"no-trailing-spaces": ["error"],
	// 	"no-var": "error",
	// 	"object-curly-spacing": ["error", "always"],
	// 	"prefer-const": "error",
	// 	"semi": ["error", "always"],
	// 	"space-before-blocks": "error",
	// 	"space-before-function-paren": ["error", {
	// 		"anonymous": "never",
	// 		"named": "never",
	// 		"asyncArrow": "always"
	// 	}],
	// 	"space-in-parens": "error",
	// 	"space-infix-ops": "error",
	// 	"space-unary-ops": "error",
	// 	"spaced-comment": "error",
	// 	"yoda": "error",
	// 	"no-useless-escape": "off",
	// 	"@typescript-eslint/no-explicit-any": "off",
	// 	"@typescript-eslint/no-unused-vars": "off",
	// 	"@typescript-eslint/no-var-requires": "off",
	// }
}
