const path = require('path')
const resolve = filePath => path.resolve(__dirname, './', filePath)
const {DefinePlugin} = require('webpack')

const outputDir = 'docs'
const port = '3379'

const config = {
    title: 'PLAIN DESIGN',                                      // 单页面应用title
    APP_NAME: 'PLAIN_DESIGN_APPLICATION',                       // 每个应用的唯一标识，没有格式限制，只能用下划线命名，因为最后会输出为一个变量名
    publicPath: '/plain-design/',                               // 部署路径
}

module.exports = {
    publicPath: config.publicPath,
    outputDir: resolve(outputDir),
    devServer: {
        port,
        disableHostCheck: true,                         // 关闭主机检查，使微应用可以被 fetch
        headers: {"Access-Control-Allow-Origin": "*",}, // 因为应用之间需要互相加载，本地联调的时候需要配置跨域
    },
    configureWebpack: {
        resolve: {
            extensions: ['.ts', '.tsx', 'js', 'jsx', 'json'],
        },
        output: {
            library: `CustomApplication${config.APP_NAME}`,             // 微应用的包名，这里与主应用中注册的微应用名称一致
            libraryTarget: "umd",                                       // 将你的 library 暴露为所有的模块定义下都可运行的方式
            jsonpFunction: `webpackJsonp_${config.APP_NAME}_project`,   // 按需加载相关，设置为 webpackJsonp_#{APP_NAME}_project 即可
        },
        plugins: [
            new DefinePlugin({
                ENV: JSON.stringify(config),
                APP_ENV: JSON.stringify(require(resolve(`story/env/config/${process.env.APP_ENV}.js`)))
            }),
        ]
    },
    pages: {
        index: {
            entry: resolve('story/main'),
            template: 'public/index.html',
            filename: 'index.html',
            title: config.title,
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
    chainWebpack(config) {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('src', resolve('src'))
            .set('plain-design-composition/src/index', resolve('abc'))
            .set('async-validator', resolve('src/libs/async-validator/index.js'))

        if (process.env.NODE_ENV === 'development') {
            config.resolve.alias.set('react-dom', 'react-dom/cjs/react-dom.production.min')
        }
        config.plugins
            .delete('prefetch-index')
            .delete('preload-index')

        /*移除ts-loader，由babel-loader，通过 preset-react, preset-env, preset-typescript来编译tsx文件。否则有ts-loader先编译文件，会导致JSXModel plugin无效*/
        // config.module.rule('tsx').uses.delete('ts-loader')
        config.module.rule('tsx').use('ts-loader').loader('ts-loader').tap(options => {
            if (!options.compilerOptions) {options.compilerOptions = {}}
            options.compilerOptions.jsx = 'preserve'
            return options
        })
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/styles/global-import.scss";`
            }
        }
    },
}
