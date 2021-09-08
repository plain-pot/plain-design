const JSXModel = require('plain-design-composition/plugins/babel-plugin-react-model')

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3,
            },
        ],
        "@babel/preset-react",
    ],
    "plugins": [
        JSXModel,
    ]
}
