// include dependencies
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var proxy = require('http-proxy-middleware');
var morgan = require('morgan');

//应用配置
var appConfig = require('./app.json');

// express instance
var app = express();

app.use(morgan('dev'));

//template engine
app.set('views', path.join(__dirname, appConfig.views));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//默认启动页面
app.get('/', function(req, res) {
    res.render('index.html');
});

//加载app.json中的pages
var pagesArr = appConfig.pages;
for (var i = 0; i < pagesArr.length; i++) {
    var page = pagesArr[i];
    app.get(page.url, function(req, res) {
        res.render(page.path);
    });
}

//加载app.json中的staticPages
var staticFileArr = appConfig.staticFiles;
for(var i = 0;i<staticFileArr.length;i++){
    var staticFile = staticFileArr[i];
    app.use(staticFile.url, express.static(__dirname + staticFile.path));
}

//替换页面中用到的配置文件
if(appConfig.webConfigPath){
    var pageConfigText;
    if(app.get('env') === 'development'){
        pageConfigText = fs.readFileSync(appConfig.webDevConfigPath,'utf8');
    }else{
        pageConfigText = fs.readFileSync(appConfig.webProdConfigPath,'utf8');
    }
    fs.writeFileSync(appConfig.webConfigPath,pageConfigText,'utf8');
}

//挂载代理到具体请求
var proxyConfigArr;
if (app.get('env') === 'development') {
    proxyConfigArr = require('./proxy.dev.config.js');
}else{
    proxyConfigArr = require('./proxy.prod.config.js');
}
for(var i=0;i<proxyConfigArr.length;i++){
    var proxyConfig = proxyConfigArr[i];

    // create the proxy (without context)
    var proxyInstance = proxy(proxyConfig.config);

    // mount `proxyInstance` in web server
    app.use(proxyConfig.url, proxyInstance);
}

app.listen(appConfig.port,function(){
    console.log('http://localhost:' + appConfig.port);
});