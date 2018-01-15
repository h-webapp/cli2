const webpackRunner = require('./webpack-runner');
const compiler = webpackRunner.compiler;
var hotMiddlewareFn = require('webpack-hot-middleware');
var hotMiddleware = hotMiddlewareFn(compiler, {
    log: false,
    heartbeat: 2000
});
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    })
})
function execute(chain,request,response) {
    hotMiddleware(request,response,chain.next.bind(chain));
}
execute.priority = -1;
exports.execute = execute;