const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');  // 生成html文件

/****项目相关配置(app-config)****/
const APP_NAME_EN = 'xinxi';
const APP_NAME_CN = '便民服务网';
const APP_ASSETS = 'assets/' + APP_NAME_EN;
const APP_TEMPLATE = 'template/' + APP_NAME_EN;

/****项目相关配置(针对移动端自适应解决方案adaptive.js引入)****/
var embedFolder = path.resolve(path.resolve(__dirname), 'app/embed');
var adaptiveFileName = path.resolve(embedFolder, 'adaptive.js');
var adaptiveText = fs.readFileSync(adaptiveFileName, 'utf8');



module.exports = {
    context: path.resolve(__dirname, 'app'),
    entry: {
        app: './index.jsx',
    },
    output: {
        // 文件输出目录
        path: path.resolve(__dirname, './output'),
        // 输出文件名
        filename: APP_ASSETS + '/[name].min.js?[hash]',
        // cmd、amd异步加载脚本配置名称
        chunkFilename: APP_ASSETS + '/[name].chunk.js?[hash]',
        publicPath: '/'
    },
    module: {
        loaders:[
            {
              test: /\.css$/,
              exclude: /\.useable\.css$/,
              loader: "style-loader!css-loader"
            },
            {
              test: /\.useable\.css$/,
              exclude: /node_modules/,
              loader: "style-loader/useable!css-loader"
            },
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            }
        ]
    },
    // 生成sourcemap,便于开发调试
    devtool: '',
    plugins: [
        new HtmlwebpackPlugin({
            title: APP_NAME_CN,
            template: path.join(__dirname, './app/index.html'),
            filename: APP_TEMPLATE + '/index.html',
            minify: {
                minifyJS: true,
                removeComments: true,
                minifyCSS: true
            },
            adaptive: adaptiveText
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: APP_ASSETS + '/commons.js?[hash]',
            minChunks: 2 // 检测被引用两次即被抽离出来
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            "process.env": { 
                NODE_ENV: JSON.stringify("production") 
            }
        }),
        new webpack.ProvidePlugin({
           "$": "zepto"
        })
    ]
};