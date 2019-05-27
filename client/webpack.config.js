/*
npm install -d copy-webpack-plugin

*/ 
const path=require('path');

module.exports = {
     entry:path.join(__dirname, 'src/index.js'),
     
    output: {
        filename:'main.js',
        path: path.resolve(__dirname,'admin/dist')
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules|bower_components)/,
                use:{
                    loader:'babel-loader'

                }
            },
            {test:/\.vue$/,use:'vue-loader'},
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name:'assets/images/[name].[hash:7].[ext]'
                }
            },
        ]
           
    },
    plugins:[
    ],
    devServer:{
        port:8080,
        // 设置自动拉起浏览器
        open:true,
        // 设置热更新
        hot:true
    }
}