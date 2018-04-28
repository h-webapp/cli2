module.exports = {
    "modules":[
        {"name":"env","url":"module/env/index.js"},
        {"name":"http","url":"module/http/index.js"},
        {"name":"user","url":"module/user/index.js"},
        {"name":"util","url":"module/util/index.js"}
    ],
    "apps":[
        {"name":"system","url":"app/system/index.js"},
        {"name":"search","url":"app/search/index.js"},
        {"name":"org","url":"app/org/index.js"}
    ],
    "init":["init/index.js"],
    "main":["index.js"],
    "attributes":{
        "apiPrefix":"/api"
    }
};