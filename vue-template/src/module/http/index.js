(function () {
    var Module = HERE.FRAMEWORK.Module;
    Module.module('http', function () {
        this.resource = {
            js:['/node_modules/jquery/dist/jquery.js','js/httpService.js']
        };
    },'env');
})();