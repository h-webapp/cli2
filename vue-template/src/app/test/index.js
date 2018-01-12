import './css/test.css';
var Application = HERE.FRAMEWORK.Application;
Application.app('test-app',function () {
    import('./js/test.js').then(function () {
        var tec = 'testImport';

    });
});