const path = require('path')
const resolve = filePath => path.resolve(__dirname, '../', filePath)
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const outputDir = 'docs'
const publicPath = '/plain-design/'
const port = '3379'
const env = {
    publicPath
}

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: resolve('story/main.tsx'),
    output: {
        path: resolve(outputDir),
        publicPath,
    },
    devtool: "cheap-module-eval-source-map",
    devServer: {
        //热更新插件
        hot: true,
        port,
        //静态文件根目录
        contentBase: outputDir,
        //browserHistory的时候，刷新会报404. 自动重定向到index.html
        historyApiFallback: {
            index: `${publicPath}/index.html`
        },
        /*https://www.webpackjs.com/configuration/stats/        只在发生错误或者有新的编译时输出*/
        stats: 'minimal',
    },
    resolve: {
        //别名
        alias: {
            "@": resolve('src'),
            "~": resolve('node_modules'),
            "async-validator": resolve('src/libs/async-validator/index.js'),
            // "plain-design-composition": "plain-design-composition.tsx",
        },
        //当你加载一个文件的时候,没有指定扩展名的时候，会自动寻找哪些扩展名
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                loader: 'babel-loader',
                // exclude: /node_modules(?!.*(plain-design-composition|plain-utils|plain-loading|plain-popper).*)/,
                exclude: /node_modules(?!.*(plain-utils|plain-loading|plain-popper).*)/,
            },
            {
                test: /\.css$/,//css处理顺口
                use: ['style-loader', {//style-loader是把CSS当作一个style标签插入到HTML中
                    loader: 'css-loader',//css-loader是处理CSS中的import 和url
                    options: {importLoaders: 0}
                }, {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    require('autoprefixer')
                                ],
                            ],
                        },
                    }
                }]
            },
            {
                test: /\.scss$/,//处理less
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {importLoaders: 0}
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        require('autoprefixer')
                                    ],
                                ],
                            },
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: `
                                @import "@/styles/global-import.scss";
                            `
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg|jpeg)$/,//处理图片,把图片打包到输出目录中
                use: ['url-loader']
            },
            {
                test: /\.md$/,
                use: ['text-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',//path为相对于context的路径
                        publicPath,
                    }
                }]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Plain Design',
            template: resolve('public/index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        ...(isProduction ? [new BundleAnalyzerPlugin()] : []),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(env),
        }),
        new FriendlyErrorsWebpackPlugin({
            // 成功的时候输出
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://localhost:${port}${publicPath}`]
            },
            // 是否每次都清空控制台
            clearConsole: true,
        }),
        new webpack.DefinePlugin({
            APP_ENV: JSON.stringify(require(resolve(`story/env/config/${process.env.APP_ENV}.js`)))
        })
    ],
}