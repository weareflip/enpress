const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');

const CleanPlugin = require('clean-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[hash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        app: './resources/assets/index.js',
    },
    output: {
        path: path.resolve('public/dist/'),
        filename: 'js/[name].[hash].js',
        publicPath: '/dist/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.vue'],
        alias: {
            vue: 'vue/dist/vue.js',
            components: path.resolve(__dirname, './resources/assets/js/components'),
            styles: path.resolve(__dirname, './resources/assets/scss')

        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    plugins: ['babel-plugin-transform-class-properties'],
                    presets: [
                        ['env', {modules: false}],
                    ],
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015']
                            }
                        },
                        scss: 'vue-style-loader!css-loader!sass-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /icons\.json$/,
                loaders: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: [
                        'css-loader',
                        {
                            loader: 'webfonts-loader',
                            options: {
                                fileName: 'fonts/[fontname].[hash].[ext]'
                            }
                        }
                    ]
                })
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss|.css$/,
                use: extractSass.extract({
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                exclude: [/resources\/assets\/images/],
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[hash].[ext]'
                },
            },
            {
                test: /\.(jpg|jpeg|gif|png|svg)/,
                exclude: [/node_modules/, /resources\/assets\/fonts/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ],
            }
        ]
    },
    plugins: [
        new CleanPlugin('./public/dist'),
        extractSass,
        new AssetsPlugin({
            filename: 'manifest.json',
            path: path.resolve('public/dist/')
        })
    ]
}
