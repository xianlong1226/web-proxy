// include dependencies
var express = require('express');
var proxy = require('http-proxy-middleware');
var morgan = require('morgan');

// express instance
var app = express();

app.use(morgan('dev'));

//配置html文件
app.get(/\.html$/, function(req, res){
    res.sendFile(__dirname + req.path);
})
//配置js文件
app.get(/\.js$/, function(req, res){
    res.sendFile(__dirname + req.path);
})
//配置css文件
app.get(/\.css$/, function(req, res){
    res.sendFile(__dirname + req.path);
})
//配置image文件
app.get(/\.(png|jpg|gif)$/, function(req, res){
    res.sendFile(__dirname + req.path);
})

//配置接口代理
var proxy1 = proxy('/api/**', {
    target: 'https://cppm.zhaopin.com', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    pathRewrite: {
        '^/api/old-path' : '/api/new-path',     // rewrite path
        '^/api/remove/path' : '/path'           // remove base path
    },
    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        'dev.localhost:3000' : 'http://localhost:8000'
    },
    headers: {

    }
});
app.use(proxy1);

//服务监听的端口
app.listen(3000, function(){
    console.log('http://localhost:' + 3000);
});