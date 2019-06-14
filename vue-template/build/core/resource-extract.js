const fs = require('fs');
const path = require('path');
const _resources = new Map();
let _resourcesRel = {};
let concatItems = [];
let processed = new Map();
let cssDependencies = new Map();
const resources = {
    set: function (key, value) {
        let count = _resourcesRel[key] || 1;
        if (this.has(key)) {
            count++;
        }
        _resourcesRel[key] = count;
        return _resources.set(key, value);
    },
    remove: function (key) {
        _resources.delete(key);
    },
    get: function (key) {
        return _resources.get(key);
    },
    has: function (key) {
        return _resources.has(key);
    },
    entries: function () {
        return _resources.entries();
    },
    getResourceRel: function () {
        return _resourcesRel;
    },
    getConcatItems: function () {
        return concatItems;
    },
    addConcatItem: function (concat) {
        concatItems.push(concat);
    },
    setCssDep:function (file,dep) {
        return cssDependencies.set(file,dep);
    },
    getCssDep:function (file) {
        return cssDependencies.get(file);
    }
};
let parseLoaders = require('./loaders');
const buildConfigFile = path.resolve(__dirname, '../../task-config.js');
if(fs.existsSync(buildConfigFile)){
    let _loaders = require(buildConfigFile).loaders() || [];
    parseLoaders = parseLoaders.concat(_loaders);
}

function extractFileUrl(files,rootFile){

    const page = this;
    files = [].concat(files);
    files.forEach(function (file) {

        if(processed.has(file)){
            return;
        }
        processed.set(file,true);
        if(!fs.existsSync(file) || !fs.statSync(file).isFile()){
            return;
        }
        const content = fs.readFileSync(file).toString();
        parseLoaders.forEach(function (loader) {
            if(!file.match(loader.fileRule)){
                return;
            }
            loader.loader.call({
                file:file,
                page:page,
                execute:extractFileUrl.bind(page),
                root:rootFile || file
            },content,resources);
        });
    });
    return resources;
}
extractFileUrl.resources = resources;
module.exports = extractFileUrl;

