const JsxModel = require('plain-design-composition/plugins/babel-plugin-react-model')

module.exports = {
    presets: ["@babel/preset-react", "@babel/preset-env", "@babel/preset-typescript"],
    "plugins": [
        // "@babel/plugin-transform-react-jsx",
        JsxModel,
    ]
}