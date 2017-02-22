// include dependencies
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var proxy = require('http-proxy-middleware');
var morgan = require('morgan');

//应用配置
var config = require('./app.json');

// proxy middleware options
var options = {
    target: 'http://new.net.zhaopin.com', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        '^/api/old-path': '/api/new-path', // rewrite path
        '^/api/remove/path': '/path' // remove base path
    },
    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://new.net.zhaopin.com' to 'http://localhost:8000'
        'dev.localhost:3000': 'http://localhost:8000'
    },
    onError: function(err, req, res) {
        if (err) {
            console.log(err);
        }
    },
    onProxyRes: function(proxyRes, req, res) {
        if (err) {
            console.log(err);
        }
    },
    onProxyReq: function(proxyReq, req, res) {
        if (err) {
            console.log(err);
        }
    }
};

// create the proxy (without context)
var exampleProxy = proxy(options);

// express instance
var app = express();

app.use(morgan('dev'));

//template engine
app.set('views', path.join(__dirname, config.views));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//默认启动页面
app.get('/', function(req, res) {
    res.render('index.html');
});

//加载app.json中的pages
var pagesArr = config.pages;
for (var i = 0; i < pagesArr.length; i++) {
    var page = pagesArr[i];
    app.get(page.url, function(req, res) {
        res.render(page.path);
    });
}

//加载app.json中的staticPages
var staticFileArr = config.staticFiles;
for(var i = 0;i<staticFileArr.length;i++){
    var staticFile = staticFileArr[i];
    app.use(staticFile.url, express.static(__dirname + staticFile.path));
}

// mount `exampleProxy` in web server
// 以/api开头的请求都被代理转发
app.use(['/api'], exampleProxy);

app.listen(config.port,function(){
    console.log('http://localhost:' + config.port);
});