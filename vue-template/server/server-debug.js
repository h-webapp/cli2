'use strict';
const childProcess = require('child_process');
const path = require('path');
var _process = null;
function reStartServer(){
    if(_process){
        _process.kill("SIGINT");
    }
    _process = childProcess.fork('./server/server');
}
reStartServer();
var dirName = path.resolve(__dirname,'../mock');
var buildDir = path.resolve(__dirname,'../build');
var serverConfDir = path.resolve(__dirname,'../server');
const watch = require('watch');
watch.watchTree(dirName, reStartServer);
watch.watchTree(buildDir, reStartServer);
watch.watchTree(serverConfDir, reStartServer);
