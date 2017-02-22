# web-proxy
express + http-proxy-middleware 搭建的web前端代理

第一步，cnpm install
第二步，node app.js 

然后在浏览器里访问：http://localhost:4000

app.json为全局配置文件
{
    "port": 4000,//监听的端口号
    "views": "views",//页面所在的文件夹根目录
    "pages":[//页面访问url和文件路径（相对于views配置的文件夹）
        {"url":"/index","path":"index.html"},
        {"url":"/test/index","path":"test/index.html"}
    ],
    "staticFiles":[//静态文件配置
        {"url":"/css","path":"/public/css"},
        {"url":"/js","path":"/public/js"},
        {"url":"/images","path":"/public/images"}
    ]
}
