const path = require('path');
const srcDir = require('./util/SrcDir').get();
var runtime = require('./runtime');
var config = Object.assign(runtime.config,{
    production:true,
    minimize:true,
    hotReplace:false,
    sourceMap:false,
    outputDir:path.resolve(srcDir,'../release')
});
runtime.config = Object.assign(runtime.config,config);
module.exports = runtime;