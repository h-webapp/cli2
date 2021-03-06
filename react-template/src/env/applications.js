module.exports = {
    "modules":[
        {"name":"env","url":"module/env/index.js"},
        {"name":"http","url":"module/http/index.js"},
        {"name":"user","url":"module/user/index.js"},
        {"name":"util","url":"module/util/index.js"}
    ],
    "apps":[
        {"name":"common-comp","url":"app/common-comp/index.jsx"},
        {"name":"system","url":"app/system/index.jsx"},
        {"name":"search","url":"app/search/index.jsx"},
        {"name":"browse","url":"app/browse/index.jsx"},
        {"name":"menu","url":"app/menu/index.jsx"},
        {"name":"cube-search","url":"app/cube-search/index.jsx"},
        {"name":"info-dialog","url":"app/info-dialog/index.jsx"},
        {"name":"analysis","url":"app/analysis/index.jsx"},
        {"name":"org","url":"app/org/index.jsx"}
    ],
    "init":["init/index.js"],
    "main":["index.js"],
    "attributes":{
        "apiPrefix":"/api"
    }
};