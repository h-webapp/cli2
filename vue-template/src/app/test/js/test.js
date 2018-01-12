var Application = HERE.FRAMEWORK.Application;
Application.app('test-app').service('caseService',function () {
    this.getCase = function () {
        console.log('test1');
    }
});