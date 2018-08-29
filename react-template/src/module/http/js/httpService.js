(function (Module) {
    Module.module('http').service('httpService', ['environment',function (environment) {
        function isAbsoluteUrl(src){
            return /^(https*|file):\/{2}|^\/{2}/i.test(src);
        }
        var $ = jQuery;
        var pathParamReg = new RegExp('\{([^/{}]+)\}','g');
        var requestCache = {};
        var requestTimeoutId = 1;
        var _requestIdKey = '$requestId';
        var _globalRequestIdKey = '$globalRequestId';
        function ensureStartsWith(url){
            if(!url){
                return '';
            }
            if(!/^\//.test(url)){
                url = '/' + url;
            }
            return url;
        }
        var eventListeners = {
            beforeSend:[],
            complete:[],
            error:[]
        };
        this.requestIdKey = function(key){
            if(arguments.length === 0){
                return _requestIdKey;
            }
            _requestIdKey = key;
        };
        this.globalRequestIdKey = function(key){
            if(arguments.length === 0){
                return _globalRequestIdKey;
            }
            _globalRequestIdKey = key;
        };
        this.addEventListener = function (type,handler) {
            if(typeof handler !== 'function'){
                return;
            }
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            var index = listeners.indexOf(handler);
            if(index === -1){
                listeners.push(handler);
            }
        };
        this.removeEventListener = function (type,handler) {
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            if(arguments.length === 1){
                listeners.length = 0;
                return;
            }
            var index = listeners.indexOf(handler);
            if(handler.length >= 0){
                listeners.splice(index,1);
            }
        };
        this.executeEventHandler = function (type,params,context) {
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            listeners.forEach(function (handler) {
                try{
                    handler.apply(context,params);
                }catch(e){
                    console.error(e);
                }
            });
        };
        this.getRequestUrl = function (url,pathParams,queryParams) {
            var apiPrefix = environment.attr('apiPrefix');
            apiPrefix = ensureStartsWith(apiPrefix);
            pathParams = pathParams || {};
            url = url.replace(pathParamReg, function (all,name) {
                var val = pathParams[name];
                if(val === void 0 || val === null){
                    return '';
                }
                return val + '';
            });

            url = ensureStartsWith(url);
            url = apiPrefix + url;

            var a = document.createElement('a');
            a.href = url;
            queryParams = queryParams || {};
            Object.keys(queryParams).forEach(function (key) {
                var value = queryParams[key];
                if(value === undefined || value === null){
                    delete queryParams[key];
                }
            });
            var queryString = Object.keys(queryParams).map(function (key) {
                return [key,queryParams[key]].join('=');
            }).join('&');

            if(a.search){
                a.search = a.search + '&' + queryString;
            }else{
                a.search = queryString;
            }
            return a.href;
        };
        this.request = function (request) {
            var queryParams = request.queryParams || {};
            var globalRequestId = queryParams[_globalRequestIdKey];
            var requestId = globalRequestId || queryParams[_requestIdKey];
            delete queryParams[_requestIdKey];
            delete queryParams[_globalRequestIdKey];

            var url = isAbsoluteUrl(request.url) ? request.url : this.getRequestUrl(request.url,request.pathParams,request.queryParams);
            var currentTimeoutId;
            if(requestId){
                if(!globalRequestId){
                    requestId = url + '_' + requestId;
                }
                currentTimeoutId = requestTimeoutId++;
                requestCache[requestId] = currentTimeoutId;
            }

            var method = request.method;
            if(!method){
                method = request.data ? 'POST' : 'GET';
            }
            var async = request.async;
            if(typeof async !== 'boolean'){
                async = true;
            }

            var data = request.data;
            if(data){
                data = JSON.stringify(data);
            }

            var _this = this;
            var promise = new Promise(function(resolve,reject){
                $.ajax({
                    method:method,
                    url:url,
                    cache:false,
                    async:async,
                    beforeSend: function () {
                        _this.executeEventHandler('beforeSend',arguments,_this);
                    },
                    complete: function () {
                        _this.executeEventHandler('complete',arguments,_this);
                    },
                    error: function () {
                        _this.executeEventHandler('error',arguments,_this);
                    },
                    headers:request.headers,
                    dataType:request.dataType,
                    contentType:request.contentType,
                    data:data
                }).then(function (data) {
                    if(currentTimeoutId && requestCache[requestId] !== currentTimeoutId){
                        return;
                    }
                    resolve(data);
                }, function (data) {
                    _this.executeEventHandler('error',arguments,_this);
                    reject(data);
                });
            });
            return promise;
        };
        this.get = function (url,pathParams,queryParams) {
            var request = {
                url:url,
                method:'GET',
                pathParams:pathParams,
                queryParams:queryParams
            }
            return this.request(request);
        };
        this.post = function (url,data,pathParams,queryParams) {
            var request = {
                url:url,
                method:'POST',
                dataType:'json',
                contentType:'application/json',
                data:data,
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
        this.put = function (url,data,pathParams,queryParams) {
            var request = {
                url:url,
                method:'PUT',
                dataType:'json',
                contentType:'application/json',
                data:data,
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
        this.delete = function (url,pathParams,queryParams) {
            var request = {
                url:url,
                method:'DELETE',
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
        this.send = function(option){
            var xhr = new XMLHttpRequest();
            var url = option.url;
            if(!isAbsoluteUrl(url)){
                url = this.getRequestUrl(option.url,option.pathParams,option.queryParams)
            }
            option._xhr = xhr;
            return new Promise(function(resolve,reject){
                try{
                    xhr.open(option.method,url,true);
                    if(typeof option.responseType ==='string'){
                        xhr.responseType = option.responseType;
                    }
                    if(typeof option.responseType ==='string'){
                        xhr.setRequestHeader('Content-Type',option.contentType);
                    }
                    if(typeof option.onprogress === 'function'){
                        xhr.onprogress = option.onprogress;
                    }
                    xhr['onreadystatechange'] = () => {
                        if(xhr.readyState !== 4){
                            return;
                        }
                        var status = xhr.status;
                        var isSuccess = status >= 200 && status < 300 || status === 304;
                        if(isSuccess){
                            resolve(xhr);
                        }else{
                            reject(xhr);
                        }
                    }
                    xhr.send(option.body);
                }catch(e){
                    console.error(e);
                    reject && reject(e);
                }
            });
        };
    }]);
})(HERE.FRAMEWORK.Module);