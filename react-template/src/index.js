import LoadEnvironment from './main/environment';
import main from './main/index';
LoadEnvironment('env/applications.js').then(function (data) {
    main(data);
});