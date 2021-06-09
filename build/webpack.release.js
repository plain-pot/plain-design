const path = require('path')
const resolve = filePath => path.resolve(__dirname, '../', filePath)
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outputDir = 'dist'

module.exports = {
    mode: 'production',
    entry: {
        index: resolve('src/index.ts'),
    },
    externals: {
        'plain-design-composition': {
            root: 'PlainDesignComposition',
            commonjs: 'plain-design-composition',
            commonjs2: 'plain-design-composition',
        },
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
        },
        react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
        },
    },
    output: {
        path: resolve(outputDir),
        filename: 'plain-design.min.js',
        libraryTarget: 'umd',
        // libraryExport: 'default',
        library: 'PlainDesign',
        globalObject: 'this'
    },
    resolve: {
        //别名
        alias: {
            "@": resolve('src'),// @指向src
            "~": resolve('node_modules')//~指向node_modules
        },
        //当你加载一个文件的时候,没有指定扩展名的时候，会自动寻找哪些扩展名
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({filename: 'plain-design.min.css'}),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
        new BundleAnalyzerPlugin({analyzerMode: 'static'}),
    ],
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules(?!.*(plain-utils|plain-loading|plain-popper).*)/,
            },
            {
                test: /\.css$/,//css处理顺口
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
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
        ]
    },

}