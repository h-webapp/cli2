const path = require('path');
const srcPath = path.resolve(__dirname,'../../src');
const buildSrcPath = path.resolve(__dirname,'../../build-src');
let envMode = 'develop';
module.exports = {
    setMode(mode){
        envMode = mode;
    },
    getSrc(){
        return srcPath;
    },
    getBuildSrc(){
        return buildSrcPath;
    },
    get(){
        return envMode === 'release' ? buildSrcPath : srcPath;
    }
};