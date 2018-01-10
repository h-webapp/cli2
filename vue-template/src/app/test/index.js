import Application from 'webapp-core';
import './css/test.css';
Application.app('test-app',function () {
    import('./js/test.js').then(function () {
        var tec = 'testImport11';

    });
});