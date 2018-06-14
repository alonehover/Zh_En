const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, ".."), // entry配置项的根目录（绝对路径）
    entry: {
        bundle: "./client/src",
        multi: "./client/src/multiPage",
        vendor: [
            "react",
            "react-dom"
        ]
    },
    output: {
        path: path.resolve(__dirname, "../public/dist/"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: "js/[name].chunk.[chunkhash:8].js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    "babel-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 1
                            }
                        }, {
                            loader: "postcss-loader"
                        },
                        "less-loader"
                    ]
                }),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader"
                    }
                ],
                include: /node_modules/
            },
            {
                test: /\.(gif|jpg|png)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "img/[name].[hash:6].[ext]"
                }
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "font/[name].[hash:6].[ext]"
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    minimize: false
                }
            }
        ]
    },
    resolve: {
        extensions: [".web.js", ".js", ".jsx", ".json", ".less"]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.optimize.SplitChunksPlugin(),
        new CleanWebpackPlugin([
            "public/dist/*"
        ], { root: process.cwd() }),  // option默认路径
        new webpack.NoEmitOnErrorsPlugin(), // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
        new HtmlWebpackPlugin({
            filename: "./views/index.html",
            template: "./server/views/index.tpl.html",
            favicon: "./favicon.ico"
        }),
        new ProgressBarPlugin({summary: false}), // build进度条
        new ExtractTextPlugin({     // 提取样式代码
            filename: "css/[name].[hash:8].css",
            disable: false,
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ]
}
