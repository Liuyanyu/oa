const url = 'http://192.168.1.88:9999';
module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: process.env.outputDir,
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
            config.externals = {
                vue: "Vue",
                vuex: "Vuex",
                "vue-router": "VueRouter",
                "element-ui": "ELEMENT"
            };
        } else {
            // 为开发环境修改配置...
        }
    },
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].template = process.env.template;
            return args;
        });
    },
    lintOnSave: true,
    productionSourceMap: false,
    // 配置转发代理
    devServer: {
        disableHostCheck: true,
        port: 8080,
        proxy: {
            '/auth': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
            '/admin': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/admin': '/admin'
                }
            },
            '/code': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/code': '/code'
                }
            },
            "/dep": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/dep": "/dep"
                }
            },
            "/checkwork": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/checkwork": "/checkwork"
                }
            },
            "/project": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/project": "/project"
                }
            },
            "/apply": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/apply": "/apply"
                }
            },
            "/customer": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/customer": "/customer"
                }
            },
            "/standard": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/standard": "/standard"
                }
            },
            "/quartz": {
                target: url,
                ws: true,
                pathRewrite: {
                    "^/quartz": "/quartz"
                }
            },
        }
    }
};
