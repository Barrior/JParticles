module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "rules": {
        "quotes": 0,
        "camelcase": 0,
        "dot-notation": 0,
        "quote-props": 0,
        "spaced-comment": 0,
        "semi": 0,
        "indent": [2, 4, {"SwitchCase": 1, "VariableDeclarator": 1}],
        "new-cap": 0,
        "comma-spacing": 0,
        "eol-last": 0,
        "object-curly-spacing": 0,
        "arrow-spacing": 0,
        "padded-blocks": 0,
        "max-len": 0,
        "react/sort-comp": 0,
        "radix": 0,
        "react/jsx-no-bind": 0,
        "react/jsx-indent-props": 0,
        "no-unused-expressions": 0,
        "no-param-reassign": 0,
        "react/jsx-closing-brachet-location": 0,
        "no-trailing-spaces": 0,
        "react/jsx-boolean-value": 0,
        "no-mixed-spaces-and-tabs": 0,
        "func-names": 0,
        "react/no-multi-comp": 0,
        "no-script-url": 0,
        "comma-dangle": 0,
        "react/prop-types": 0,
        "no-console": 0,
        "object-shorthand": [1, "always"],

        "linebreak-style": 0,
        "no-undef": 0,
        "no-unused-vars": 1,
        "arrow-body-style": 1,
        "arrow-parens": 1,
        "global-require": 1,
        "no-multi-assign": 1,
        "class-methods-use-this": 1,
        "no-use-before-define": 1,
        "eqeqeq": 1,
        "no-plusplus": 1,

        "import/no-extraneous-dependencies": 1,
        "import/extensions": 0,
        "import/no-unresolved": 1,

        "react/jsx-indent": ["error", 4],
        "react/jsx-filename-extension": ["error", {
            "extensions": [".jsx", ".js"]
        }],
        "react/jsx-wrap-multilines": ["error", {
            "declaration": true,
            "assignment": true,
            "return": false,
            "arrow": true,
        }],
        "react/jsx-first-prop-new-line": 1,
        "react/no-array-index-key": 1,
        "react/jsx-closing-bracket-location": 1,
        "react/self-closing-comp": 1,
        "react/no-string-refs": 1,

        "jsx-a11y/href-no-hash": 0,
        "jsx-a11y/no-static-element-interactions": 1,
        "jsx-a11y/no-noninteractive-element-interactions": 1,
    }
};