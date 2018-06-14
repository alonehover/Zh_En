const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    context: path.resolve(__dirname, ".."), // entry配置项的根目录（绝对路径）
    entry: {
        bundle: "./client/src"
    },
    output: {
        path: path.resolve(__dirname, "../public/dist/"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        publicPath: "/dist/" // 配置cdn
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    "babel-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ["css-hot-loader"].concat(ExtractTextPlugin.extract({
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
                })),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
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
        extensions: [".js", ".json", ".less"]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 热替换
        new webpack.NoEmitOnErrorsPlugin(), // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "server/views/index.tpl.html",
            favicon: "favicon.ico"
        }),
        new ProgressBarPlugin({summary: false}), // build进度条
        new ExtractTextPlugin({     // 提取样式代码
            filename: "[name].css",
            disable: false,
            allChunks: true
        })
    ]
}
