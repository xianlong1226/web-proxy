module.exports = [{
    url: ['/api'],
    config: {
        target: 'http://new.net.zhaopin.com', // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
            '^/api/old-path': '/api/new-path', // rewrite path
            '^/api': '' // remove base path
        },
        router: {
            // when request.headers.host == 'dev.localhost:3000',
            // override target 'http://new.net.zhaopin.com' to 'http://localhost:8000'
            'dev.localhost:3000': 'http://localhost:8000'
        },
        onError: function(err, req, res) {
            if (err) {
                console.error(err.stack);
            }
        },
        onProxyRes: function(proxyRes, req, res) {
            console.log(proxyRes);
        },
        onProxyReq: function(proxyReq, req, res) {
            console.log(proxyReq);
        }
    }
}];